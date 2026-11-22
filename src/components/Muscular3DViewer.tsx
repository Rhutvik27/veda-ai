import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ZoomIn, ZoomOut, Crosshair, RotateCcw, Sparkles, Eye, EyeOff, Play, Pause } from 'lucide-react';
import { MERIDIAN_PATHS_3D, POINTS_3D, type Point3D, type Region3D } from '../data/acupoints';
import { buildIrlHumanBody, createIrlSkinTextures } from './irlBodyBuilder';

interface Muscular3DViewerProps {
  region: Region3D;
  onRegionChange?: (r: Region3D) => void;
  selectedPoint: Point3D;
  onSelectPoint: (p: Point3D) => void;
  problemPointIds?: string[] | null;
  showAllPointsOverride?: boolean;
  defaultShowAllPoints?: boolean;
  excludeHandOnBody?: boolean;
  heightClass?: string;
  compact?: boolean;
  focusPointTs?: number;
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



function makeCapsuleLimb(
  a: [number, number, number],
  b: [number, number, number],
  rStart: number,
  rEnd: number,
  material: THREE.Material,
  radialSegments = 20
): THREE.Group {
  const grp = new THREE.Group();
  const p1 = new THREE.Vector3(...a);
  const p2 = new THREE.Vector3(...b);
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const len = dir.length();
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(rEnd, rStart, len, radialSegments, 1), material);
  cyl.castShadow = true;
  cyl.receiveShadow = true;
  grp.add(cyl);

  const capA = new THREE.Mesh(new THREE.SphereGeometry(rStart, 16, 12), material);
  capA.position.y = -len / 2;
  grp.add(capA);

  const capB = new THREE.Mesh(new THREE.SphereGeometry(rEnd, 16, 12), material);
  capB.position.y = len / 2;
  grp.add(capB);

  grp.position.copy(mid);
  grp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return grp;
}

function makeMuscleBulge(
  pos: [number, number, number],
  scale: [number, number, number],
  rot: [number, number, number],
  material: THREE.Material
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), material);
  m.position.set(...pos);
  m.scale.set(...scale);
  m.rotation.set(...rot);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}



function buildMuscularHand(skinMat: THREE.Material, nailMat: THREE.Material, pressMat: THREE.Material) {
  const root = new THREE.Group();

  // Forearm & wrist
  const forearm = makeCapsuleLimb([0, -2.08, 0], [0, -0.85, 0], 0.34, 0.27, skinMat, 24);
  const flexorMed = makeMuscleBulge([-0.08, -1.45, 0.12], [0.17, 0.48, 0.14], [0, 0, 0.05], skinMat);
  const flexorLat = makeMuscleBulge([0.11, -1.42, 0.10], [0.15, 0.45, 0.13], [0, 0, -0.05], skinMat);
  const wrist = makeMuscleBulge([0, -0.82, 0], [0.33, 0.12, 0.19], [0, 0, 0], skinMat);
  root.add(forearm, flexorMed, flexorLat, wrist);

  // Sculpted Palm (palm faces +Z, back faces -Z, thumb on -X)
  const palmCore = makeMuscleBulge([0.0, -0.15, 0.0], [0.46, 0.62, 0.175], [0, 0, 0], skinMat);
  const thenarPad = makeMuscleBulge([-0.32, -0.34, 0.10], [0.22, 0.32, 0.13], [0, 0, 0.32], skinMat);
  const hypothenarPad = makeMuscleBulge([0.33, -0.25, 0.08], [0.13, 0.36, 0.11], [0, 0, -0.06], skinMat);
  const metacarpalBridge = makeMuscleBulge([0.02, 0.35, 0.01], [0.44, 0.15, 0.14], [0, 0, -0.06], skinMat);
  root.add(palmCore, thenarPad, hypothenarPad, metacarpalBridge);

  // Articulated 4 Fingers + Thumb
  const fingersGroup = new THREE.Group();
  const fingerSpecs = [
    { x: -0.33, y: 0.44, lengths: [0.40, 0.28, 0.23], r: [0.095, 0.082, 0.07, 0.058], splay: 0.09 },
    { x: -0.10, y: 0.49, lengths: [0.45, 0.32, 0.25], r: [0.098, 0.084, 0.072, 0.06], splay: 0.02 },
    { x: 0.13, y: 0.45, lengths: [0.41, 0.29, 0.24], r: [0.092, 0.08, 0.068, 0.056], splay: -0.03 },
    { x: 0.34, y: 0.35, lengths: [0.33, 0.23, 0.20], r: [0.08, 0.068, 0.058, 0.048], splay: -0.09 },
  ];

  const fingerJoints: THREE.Group[] = [];

  fingerSpecs.forEach((f) => {
    const fBase = new THREE.Group();
    fBase.position.set(f.x, f.y, 0.01);
    fBase.rotation.z = f.splay;

    let currParent = fBase;
    let currY = 0;
    for (let j = 0; j < 3; j++) {
      const segGrp = new THREE.Group();
      segGrp.position.set(0, currY, 0);
      const len = f.lengths[j];
      segGrp.add(makeCapsuleLimb([0, 0, 0], [0, len, 0], f.r[j], f.r[j + 1], skinMat, 14));
      if (j === 2) {
        const nail = makeMuscleBulge([0, len * 0.72, -f.r[3] * 0.85], [f.r[3] * 0.7, len * 0.3, 0.014], [0, 0, 0], nailMat);
        segGrp.add(nail);
      }
      currParent.add(segGrp);
      fingerJoints.push(segGrp);
      currParent = segGrp;
      currY = len;
    }
    fingersGroup.add(fBase);
  });

  // Opposable Thumb
  const thumbGroup = new THREE.Group();
  thumbGroup.position.set(-0.44, -0.54, 0.08);
  const t1 = makeCapsuleLimb([0, 0, 0], [-0.26, 0.36, 0.05], 0.125, 0.105, skinMat, 14);
  const t2 = makeCapsuleLimb([-0.26, 0.36, 0.05], [-0.42, 0.66, 0.07], 0.105, 0.09, skinMat, 14);
  const t3 = makeCapsuleLimb([-0.42, 0.66, 0.07], [-0.52, 0.92, 0.07], 0.09, 0.078, skinMat, 14);
  const tNail = makeMuscleBulge([-0.50, 0.86, 0.01], [0.05, 0.075, 0.016], [0, 0.2, 0.4], nailMat);
  thumbGroup.add(t1, t2, t3, tNail);
  root.add(fingersGroup, thumbGroup);

  // Animated Pressing Thumb/Finger Demonstrator
  const presser = new THREE.Group();
  const pressTip = makeCapsuleLimb([0, 0, 0], [0.12, 0.18, 0.28], 0.085, 0.10, pressMat, 16);
  const pressArm = makeCapsuleLimb([0.12, 0.18, 0.28], [0.42, 0.45, 0.72], 0.10, 0.13, pressMat, 16);
  presser.add(pressTip, pressArm);
  root.add(presser);

  return { root, fingerJoints, thumbGroup, presser };
}

