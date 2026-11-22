import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Maximize2, Pause, Play, RotateCcw } from 'lucide-react';
import { POINTS_3D, type Point3D } from '../data/acupoints';
import { buildIrlHumanBody, createIrlSkinTextures } from './irlBodyBuilder';

interface MiniBody3DProps {
  selectedPoint: Point3D;
  onSelectPoint: (p: Point3D) => void;
  highlightedIds?: string[] | null;
  onOpenFull3D: () => void;
}

const isSoftwareGl = (() => {
  if (typeof document === 'undefined') return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
})();

const _snapRay = new THREE.Raycaster();
const _snapOrigin = new THREE.Vector3();
const _snapDir = new THREE.Vector3();
const _snapInward = new THREE.Vector3();

function snapMiniPoint(pos: [number, number, number], normal: [number, number, number], group: THREE.Group): THREE.Vector3 {
  const base = new THREE.Vector3(...pos);
  _snapDir.set(normal[0], normal[1], normal[2]);
  if (_snapDir.lengthSq() < 1e-5) _snapDir.set(0, 0, 1);
  else _snapDir.normalize();

  _snapOrigin.copy(base).addScaledVector(_snapDir, 0.24);
  _snapInward.copy(_snapDir).negate();
  _snapRay.set(_snapOrigin, _snapInward);
  _snapRay.near = 0.01;
  _snapRay.far = 0.54;
  const hits = _snapRay.intersectObject(group, true);
  const surfaceHit = hits.find((h) => h.object.renderOrder === 5) ?? hits[0];
  if (surfaceHit && surfaceHit.point.distanceTo(base) < 0.16) {
    return surfaceHit.point.clone().addScaledVector(_snapDir, 0.022);
  }
  return base;
}