function buildMuscularLeg(skinMat: THREE.Material) {
  const root = new THREE.Group();

  // Upper thigh & muscular quads (Rectus Femoris, Vastus Medialis teardrop for SP10, Vastus Lateralis)
  const thighCore = makeCapsuleLimb([0, 1.72, 0], [0, 0.32, 0.05], 0.36, 0.25, skinMat, 24);
  const rectusFemoris = makeMuscleBulge([0.0, 1.05, 0.16], [0.16, 0.56, 0.14], [0.05, 0, 0], skinMat);
  const vastusMed = makeMuscleBulge([-0.14, 0.72, 0.14], [0.14, 0.34, 0.14], [0, 0.2, 0.15], skinMat);
  const vastusLat = makeMuscleBulge([0.16, 0.92, 0.08], [0.15, 0.48, 0.14], [0, -0.2, -0.1], skinMat);
  const hamstring = makeMuscleBulge([0.0, 1.05, -0.15], [0.22, 0.55, 0.16], [0, 0, 0], skinMat);
  root.add(thighCore, rectusFemoris, vastusMed, vastusLat, hamstring);

  // Knee Joint & Patella
  const patella = makeMuscleBulge([0.01, 0.24, 0.21], [0.115, 0.115, 0.085], [0, 0, 0], skinMat);
  const kneeJoint = makeMuscleBulge([0, 0.18, 0.02], [0.24, 0.22, 0.23], [0, 0, 0], skinMat);
  const fibulaHead = makeMuscleBulge([0.23, -0.02, 0.04], [0.06, 0.07, 0.06], [0, 0, 0], skinMat);
  root.add(patella, kneeJoint, fibulaHead);

  // Lower Leg (Shin + Sculpted Gastrocnemius Calf)
  const lowerLegGroup = new THREE.Group();
  const shinBone = makeCapsuleLimb([0, 0.12, 0.02], [0, -1.36, -0.04], 0.22, 0.14, skinMat, 22);
  const tibialisAnt = makeMuscleBulge([0.11, -0.45, 0.11], [0.095, 0.42, 0.11], [0, 0, -0.05], skinMat);
  const calfMed = makeMuscleBulge([-0.08, -0.42, -0.14], [0.12, 0.32, 0.13], [-0.08, 0, 0], skinMat);
  const calfLat = makeMuscleBulge([0.09, -0.38, -0.13], [0.115, 0.30, 0.13], [-0.08, 0, 0], skinMat);
  const achilles = makeCapsuleLimb([0, -0.78, -0.14], [0, -1.48, -0.14], 0.06, 0.045, skinMat, 12);
  const malleolusMed = makeMuscleBulge([-0.14, -1.36, -0.02], [0.04, 0.055, 0.055], [0, 0, 0], skinMat);
  const malleolusLat = makeMuscleBulge([0.15, -1.38, -0.03], [0.04, 0.055, 0.055], [0, 0, 0], skinMat);

  // Foot & Toes
  const heel = makeMuscleBulge([0, -1.58, -0.08], [0.12, 0.12, 0.14], [0, 0, 0], skinMat);
  const midfoot = makeCapsuleLimb([0, -1.56, 0.0], [0, -1.62, 0.48], 0.13, 0.145, skinMat, 16);
  const forefoot = makeMuscleBulge([0, -1.63, 0.46], [0.165, 0.08, 0.16], [0, 0, 0], skinMat);
  const bigToe = makeCapsuleLimb([-0.10, -1.64, 0.56], [-0.11, -1.65, 0.72], 0.042, 0.036, skinMat, 10);
  const toes = [-0.04, 0.02, 0.07, 0.12].map((tx, idx) =>
    makeCapsuleLimb([tx, -1.64, 0.56], [tx, -1.66, 0.69 - idx * 0.02], 0.03, 0.024, skinMat, 10)
  );

  lowerLegGroup.add(shinBone, tibialisAnt, calfMed, calfLat, achilles, malleolusMed, malleolusLat, heel, midfoot, forefoot, bigToe, ...toes);
  root.add(lowerLegGroup);

  return { root, lowerLegGroup };
}