export const MiniBody3D: React.FC<MiniBody3DProps> = ({
  selectedPoint,
  onSelectPoint,
  highlightedIds,
  onOpenFull3D,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [spin, setSpin] = useState(true);
  const [facingBack, setFacingBack] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const stateRef = useRef({
    selectedPoint,
    highlightedIds,
    spin,
    onSelectPoint,
  });
  stateRef.current = { selectedPoint, highlightedIds, spin, onSelectPoint };

  const cameraGoalRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3; active: boolean }>({
    pos: new THREE.Vector3(0.35, 0.06, 5.15),
    target: new THREE.Vector3(0, 0.02, 0),
    active: false,
  });

  const sceneRefs = useRef<{
    bodyGroup?: THREE.Group;
    markerGroup?: THREE.Group;
    clickableMeshes: THREE.Object3D[];
    snappedCache: Map<string, THREE.Vector3>;
    requestRender?: () => void;
  }>({ clickableMeshes: [], snappedCache: new Map() });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 260;
    const height = container.clientHeight || 310;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#081026');
    scene.fog = new THREE.FogExp2('#081026', 0.048);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 35);
    camera.position.set(0.35, 0.06, 5.15);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const hemiLight = new THREE.HemisphereLight('#dce6f7', '#211c2c', 0.92);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#fff5eb', 1.8);
    keyLight.position.set(2.8, 4.6, 4.4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(512, 512);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#c4d8f2', 0.78);
    fillLight.position.set(-3.8, 2.0, 3.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#dde9ff', 0.88);
    rimLight.position.set(0, 3.0, -4.5);
    scene.add(rimLight);

    // Compact glowing pedestal ring & shadow disc under feet
    const pedestal = new THREE.Group();
    pedestal.position.y = -1.78;
    const ringGeo = new THREE.RingGeometry(0.68, 0.73, 48);
    ringGeo.rotateX(-Math.PI / 2);
    pedestal.add(
      new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({ color: '#5ac8fa', transparent: true, opacity: 0.42, side: THREE.DoubleSide })
      )
    );
    pedestal.add(
      new THREE.Mesh(
        new THREE.CircleGeometry(0.85, 36).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: '#02040c', transparent: true, opacity: 0.55, depthWrite: false })
      )
    );
    scene.add(pedestal);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const { map: skinMap, bumpMap: muscleBump } = createIrlSkinTextures(maxAniso);
    const skinMat = new THREE.MeshPhysicalMaterial({
      color: '#e5a799',
      map: skinMap,
      bumpMap: muscleBump,
      bumpScale: 0.008,
      roughness: 0.55,
      metalness: 0.02,
      clearcoat: 0.05,
    });
    const shortsMat = new THREE.MeshStandardMaterial({ color: '#171b24', roughness: 0.8 });

    const bodyData = buildIrlHumanBody(skinMat, shortsMat);
    const markerGroup = new THREE.Group();
    scene.add(bodyData.root, markerGroup);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 2.6;
    controls.maxDistance = 6.8;
    controls.target.set(0, 0.02, 0);

    const onControlStart = () => {
      cameraGoalRef.current.active = false;
    };
    controls.addEventListener('start', onControlStart);

    const raycaster = new THREE.Raycaster();
    const ptr = new THREE.Vector2();
    let dx = 0;
    let dy = 0;
    const onDown = (e: PointerEvent) => {
      dx = e.clientX;
      dy = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - dx, e.clientY - dy) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      ptr.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ptr.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ptr, camera);
      const hits = raycaster.intersectObjects(sceneRefs.current.clickableMeshes, false);
      if (hits.length > 0) {
        const pt = hits[0].object.userData.point as Point3D | undefined;
        if (pt) stateRef.current.onSelectPoint(pt);
      }
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onUp);

    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    const clock = new THREE.Clock();

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const st = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (st === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const requestRender = () => {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        const dt = Math.min(clock.getDelta(), 0.05);
        const st = stateRef.current;

        controls.autoRotate = !isSoftwareGl && st.spin;
        controls.autoRotateSpeed = 1.4;

        const goal = cameraGoalRef.current;
        if (goal.active) {
          camera.position.x = THREE.MathUtils.damp(camera.position.x, goal.pos.x, 6.0, dt);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, goal.pos.y, 6.0, dt);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, goal.pos.z, 6.0, dt);
          controls.target.x = THREE.MathUtils.damp(controls.target.x, goal.target.x, 6.0, dt);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, goal.target.y, 6.0, dt);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, goal.target.z, 6.0, dt);
          if (camera.position.distanceTo(goal.pos) < 0.02) goal.active = false;
        }

        controls.update();
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (!disposed && (renderDirty || (!isSoftwareGl && st.spin) || goal.active)) {
            requestRender();
          }
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };

    controls.addEventListener('change', requestRender);
    const onResize = () => {
      const w = container.clientWidth || 260;
      const h = container.clientHeight || 310;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    if (!isSoftwareGl) renderer.compile(scene, camera);

    sceneRefs.current = {
      bodyGroup: bodyData.root,
      markerGroup,
      clickableMeshes: [],
      snappedCache: new Map(),
      requestRender,
    };

    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ro.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', requestRender);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
          else mesh.material.dispose();
        }
      });
      skinMap.dispose();
      muscleBump.dispose();
      skinMat.dispose();
      shortsMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update mini markers when selectedPoint or highlightedIds change
  useEffect(() => {
    const refs = sceneRefs.current;
    if (!refs.bodyGroup || !refs.markerGroup) return;

    while (refs.markerGroup.children.length > 0) {
      const ch = refs.markerGroup.children[0] as THREE.Mesh;
      ch.geometry?.dispose();
      if (Array.isArray(ch.material)) ch.material.forEach((m) => m.dispose());
      else ch.material?.dispose();
      refs.markerGroup.remove(ch);
    }
    refs.clickableMeshes = [];

    const ptsToShow =
      highlightedIds && highlightedIds.length > 0
        ? POINTS_3D.filter((p) => highlightedIds.includes(p.id) && !p.regions.includes('hand'))
        : POINTS_3D.filter((p) => !p.regions.includes('hand')).slice(0, 14);

    // Ensure selectedPoint is always plotted if non-hand
    if (!selectedPoint.regions.includes('hand') && !ptsToShow.some((p) => p.id === selectedPoint.id)) {
      ptsToShow.push(selectedPoint);
    }

    ptsToShow.forEach((p) => {
      let snapped = refs.snappedCache.get(p.id);
      if (!snapped) {
        snapped = snapMiniPoint(p.bodyPos, p.bodyNormal, refs.bodyGroup!);
        refs.snappedCache.set(p.id, snapped);
      }
      const isSelected = p.id === selectedPoint.id;
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(isSelected ? 0.052 : 0.032, 14, 14),
        new THREE.MeshStandardMaterial({
          color: p.c,
          emissive: p.c,
          emissiveIntensity: isSelected ? 1.8 : 0.8,
          roughness: 0.25,
        })
      );
      sphere.position.copy(snapped);
      sphere.userData = { point: p };
      refs.markerGroup!.add(sphere);
      refs.clickableMeshes.push(sphere);
    });

    refs.requestRender?.();
  }, [selectedPoint, highlightedIds]);

  // Trigger render when spin is toggled back on
  useEffect(() => {
    if (spin) sceneRefs.current.requestRender?.();
  }, [spin]);

  const flipFrontBack = () => {
    const nextBack = !facingBack;
    setFacingBack(nextBack);
    setSpin(false);
    cameraGoalRef.current = {
      pos: new THREE.Vector3(0.25, 0.06, nextBack ? -5.15 : 5.15),
      target: new THREE.Vector3(0, 0.02, 0),
      active: true,
    };
    sceneRefs.current.requestRender?.();
  };

  const resetView = () => {
    setFacingBack(false);
    cameraGoalRef.current = {
      pos: new THREE.Vector3(0.35, 0.06, 5.15),
      target: new THREE.Vector3(0, 0.02, 0),
      active: true,
    };
    sceneRefs.current.requestRender?.();
  };

  return (
    <div className="flex flex-col gap-2.5 flex-1">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-white leading-tight">Mini 3D Body Model</h2>
          <p className="text-[11px] text-slate-300">Drag to inspect · Tap dots</p>
        </div>
        <button
          type="button"
          onClick={onOpenFull3D}
          className="veda-btn !py-1 !px-2.5 text-[11px] flex items-center gap-1 whitespace-nowrap"
        >
          <Maximize2 className="w-3 h-3 text-sky-300" /> Full 3D
        </button>
      </div>

      {/* Compact Portrait 3D Body Viewport */}
      <div className="relative h-[300px] lg:flex-1 lg:min-h-[290px] w-full rounded-2xl overflow-hidden bg-[#081026] border border-white/15 select-none">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {contextLost && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 text-xs text-slate-200 z-20">
            Restoring 3D preview…
          </div>
        )}

        {/* Active Point Mini Caption */}
        <div className="pointer-events-none absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
          <span
            className="px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-950 truncate"
            style={{ background: selectedPoint.c }}
          >
            {selectedPoint.id} · {selectedPoint.n.split('(')[0].trim()}
          </span>
        </div>

        {/* Compact Bottom Dock Controls */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-950/88 border border-white/15">
          <button
            type="button"
            onClick={flipFrontBack}
            className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-200 hover:bg-white/10 whitespace-nowrap"
          >
            {facingBack ? 'Front' : 'Back'}
          </button>
          <button
            type="button"
            onClick={() => setSpin((s) => !s)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              spin ? 'bg-sky-500/25 text-sky-200' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            {spin ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            Spin
          </button>
          <button
            type="button"
            onClick={resetView}
            title="Reset Mini 3D View"
            className="p-1 rounded-lg text-slate-300 hover:bg-white/10"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