function buildMuscularShoulder(skinMat: THREE.Material) {
  const root = new THREE.Group();

  // Upper Torso & Spine (shifted so right shoulder joint sits near +0.52, +0.42, 0)
  const chestCore = makeMuscleBulge([-0.42, 0.05, 0.0], [0.56, 0.58, 0.36], [0, 0, 0], skinMat);
  const pecRight = makeMuscleBulge([-0.04, 0.24, 0.25], [0.34, 0.23, 0.14], [0, -0.22, 0.06], skinMat);
  const pecLeft = makeMuscleBulge([-0.68, 0.24, 0.25], [0.24, 0.21, 0.13], [0, 0.2, -0.05], skinMat);
  const neck = makeCapsuleLimb([-0.45, 0.54, -0.02], [-0.45, 1.24, 0.02], 0.20, 0.17, skinMat, 22);
  const skullBase = makeMuscleBulge([-0.45, 1.32, -0.02], [0.22, 0.22, 0.24], [0, 0, 0], skinMat);
  const scmRight = makeCapsuleLimb([-0.34, 1.15, -0.04], [-0.28, 0.58, 0.22], 0.055, 0.045, skinMat, 12);
  const trapezius = makeMuscleBulge([-0.14, 0.56, -0.14], [0.38, 0.16, 0.21], [0.2, 0, -0.28], skinMat);
  const scapulaMuscle = makeMuscleBulge([0.08, 0.08, -0.25], [0.24, 0.28, 0.13], [0, 0.15, 0.1], skinMat);
  const upperSpine = makeCapsuleLimb([-0.45, -0.4, -0.26], [-0.45, 0.85, -0.25], 0.12, 0.10, skinMat, 14);
  const clavicle = makeCapsuleLimb([-0.36, 0.52, 0.22], [0.46, 0.48, 0.08], 0.055, 0.05, skinMat, 12);
  root.add(chestCore, pecRight, pecLeft, neck, skullBase, scmRight, trapezius, scapulaMuscle, upperSpine, clavicle);

  // Articulated Shoulder + Upper Arm Group
  const armGroup = new THREE.Group();
  armGroup.position.set(0.48, 0.42, 0);
  const deltAnt = makeMuscleBulge([0.08, -0.08, 0.12], [0.18, 0.24, 0.14], [0.2, 0, -0.2], skinMat);
  const deltLat = makeMuscleBulge([0.14, -0.06, 0.0], [0.19, 0.26, 0.17], [0, 0, -0.15], skinMat);
  const deltPost = makeMuscleBulge([0.07, -0.08, -0.13], [0.17, 0.23, 0.14], [-0.2, 0, -0.2], skinMat);
  const humerusShaft = makeCapsuleLimb([0.06, -0.10, 0], [0.28, -1.38, 0.04], 0.19, 0.15, skinMat, 20);
  const biceps = makeMuscleBulge([0.17, -0.68, 0.10], [0.13, 0.34, 0.13], [0, 0, 0.15], skinMat);
  const triceps = makeMuscleBulge([0.16, -0.68, -0.11], [0.13, 0.34, 0.13], [0, 0, 0.15], skinMat);
  const elbowForearm = makeCapsuleLimb([0.28, -1.36, 0.04], [0.35, -1.78, 0.18], 0.14, 0.12, skinMat, 16);
  armGroup.add(deltAnt, deltLat, deltPost, humerusShaft, biceps, triceps, elbowForearm);
  root.add(armGroup);

  return { root, armGroup };
}

function getPointRegionPos(p: Point3D, region: Region3D): { pos: [number, number, number]; normal: [number, number, number] } | null {
  if (region === 'body') return { pos: p.bodyPos, normal: p.bodyNormal };
  if (region === 'hand' && p.handPos) return { pos: p.handPos, normal: p.handNormal || [0, 0, 1] };
  if (region === 'leg' && p.legPos) return { pos: p.legPos, normal: p.legNormal || [0, 0, 1] };
  if (region === 'shoulder' && p.shoulderPos) return { pos: p.shoulderPos, normal: p.shoulderNormal || [0, 0, 1] };
  return null;
}

const _snapRay = new THREE.Raycaster();
const _snapOrigin = new THREE.Vector3();
const _snapDir = new THREE.Vector3();
const _snapInward = new THREE.Vector3();

function snapPositionToSurface(
  pos: [number, number, number],
  normal: [number, number, number] | null,
  regionGroup: THREE.Group | undefined,
  offsetOut = 0.014
): THREE.Vector3 {
  const base = new THREE.Vector3(pos[0], pos[1], pos[2]);
  if (!regionGroup) return base;

  regionGroup.updateMatrixWorld(true);

  if (normal) {
    _snapDir.set(normal[0], normal[1], normal[2]);
  } else {
    _snapDir.set(pos[0], 0, pos[2]);
  }
  if (_snapDir.lengthSq() < 1e-5) {
    _snapDir.set(0, 0, 1);
  } else {
    _snapDir.normalize();
  }

  _snapOrigin.copy(base).addScaledVector(_snapDir, 0.26);
  _snapInward.copy(_snapDir).negate();
  _snapRay.set(_snapOrigin, _snapInward);
  _snapRay.near = 0.01;
  _snapRay.far = 0.56;

  const hits = _snapRay.intersectObject(regionGroup, true);
  const surfaceHit = hits.find((h) => h.object.renderOrder === 5) ?? hits[0];
  if (surfaceHit && surfaceHit.point.distanceTo(base) < 0.16) {
    return surfaceHit.point.clone().addScaledVector(_snapDir, offsetOut);
  }
  return base;
}

export const Muscular3DViewer: React.FC<Muscular3DViewerProps> = ({
  region,
  onRegionChange,
  selectedPoint,
  onSelectPoint,
  problemPointIds,
  showAllPointsOverride,
  defaultShowAllPoints = false,
  excludeHandOnBody = true,
  heightClass = 'h-[520px]',
  compact = false,
  focusPointTs,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const labelsContainerRef = useRef<HTMLDivElement | null>(null);

  const [showMeridians, setShowMeridians] = useState(false);
  const [showMuscles, setShowMuscles] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [pressDemo, setPressDemo] = useState(true);
  const [showAllPoints, setShowAllPoints] = useState(defaultShowAllPoints);
  const [showHandOnBody, setShowHandOnBody] = useState(!excludeHandOnBody);
  const [zoomTrigger, setZoomTrigger] = useState<{ dir: 'in' | 'out' | 'focus' | 'reset'; ts: number } | null>(null);
  const [presetTrigger, setPresetTrigger] = useState<{ pos: [number, number, number]; target: [number, number, number]; ts: number } | null>(null);

  const hasRequestedPoints = Boolean(problemPointIds && problemPointIds.length > 0);
  const problemKey = (problemPointIds || []).join(',');
  const prevProblemKeyRef = useRef(problemKey);
  const prevHasReqRef = useRef(hasRequestedPoints);
  useEffect(() => {
    // When transitioning into an active problem diagnosis, focus cleanly on those top points first
    if (hasRequestedPoints && !prevHasReqRef.current) {
      setShowAllPoints(false);
    } else if (!hasRequestedPoints && prevHasReqRef.current) {
      setShowAllPoints(defaultShowAllPoints);
    }
    prevHasReqRef.current = hasRequestedPoints;
  }, [hasRequestedPoints, defaultShowAllPoints]);

  const effectiveShowAll = showAllPointsOverride ?? showAllPoints;

  const visiblePoints = POINTS_3D.filter((p) => {
    const hasRegion = getPointRegionPos(p, region) !== null;
    if (!hasRegion) return false;
    if (hasRequestedPoints) return problemPointIds!.includes(p.id);
    if (effectiveShowAll) {
      if (region === 'body' && !showHandOnBody && p.regions.includes('hand')) {
        return false;
      }
      return true;
    }
    return false;
  });

  // Refs synced into the Three.js animation loop without tearing down WebGL context
  const stateRef = useRef({
    region,
    selectedPoint,
    visiblePoints,
    showMeridians,
    autoRotate,
    pressDemo,
    onSelectPoint,
  });
  stateRef.current = {
    region,
    selectedPoint,
    visiblePoints,
    showMeridians,
    autoRotate,
    pressDemo,
    onSelectPoint,
  };

  // Focus camera trigger ref
  const cameraGoalRef = useRef<{
    pos: THREE.Vector3;
    target: THREE.Vector3;
    active: boolean;
  }>({
    pos: new THREE.Vector3(0, 0.2, 4.4),
    target: new THREE.Vector3(0, 0, 0),
    active: false,
  });

  const sceneRefs = useRef<{
    camera?: THREE.PerspectiveCamera;
    controls?: OrbitControls;
    markerGroup?: THREE.Group;
    meridianGroup?: THREE.Group;
    regionGroups?: Record<Region3D, THREE.Group>;
    handData?: ReturnType<typeof buildMuscularHand>;
    bodyData?: ReturnType<typeof buildIrlHumanBody>;
    legData?: ReturnType<typeof buildMuscularLeg>;
    shoulderData?: ReturnType<typeof buildMuscularShoulder>;
    clickableMeshes: THREE.Object3D[];
    labelMap: Map<string, { pos: THREE.Vector3; el: HTMLButtonElement; point: Point3D }>;
    snappedCache: Map<string, THREE.Vector3>;
  }>({ clickableMeshes: [], labelMap: new Map(), snappedCache: new Map() });

  const getDefaultCameraForRegion = (r: Region3D): { pos: [number, number, number]; target: [number, number, number] } => {
    if (r === 'hand') return { pos: [0.3, -0.1, 3.6], target: [0, -0.1, 0] };
    if (r === 'leg') return { pos: [0.8, 0.0, 3.5], target: [0, -0.1, 0] };
    if (r === 'shoulder') return { pos: [0.5, 0.4, 3.0], target: [0.1, 0.25, 0] };
    return { pos: [0.0, 0.15, 4.5], target: [0, 0, 0] };
  };

  // Initialize Three.js WebGL scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070d24');
    scene.fog = new THREE.FogExp2('#070d24', 0.045);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    const initCam = getDefaultCameraForRegion(stateRef.current.region);
    camera.position.set(...initCam.pos);

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

    // Studio Environment Reflection (Mandatory RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Three-Point Studio Lighting (Warm sculptural key, neutral-cool fill, soft rim)
    const hemiLight = new THREE.HemisphereLight('#dce6f7', '#211c2c', 0.92);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#fff5eb', 1.80);
    keyLight.position.set(2.8, 4.8, 4.6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -2.5;
    keyLight.shadow.camera.right = 2.5;
    keyLight.shadow.camera.top = 2.5;
    keyLight.shadow.camera.bottom = -2.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#c4d8f2', 0.78);
    fillLight.position.set(-4.0, 2.0, 3.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#dde9ff', 0.88);
    rimLight.position.set(0, 3.0, -4.5);
    scene.add(rimLight);

    // Holographic Pedestal Floor Ring
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.y = -1.84;
    const ringGeo1 = new THREE.RingGeometry(0.95, 1.0, 64);
    ringGeo1.rotateX(-Math.PI / 2);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: '#5ac8fa', transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    pedestalGroup.add(new THREE.Mesh(ringGeo1, ringMat1));

    const ringGeo2 = new THREE.RingGeometry(0.62, 0.65, 64);
    ringGeo2.rotateX(-Math.PI / 2);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: '#34d399', transparent: true, opacity: 0.28, side: THREE.DoubleSide });
    pedestalGroup.add(new THREE.Mesh(ringGeo2, ringMat2));

    const shadowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.1, 48).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: '#02040c', transparent: true, opacity: 0.5, depthWrite: false })
    );
    shadowDisc.position.y = -0.02;
    pedestalGroup.add(shadowDisc);
    scene.add(pedestalGroup);

    // Procedural Anatomical Clay-Pink Écorché & Muscular PBR Materials
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
      clearcoatRoughness: 0.74,
      sheen: 0.30,
      sheenRoughness: 0.74,
      sheenColor: new THREE.Color('#f7d8ce'),
    });

    const shortsMat = new THREE.MeshStandardMaterial({
      color: '#171b24',
      roughness: 0.82,
      metalness: 0.04,
    });

    const nailMat = new THREE.MeshPhysicalMaterial({
      color: '#f5dcd0',
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 0.7,
    });

    const pressMat = new THREE.MeshPhysicalMaterial({
      color: '#f4b59b',
      roughness: 0.38,
      metalness: 0.05,
      transparent: true,
      opacity: 0.86,
    });

    // Build all 4 Anatomical Models (IRL Human Body + Articulated Hand, Leg, Shoulder)
    const bodyData = buildIrlHumanBody(skinMat, shortsMat);
    const handData = buildMuscularHand(skinMat, nailMat, pressMat);
    const legData = buildMuscularLeg(skinMat);
    const shoulderData = buildMuscularShoulder(skinMat);

    const regionGroups: Record<Region3D, THREE.Group> = {
      body: bodyData.root,
      hand: handData.root,
      leg: legData.root,
      shoulder: shoulderData.root,
    };

    Object.entries(regionGroups).forEach(([k, grp]) => {
      grp.visible = k === stateRef.current.region;
      scene.add(grp);
    });

    const meridianGroup = new THREE.Group();
    const markerGroup = new THREE.Group();
    scene.add(meridianGroup, markerGroup);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.minDistance = 1.1;
    controls.maxDistance = 8.5;
    controls.target.set(...initCam.target);

    // Yield scripted camera goals when user drags/zooms manually
    const onControlStart = () => {
      cameraGoalRef.current.active = false;
    };
    controls.addEventListener('start', onControlStart);

    sceneRefs.current = {
      camera,
      controls,
      markerGroup,
      meridianGroup,
      regionGroups,
      handData,
      bodyData,
      legData,
      shoulderData,
      clickableMeshes: [],
      labelMap: new Map(),
      snappedCache: new Map(),
    };

    // Raycaster for direct 3D acupoint selection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downX = 0;
    let downY = 0;

    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(sceneRefs.current.clickableMeshes, false);
      if (hits.length > 0) {
        const pt = hits[0].object.userData.point as Point3D | undefined;
        if (pt) stateRef.current.onSelectPoint(pt);
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Resize observer
    const onResize = () => {
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // Pre-compile shaders if hardware GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Reusable math vectors outside loop (zero GC)
    const _projVec = new THREE.Vector3();
    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();
      const st = stateRef.current;

      // Living anatomical animations per model
      if (st.region === 'body') {
        bodyData.chestGroup.scale.set(
          1 + Math.sin(t * 1.4) * 0.008,
          1,
          1 + Math.sin(t * 1.4) * 0.015
        );
      } else if (st.region === 'hand') {
        handData.fingerJoints.forEach((joint, idx) => {
          joint.rotation.x = 0.06 + Math.sin(t * 1.5 + idx * 0.25) * 0.045;
        });
        // Press demo animation on selected hand point
        const selPos = getPointRegionPos(st.selectedPoint, 'hand');
        if (selPos && st.pressDemo) {
          handData.presser.visible = true;
          const cycle = t % 4.5;
          const approach = cycle < 1 ? 1 - cycle : cycle < 3.5 ? 0 : (cycle - 3.5);
          const circleAngle = cycle >= 1 && cycle < 3.5 ? (cycle - 1) * 5.0 : 0;
          const n = selPos.normal;
          const cached = sceneRefs.current.snappedCache.get(`hand:${st.selectedPoint.id}`);
          const px = cached ? cached.x : selPos.pos[0];
          const py = cached ? cached.y : selPos.pos[1];
          const pz = cached ? cached.z : selPos.pos[2];
          const offsetDist = 0.06 + approach * 0.38;
          handData.presser.position.set(
            px + n[0] * offsetDist + Math.cos(circleAngle) * 0.025 * (1 - approach),
            py + n[1] * offsetDist + Math.sin(circleAngle) * 0.025 * (1 - approach),
            pz + n[2] * offsetDist
          );
          handData.presser.lookAt(px - n[0], py - n[1], pz - n[2]);
        } else {
          handData.presser.visible = false;
        }
      } else if (st.region === 'leg') {
        legData.lowerLegGroup.rotation.x = Math.sin(t * 1.2) * 0.02;
      } else if (st.region === 'shoulder') {
        shoulderData.armGroup.rotation.z = Math.sin(t * 1.3) * 0.035;
        shoulderData.armGroup.rotation.x = Math.cos(t * 1.1) * 0.02;
      }

      // Pulse active acupoint markers
      markerGroup.children.forEach((child) => {
        if (child.userData.isRing) {
          const phase = (t * 1.2) % 1;
          const s = 1 + phase * 1.8;
          child.scale.set(s, s, s);
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          mat.opacity = (1 - phase) * 0.85;
        }
      });

      // Smooth exponential camera damping for focus / preset transitions
      const goal = cameraGoalRef.current;
      if (goal.active) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, goal.pos.x, 5.5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, goal.pos.y, 5.5, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, goal.pos.z, 5.5, dt);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, goal.target.x, 5.5, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, goal.target.y, 5.5, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, goal.target.z, 5.5, dt);
        if (camera.position.distanceTo(goal.pos) < 0.02 && controls.target.distanceTo(goal.target) < 0.02) {
          goal.active = false;
        }
      }

      controls.autoRotate = !isSoftwareGl && st.autoRotate;
      controls.autoRotateSpeed = 1.6;
      controls.update();

      renderer.render(scene, camera);

      // Update projected 2D DOM labels cleanly
      const rectW = container.clientWidth;
      const rectH = container.clientHeight;
      sceneRefs.current.labelMap.forEach(({ pos, el }) => {
        _projVec.copy(pos).project(camera);
        if (_projVec.z > 1) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
        } else {
          const sx = ((_projVec.x + 1) / 2) * rectW;
          const sy = ((-_projVec.y + 1) / 2) * rectH;
          el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -140%)`;
          el.style.opacity = '1';
          el.style.pointerEvents = 'auto';
        }
      });

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ro.disconnect();
      controls.removeEventListener('start', onControlStart);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      const disposeHierarchy = (rootObj: THREE.Object3D) => {
        const mats = new Set<THREE.Material>();
        rootObj.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) mesh.material.forEach((m) => mats.add(m));
            else mats.add(mesh.material);
          }
        });
        mats.forEach((m) => m.dispose());
      };
      disposeHierarchy(bodyData.root);
      disposeHierarchy(handData.root);
      disposeHierarchy(legData.root);
      disposeHierarchy(shoulderData.root);
      disposeHierarchy(markerGroup);
      disposeHierarchy(meridianGroup);
      disposeHierarchy(pedestalGroup);
      skinMap.dispose();
      muscleBump.dispose();
      skinMat.dispose();
      shortsMat.dispose();
      nailMat.dispose();
      pressMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update visible region mesh, meridian tubes, and acupoint spheres whenever props/state change
  useEffect(() => {
    const refs = sceneRefs.current;
    if (!refs.regionGroups || !refs.markerGroup || !refs.meridianGroup) return;

    // 1. Toggle region visibility & body muscle overlay visibility
    (Object.keys(refs.regionGroups) as Region3D[]).forEach((r) => {
      refs.regionGroups![r].visible = r === region;
    });
    refs.bodyData?.muscleMeshes?.forEach((m) => {
      m.visible = showMuscles;
    });

    const activeGroup = refs.regionGroups[region];

    // 2. Rebuild glowing 3D Meridian tubes for active region (snapped flush onto IRL surface)
    while (refs.meridianGroup.children.length > 0) {
      const ch = refs.meridianGroup.children[0] as THREE.Mesh;
      ch.geometry?.dispose();
      if (Array.isArray(ch.material)) ch.material.forEach((m) => m.dispose());
      else ch.material?.dispose();
      refs.meridianGroup.remove(ch);
    }

    if (showMeridians) {
      MERIDIAN_PATHS_3D.forEach((m) => {
        const pts = m[region];
        if (!pts || pts.length < 2) return;
        const vecs = pts.map((p) =>
          region === 'body' ? snapPositionToSurface(p, null, activeGroup, 0.011) : new THREE.Vector3(...p)
        );
        const curve = new THREE.CatmullRomCurve3(vecs);
        const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.012, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: m.color,
          transparent: true,
          opacity: 0.72,
        });
        refs.meridianGroup!.add(new THREE.Mesh(tubeGeo, tubeMat));
      });
    }

    // 3. Rebuild acupoint spheres + pulse rings + DOM floating labels
    while (refs.markerGroup.children.length > 0) {
      const ch = refs.markerGroup.children[0] as THREE.Mesh;
      ch.geometry?.dispose();
      if (Array.isArray(ch.material)) ch.material.forEach((m) => m.dispose());
      else ch.material?.dispose();
      refs.markerGroup.remove(ch);
    }
    refs.clickableMeshes = [];
    refs.labelMap.clear();

    const labelHost = labelsContainerRef.current;
    if (labelHost) labelHost.innerHTML = '';

    visiblePoints.forEach((p) => {
      const rp = getPointRegionPos(p, region);
      if (!rp) return;
      const cacheKey = `${region}:${p.id}`;
      let snapped = refs.snappedCache.get(cacheKey);
      if (!snapped) {
        snapped = snapPositionToSurface(rp.pos, rp.normal, activeGroup, 0.014);
        refs.snappedCache.set(cacheKey, snapped);
      }

      const isSelected = p.id === selectedPoint.id;
      const radius = isSelected ? 0.042 : 0.030;

      const sphereGeo = new THREE.SphereGeometry(radius, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: p.c,
        emissive: p.c,
        emissiveIntensity: isSelected ? 2.1 : 1.0,
        roughness: 0.2,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.copy(snapped);
      sphere.userData = { point: p };
      refs.markerGroup!.add(sphere);
      refs.clickableMeshes.push(sphere);

      if (isSelected) {
        const ringGeo = new THREE.RingGeometry(0.052, 0.068, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: p.c,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(
          snapped.x + rp.normal[0] * 0.015,
          snapped.y + rp.normal[1] * 0.015,
          snapped.z + rp.normal[2] * 0.015
        );
        ring.lookAt(
          snapped.x + rp.normal[0] * 2,
          snapped.y + rp.normal[1] * 2,
          snapped.z + rp.normal[2] * 2
        );
        ring.userData = { isRing: true };
        refs.markerGroup!.add(ring);
      }

      if (labelHost) {
        const dense = visiblePoints.length > 8;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `absolute left-0 top-0 rounded-md font-semibold tracking-tight transition-colors ${
          dense ? 'px-1 py-0 text-[10px]' : 'px-1.5 py-0.5 text-[11px]'
        } ${
          isSelected
            ? 'bg-sky-400 text-slate-950 shadow-lg ring-2 ring-white z-10'
            : 'bg-slate-950/85 text-white border border-white/25 hover:bg-slate-800'
        }`;
        btn.textContent = p.id;
        btn.onclick = () => stateRef.current.onSelectPoint(p);
        labelHost.appendChild(btn);
        refs.labelMap.set(p.id, {
          pos: snapped.clone(),
          el: btn,
          point: p,
        });
      }
    });
  }, [region, selectedPoint, showMeridians, showMuscles, effectiveShowAll, showHandOnBody, problemPointIds]);

  // Smooth camera transition when switching region, updating multi-point set, or selecting a point
  useEffect(() => {
    const def = getDefaultCameraForRegion(region);
    const problemSetChanged = prevProblemKeyRef.current !== problemKey;
    prevProblemKeyRef.current = problemKey;

    const isMultiFullBodySet = (problemPointIds?.length || 0) > 3;
    if (problemSetChanged && isMultiFullBodySet) {
      cameraGoalRef.current = {
        pos: new THREE.Vector3(...def.pos),
        target: new THREE.Vector3(...def.target),
        active: true,
      };
      return;
    }

    const rp = getPointRegionPos(selectedPoint, region);
    const shouldFocusPoint =
      rp &&
      ((hasRequestedPoints && problemPointIds!.includes(selectedPoint.id) && (!isMultiFullBodySet || !problemSetChanged)) ||
        Boolean(focusPointTs));

    if (shouldFocusPoint && rp) {
      const n = new THREE.Vector3(...rp.normal).normalize();
      const target =
        sceneRefs.current.snappedCache.get(`${region}:${selectedPoint.id}`)?.clone() ??
        snapPositionToSurface(rp.pos, rp.normal, sceneRefs.current.regionGroups?.[region], 0.014);
      const dist = region === 'body' ? 2.15 : 1.75;
      const pos = target.clone().addScaledVector(n, dist);
      pos.y += 0.12;
      cameraGoalRef.current = { pos, target, active: true };
    } else {
      cameraGoalRef.current = {
        pos: new THREE.Vector3(...def.pos),
        target: new THREE.Vector3(...def.target),
        active: true,
      };
    }
  }, [region, selectedPoint.id, hasRequestedPoints, problemKey, focusPointTs]);

  // Handle explicit zoom / camera preset button actions
  useEffect(() => {
    if (!zoomTrigger || !sceneRefs.current.camera || !sceneRefs.current.controls) return;
    const cam = sceneRefs.current.camera;
    const ctrl = sceneRefs.current.controls;

    if (zoomTrigger.dir === 'in' || zoomTrigger.dir === 'out') {
      const offset = cam.position.clone().sub(ctrl.target);
      const factor = zoomTrigger.dir === 'in' ? 0.72 : 1.35;
      offset.multiplyScalar(factor);
      const clampedLen = THREE.MathUtils.clamp(offset.length(), 1.1, 8.0);
      offset.setLength(clampedLen);
      cameraGoalRef.current = {
        pos: ctrl.target.clone().add(offset),
        target: ctrl.target.clone(),
        active: true,
      };
    } else if (zoomTrigger.dir === 'focus') {
      const rp = getPointRegionPos(selectedPoint, region);
      if (rp) {
        const n = new THREE.Vector3(...rp.normal).normalize();
        const target =
          sceneRefs.current.snappedCache.get(`${region}:${selectedPoint.id}`)?.clone() ??
          snapPositionToSurface(rp.pos, rp.normal, sceneRefs.current.regionGroups?.[region], 0.014);
        const pos = target.clone().addScaledVector(n, 1.45);
        cameraGoalRef.current = { pos, target, active: true };
      }
    } else if (zoomTrigger.dir === 'reset') {
      const def = getDefaultCameraForRegion(region);
      cameraGoalRef.current = {
        pos: new THREE.Vector3(...def.pos),
        target: new THREE.Vector3(...def.target),
        active: true,
      };
    }
  }, [zoomTrigger]);

  useEffect(() => {
    if (!presetTrigger) return;
    cameraGoalRef.current = {
      pos: new THREE.Vector3(...presetTrigger.pos),
      target: new THREE.Vector3(...presetTrigger.target),
      active: true,
    };
  }, [presetTrigger]);

  const viewPresets: Record<Region3D, { label: string; pos: [number, number, number]; target: [number, number, number] }[]> = {
    body: [
      { label: 'Front', pos: [0, 0.15, 4.5], target: [0, 0, 0] },
      { label: 'Back', pos: [0, 0.15, -4.5], target: [0, 0, 0] },
      { label: 'Side', pos: [4.4, 0.15, 0], target: [0, 0, 0] },
    ],
    hand: [
      { label: 'Palm', pos: [0, -0.1, 3.4], target: [0, -0.1, 0] },
      { label: 'Back of Hand', pos: [0, -0.1, -3.4], target: [0, -0.1, 0] },
    ],
    leg: [
      { label: 'Front Knee', pos: [0.3, 0.0, 3.3], target: [0, -0.1, 0] },
      { label: 'Outer Leg', pos: [3.3, -0.1, 0.3], target: [0, -0.1, 0] },
      { label: 'Inner Leg', pos: [-3.3, -0.1, 0.3], target: [0, -0.1, 0] },
      { label: 'Back Calf', pos: [0.0, -0.1, -3.3], target: [0, -0.1, 0] },
    ],
    shoulder: [
      { label: 'Front', pos: [0.4, 0.35, 3.0], target: [0.1, 0.25, 0] },
      { label: 'Back / UB11', pos: [-0.2, 0.35, -3.0], target: [-0.1, 0.3, 0] },
      { label: 'Top / Side', pos: [2.8, 0.9, 1.2], target: [0.2, 0.3, 0] },
    ],
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden bg-[#070d24] border border-white/15 select-none`}>
      {/* Dedicated Empty Mount Ref for Three.js WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Projected DOM Acupoint Labels */}
      <div ref={labelsContainerRef} className="pointer-events-none absolute inset-0 overflow-hidden" />

      {/* Top-Left Minimal Region Switcher */}
      {onRegionChange && (
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 p-1 rounded-xl webgl-hud-surface">
          {(['body', 'leg', 'shoulder', 'hand'] as Region3D[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRegionChange(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                region === r ? 'bg-sky-500 text-slate-950' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              {r === 'body' ? '3D Body' : r === 'hand' ? '3D Hand' : r === 'leg' ? '3D Leg & Knee' : '3D Shoulder'}
            </button>
          ))}
        </div>
      )}

      {/* Top-Right Zoom Controls (No backdrop-blur over WebGL) */}
      <div className="absolute top-3 right-3 flex items-center gap-1 p-1 rounded-xl webgl-hud-surface">
        <button
          type="button"
          title="Zoom In"
          onClick={() => setZoomTrigger({ dir: 'in', ts: Date.now() })}
          className="p-1.5 rounded-lg text-slate-100 hover:bg-white/15"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Zoom Out"
          onClick={() => setZoomTrigger({ dir: 'out', ts: Date.now() })}
          className="p-1.5 rounded-lg text-slate-100 hover:bg-white/15"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Zoom to Active Point"
          onClick={() => setZoomTrigger({ dir: 'focus', ts: Date.now() })}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-sky-500/25 text-sky-200 hover:bg-sky-500/40"
        >
          <Crosshair className="w-3.5 h-3.5" />
          {!compact && <span>Zoom Point</span>}
        </button>
        <button
          type="button"
          title="Reset View"
          onClick={() => setZoomTrigger({ dir: 'reset', ts: Date.now() })}
          className="p-1.5 rounded-lg text-slate-100 hover:bg-white/15"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Unified Bottom Control Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 max-w-[96%] flex flex-wrap items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-2xl webgl-hud-surface">
        {viewPresets[region].map((vp) => (
          <button
            key={vp.label}
            type="button"
            onClick={() => setPresetTrigger({ pos: vp.pos, target: vp.target, ts: Date.now() })}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-100 hover:bg-white/15 whitespace-nowrap"
          >
            {vp.label}
          </button>
        ))}

        <span className="h-4 w-px bg-white/20 mx-0.5" />

        <button
          type="button"
          onClick={() => setShowMeridians((v) => !v)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
            showMeridians ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40' : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Meridians
        </button>

        {region === 'body' && (
          <button
            type="button"
            onClick={() => setShowMuscles((v) => !v)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              showMuscles ? 'bg-rose-500/25 text-rose-200 border border-rose-400/40' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            {showMuscles ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Muscles
          </button>
        )}

        {region === 'hand' && (
          <button
            type="button"
            onClick={() => setPressDemo((v) => !v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              pressDemo ? 'bg-pink-500/25 text-pink-200 border border-pink-400/40' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            Press Demo
          </button>
        )}

        <button
          type="button"
          onClick={() => setAutoRotate((v) => !v)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
            autoRotate ? 'bg-sky-500/25 text-sky-200 border border-sky-400/40' : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          Spin
        </button>

        {showAllPointsOverride === undefined && (
          <button
            type="button"
            onClick={() => setShowAllPoints((v) => !v)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              showAllPoints
                ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            {showAllPoints ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {showAllPoints
              ? 'Showing Body Points'
              : hasRequestedPoints
              ? 'Top Relief Points Only'
              : 'Show All Points'}
          </button>
        )}

        {region === 'body' && effectiveShowAll && !hasRequestedPoints && (
          <button
            type="button"
            onClick={() => setShowHandOnBody((v) => !v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              !showHandOnBody
                ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            {showHandOnBody ? 'Body + Hand Points' : 'Non-Hand Body Only'}
          </button>
        )}
      </div>
    </div>
  );
};
