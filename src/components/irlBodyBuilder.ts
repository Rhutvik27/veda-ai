import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function gauss(x: number, mu: number, sigma: number): number {
  const d = (x - mu) / sigma;
  return Math.exp(-0.5 * d * d);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/**
 * High-resolution subtle myofibril & vascular micro-grain albedo + bump texture
 */
export function createIrlSkinTextures(maxAnisotropy: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 360; i++) {
    const px = (i * 97 + 31) % 512;
    const py = (i * 151 + 17) % 512;
    const r = 8 + (i % 16);
    const g = ctx.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, i % 2 === 0 ? 'rgba(235, 200, 196, 0.08)' : 'rgba(205, 165, 160, 0.07)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(px - r, py - r, r * 2, r * 2);
  }

  for (let x = 0; x < 512; x += 2) {
    const alpha = x % 4 === 0 ? 0.032 : 0.018;
    ctx.fillStyle = x % 6 === 0 ? `rgba(175, 105, 100, ${alpha})` : `rgba(255, 240, 238, ${alpha})`;
    ctx.fillRect(x, 0, 1, 512);
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = maxAnisotropy;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bctx = bumpCanvas.getContext('2d')!;
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, 512, 512);

  for (let x = 0; x < 512; x += 3) {
    bctx.fillStyle = x % 6 === 0 ? 'rgba(170, 170, 170, 0.24)' : 'rgba(92, 92, 92, 0.22)';
    bctx.fillRect(x, 0, 1.5, 512);
  }
  for (let i = 0; i < 2400; i++) {
    const px = (i * 73 + 19) % 512;
    const py = (i * 127 + 41) % 512;
    bctx.fillStyle = i % 2 === 0 ? 'rgba(155,155,155,0.18)' : 'rgba(105,105,105,0.18)';
    bctx.fillRect(px, py, 2, 2);
  }

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(4, 3);
  bumpMap.anisotropy = maxAnisotropy;

  return { map, bumpMap };
}

interface ParametricSurfaceOpts {
  uSegs: number;
  vSegs: number;
  evalVertex: (u: number, v: number, outPos: THREE.Vector3, outColor?: THREE.Color) => void;
  withColors?: boolean;
}

function buildContinuousSurface({
  uSegs,
  vSegs,
  evalVertex,
  withColors = false,
}: ParametricSurfaceOpts): THREE.BufferGeometry {
  const positions: number[] = [];
  const colors: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const pos = new THREE.Vector3();
  const col = new THREE.Color();
  const stride = uSegs + 1;

  for (let iv = 0; iv <= vSegs; iv++) {
    const v = iv / vSegs;
    for (let iu = 0; iu <= uSegs; iu++) {
      const u = iu / uSegs;
      evalVertex(u, v, pos, withColors ? col : undefined);
      positions.push(pos.x, pos.y, pos.z);
      if (withColors) colors.push(col.r, col.g, col.b);
      uvs.push(u, v);
    }
  }

  for (let iv = 0; iv < vSegs; iv++) {
    for (let iu = 0; iu < uSegs; iu++) {
      const a = iv * stride + iu;
      const b = a + 1;
      const c = (iv + 1) * stride + iu;
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  if (withColors) geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function mergePartGeometries(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const nonIndexed = parts.map((g) => {
    const clean = g.index ? g.toNonIndexed() : g.clone();
    if (!clean.attributes.normal) clean.computeVertexNormals();
    for (const key of Object.keys(clean.attributes)) {
      if (key !== 'position' && key !== 'normal') {
        clean.deleteAttribute(key);
      }
    }
    g.dispose();
    return clean;
  });
  const merged = mergeGeometries(nonIndexed, false);
  nonIndexed.forEach((g) => g.dispose());
  return merged || new THREE.BufferGeometry();
}

function makeTube(
  pts: [number, number, number][],
  radius: number,
  tubularSegments = 20,
  radialSegments = 7
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
  return new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
}

function makeTranslated(geo: THREE.BufferGeometry, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) {
  if (sx !== 1 || sy !== 1 || sz !== 1) geo.scale(sx, sy, sz);
  geo.translate(x, y, z);
  return geo;
}

/**
 * Builds the Combined Holographic Multi-System Human Anatomy:
 * - Outer translucent ice-blue Fresnel glass-rim body silhouette (snaps all acupoints cleanly)
 * - Semi-translucent striated Anatomical Muscular System (pectorals, 6-pack abs, serratus, obliques,
 *   deltoids, biceps/triceps, forearms, quads/IT band/sartorius, calves/Achilles, trapezius, glutes, head muscles)
 * - Interior Skeletal Core (Cranium, Spine, Sternum, 10-pair Ribcage, Clavicles, Pelvis, Limb bones)
 * - Glowing Crimson Arterial Network, Electric-Blue Venous Network & Golden-Yellow Nervous System
 */
export function buildIrlHumanBody(skinMatBase: THREE.MeshPhysicalMaterial, shortsMat: THREE.MeshStandardMaterial) {
  const root = new THREE.Group();
  const chestGroup = new THREE.Group();
  const chestMuscleGroup = new THREE.Group();
  const muscleMeshes: THREE.Mesh[] = [];
  chestGroup.add(chestMuscleGroup);
  root.add(chestGroup);

  // 1. OUTER FRESNEL HOLOGRAPHIC SHELL MATERIAL
  const shellMat = skinMatBase.clone();
  shellMat.color = new THREE.Color('#7ca8e8');
  shellMat.map = null;
  shellMat.bumpMap = null;
  shellMat.vertexColors = false;
  shellMat.transparent = true;
  shellMat.opacity = 0.14;
  shellMat.depthWrite = false;
  shellMat.side = THREE.FrontSide;
  shellMat.roughness = 0.16;
  shellMat.metalness = 0.08;
  shellMat.clearcoat = 0.65;
  shellMat.clearcoatRoughness = 0.12;
  shellMat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
      vec3 fViewDir = normalize(vViewPosition);
      float fRim = pow(1.0 - clamp(abs(dot(normalize(vNormal), fViewDir)), 0.0, 1.0), 2.35);
      vec3 fEdgeCol = mix(vec3(0.32, 0.58, 0.98), vec3(0.88, 0.95, 1.0), fRim);
      gl_FragColor.rgb += fEdgeCol * fRim * 1.15;
      gl_FragColor.a = clamp(0.04 + fRim * 0.78, 0.04, 0.84);
      #include <dithering_fragment>
      `
    );
  };
  shellMat.customProgramCacheKey = () => 'veda_hologram_fresnel_shell_v2';

  // 2. SEMI-TRANSLUCENT STRIATED ANATOMICAL MUSCLE MATERIAL (Reveals red/blue/yellow vessels right through fibers)
  const muscleMat = skinMatBase.clone();
  muscleMat.color = new THREE.Color('#ffffff');
  muscleMat.vertexColors = true;
  muscleMat.transparent = true;
  muscleMat.opacity = 0.42;
  muscleMat.depthWrite = false;
  muscleMat.side = THREE.FrontSide;
  muscleMat.roughness = 0.46;
  muscleMat.metalness = 0.04;
  muscleMat.bumpScale = 0.0085;
  muscleMat.emissive = new THREE.Color('#3b0e14');
  muscleMat.emissiveIntensity = 0.32;

  const muscleMid = new THREE.Color('#d25d59');
  const muscleBelly = new THREE.Color('#e37c74');
  const muscleDeep = new THREE.Color('#7a242b');
  const fasciaPale = new THREE.Color('#ecd2cd');

  const shadeStriatedMuscle = (
    outCol: THREE.Color,
    crevice: number,
    fascia: number,
    striationWave: number
  ) => {
    outCol.copy(muscleMid);
    if (striationWave > 0) {
      outCol.lerp(muscleBelly, clamp01(striationWave * 0.52));
    } else {
      outCol.lerp(muscleDeep, clamp01(-striationWave * 0.38));
    }
    outCol.lerp(muscleDeep, clamp01(crevice));
    outCol.lerp(fasciaPale, clamp01(fascia));
  };

  // 3. INTERIOR SKELETON, ARTERIES, VEINS & NERVES MATERIALS
  const boneMat = new THREE.MeshPhysicalMaterial({
    color: '#c4b1aa',
    emissive: '#3e2d2c',
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    roughness: 0.52,
    metalness: 0.04,
  });

  const arteryMat = new THREE.MeshStandardMaterial({
    color: '#ff2b4a',
    emissive: '#f01136',
    emissiveIntensity: 1.55,
    roughness: 0.28,
    metalness: 0.06,
  });

  const veinMat = new THREE.MeshStandardMaterial({
    color: '#3468ff',
    emissive: '#204cf2',
    emissiveIntensity: 1.45,
    roughness: 0.30,
    metalness: 0.06,
  });

  const nerveMat = new THREE.MeshStandardMaterial({
    color: '#ffda38',
    emissive: '#f7bc05',
    emissiveIntensity: 1.50,
    roughness: 0.24,
    metalness: 0.08,
  });

  // === A. TORSO & NECK (Outer Fresnel Shell + Inset Striated Muscular Layer) ===
  const evalTorsoProfile = (y: number) => {
    let rx = 0.24;
    let rzF = 0.18;
    let rzB = 0.16;
    let zOff = 0.0;

    if (y < 0.14) {
      const t = smoothstep(-0.10, 0.14, y);
      rx = lerp(0.245, 0.236, t);
      rzF = lerp(0.185, 0.195, t);
      rzB = lerp(0.195, 0.172, t);
    } else if (y < 0.38) {
      const t = smoothstep(0.14, 0.38, y);
      rx = lerp(0.236, 0.222, t);
      rzF = lerp(0.195, 0.225, t);
      rzB = lerp(0.172, 0.168, t);
    } else if (y < 0.78) {
      const t = smoothstep(0.38, 0.78, y);
      rx = lerp(0.222, 0.315, t);
      rzF = lerp(0.225, 0.285, t);
      rzB = lerp(0.168, 0.198, t);
    } else if (y < 1.06) {
      const t = smoothstep(0.78, 1.06, y);
      rx = lerp(0.315, 0.335, t) - 0.045 * Math.pow(t, 3);
      rzF = lerp(0.285, 0.205, t);
      rzB = lerp(0.198, 0.182, t);
    } else if (y < 1.19) {
      const t = smoothstep(1.06, 1.19, y);
      rx = lerp(0.290, 0.112, t);
      rzF = lerp(0.205, 0.120, t);
      rzB = lerp(0.182, 0.125, t);
      zOff = lerp(0.0, -0.005, t);
    } else {
      const t = smoothstep(1.19, 1.42, y);
      rx = lerp(0.112, 0.088, t);
      rzF = lerp(0.120, 0.105, t);
      rzB = lerp(0.125, 0.112, t);
      zOff = lerp(-0.005, 0.015, t);
    }
    return { rx, rzF, rzB, zOff };
  };

  const torsoShellGeo = buildContinuousSurface({
    uSegs: 64,
    vSegs: 68,
    evalVertex: (u, v, outPos) => {
      const theta = u * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const y = lerp(-0.10, 1.42, v);
      const { rx, rzF, rzB, zOff } = evalTorsoProfile(y);

      let r = 1.0;
      if (sinT > 0.05) {
        const frontW = smoothstep(0.05, 0.45, sinT);
        const absX = Math.abs(cosT);
        const pecShape = gauss(y, 0.84, 0.10) * smoothstep(0.04, 0.24, absX) * (1 - smoothstep(0.68, 0.96, absX));
        r += frontW * 0.065 * pecShape;
      }
      outPos.set(cosT * rx * r, y, zOff + (sinT >= 0 ? sinT * rzF : sinT * rzB) * r);
    },
  });
  const torsoShellMesh = new THREE.Mesh(torsoShellGeo, shellMat);
  torsoShellMesh.renderOrder = 5;
  chestGroup.add(torsoShellMesh);

  // Striated Torso & Neck Muscle Layer (0.945 inset inside outer Fresnel glass contour)
  const torsoMuscleGeo = buildContinuousSurface({
    uSegs: 92,
    vSegs: 92,
    withColors: true,
    evalVertex: (u, v, outPos, outCol) => {
      const theta = u * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const y = lerp(-0.09, 1.41, v);
      const { rx, rzF, rzB, zOff } = evalTorsoProfile(y);
      const inset = 0.932;

      let r = inset;
      let crevice = 0.0;
      let fascia = 0.0;
      let fiberWave = 0.0;

      if (sinT > -0.08) {
        const frontW = smoothstep(-0.08, 0.35, sinT);
        const absX = Math.abs(cosT);

        // Pectoralis Major + fan striations + inferior/deltopectoral grooves
        const pecBody = gauss(y, 0.855, 0.095) * smoothstep(0.045, 0.20, absX) * (1 - smoothstep(0.68, 0.94, absX));
        const pecCrease = gauss(y, 0.728, 0.020) * smoothstep(0.06, 0.22, absX) * (1 - smoothstep(0.62, 0.88, absX));
        const pecFibers = Math.sin(Math.atan2(y - 0.86, absX * 0.42 - 0.42) * 24) * pecBody;
        const deltoPec = gauss(absX - (0.64 + 0.16 * smoothstep(0.75, 1.04, y)), 0, 0.055) *
          smoothstep(0.74, 0.86, y) * (1 - smoothstep(1.02, 1.10, y));

        r += frontW * (0.085 * pecBody + 0.008 * pecFibers - 0.040 * pecCrease - 0.038 * deltoPec);
        crevice += frontW * (0.58 * pecCrease + 0.55 * deltoPec);
        fiberWave += frontW * 0.75 * pecFibers;

        // Clavicles & Sternum pale fascia
        const sternumCenter = gauss(absX, 0, 0.075) * smoothstep(0.68, 0.78, y) * (1 - smoothstep(1.08, 1.15, y));
        const clavY = 1.118 - 0.052 * absX;
        const clavRidge = gauss(y, clavY, 0.018) * smoothstep(0.09, 0.20, absX) * (1 - smoothstep(0.70, 0.92, absX));
        r += frontW * (0.052 * clavRidge - 0.042 * sternumCenter);
        fascia += frontW * (0.72 * clavRidge + 0.58 * sternumCenter);

        // 6-Pack Rectus Abdominis + Linea Alba + Tendinous Intersections
        const abZone = smoothstep(0.16, 0.26, y) * (1 - smoothstep(0.66, 0.74, y));
        const lineaAlba = gauss(absX, 0, 0.055) * smoothstep(0.08, 0.18, y) * (1 - smoothstep(0.68, 0.75, y));
        const semilunaris = gauss(absX, 0.34, 0.048) * abZone;
        const tendIntersections =
          (gauss(y, 0.635, 0.015) + gauss(y, 0.515, 0.015) + gauss(y, 0.390, 0.016) + gauss(y, 0.245, 0.018)) *
          smoothstep(0.03, 0.10, absX) * (1 - smoothstep(0.30, 0.37, absX));
        const abPods =
          (gauss(y, 0.575, 0.042) + gauss(y, 0.452, 0.042) + gauss(y, 0.318, 0.046) + gauss(y, 0.185, 0.048)) *
          smoothstep(0.055, 0.14, absX) * (1 - smoothstep(0.28, 0.36, absX));
        const abFibers = Math.sin(absX * 72) * abPods;

        r += frontW * (0.044 * abPods + 0.005 * abFibers - 0.040 * lineaAlba - 0.034 * semilunaris - 0.024 * tendIntersections);
        crevice += frontW * (0.42 * semilunaris + 0.45 * tendIntersections + 0.25 * lineaAlba);
        fascia += frontW * (0.75 * lineaAlba + 0.52 * tendIntersections);
        fiberWave += frontW * 0.45 * abFibers;

        // Inguinal V-Ligament + Neck Sternocleidomastoid (SCM)
        const ingY = 0.02 + 0.30 * smoothstep(0.08, 0.72, absX);
        const inguinalGroove = gauss(y - ingY, 0, 0.020) * smoothstep(0.08, 0.25, absX) * (1 - smoothstep(0.65, 0.85, absX));
        const scmCenter = 0.10 + 0.42 * smoothstep(1.13, 1.38, y);
        const scmRidge = gauss(absX, scmCenter, 0.105) * smoothstep(1.12, 1.18, y) * (1 - smoothstep(1.36, 1.42, y));
        r += frontW * (0.042 * scmRidge - 0.038 * inguinalGroove);
        crevice += frontW * 0.55 * inguinalGroove;
        fascia += frontW * (0.62 * scmRidge * smoothstep(1.24, 1.13, y) + 0.42 * inguinalGroove);
      }

      // Lateral Serratus Anterior & External Obliques
      const latMask = smoothstep(0.45, 0.86, Math.abs(cosT));
      if (latMask > 0.01) {
        const serrZone = smoothstep(0.42, 0.50, y) * (1 - smoothstep(0.72, 0.78, y)) * latMask;
        const serrWave = Math.sin((y - 0.14 * Math.max(0, sinT)) * 105);
        const obZone = smoothstep(0.16, 0.24, y) * (1 - smoothstep(0.44, 0.54, y)) * smoothstep(0.32, 0.76, Math.abs(cosT));
        const obWave = Math.sin((y + 0.18 * sinT) * 78);
        r += 0.022 * serrWave * serrZone + 0.018 * obWave * obZone;
        crevice += 0.34 * Math.max(0, -serrWave) * serrZone + 0.30 * Math.max(0, -obWave) * obZone;
        fiberWave += 0.55 * serrWave * serrZone + 0.45 * obWave * obZone;
      }

      // Posterior Trapezius, Scapula, Latissimus Dorsi, Thoracolumbar Fascia, Glutes
      if (sinT < 0.08) {
        const backW = smoothstep(0.08, -0.35, sinT);
        const absX = Math.abs(cosT);
        const spineFurrow = gauss(absX, 0, 0.075) * smoothstep(-0.02, 0.15, y) * (1 - smoothstep(1.12, 1.32, y));
        const trapShape = smoothstep(0.55, 0.75, y) * (1 - smoothstep(1.22, 1.36, y)) *
          (1 - smoothstep(0.18 + 0.48 * gauss(y, 1.02, 0.15), 0.75, absX));
        const latDorsi = smoothstep(0.32, 0.52, y) * (1 - smoothstep(0.78, 0.92, y)) * smoothstep(0.22, 0.48, absX) * (1 - smoothstep(0.80, 0.96, absX));
        const lumbarFascia =
          gauss(absX, 0, 0.28 * smoothstep(-0.05, 0.22, y) * (1 - smoothstep(0.28, 0.56, y)) + 0.08) *
          smoothstep(-0.05, 0.08, y) * (1 - smoothstep(0.38, 0.55, y));
        const gluteCleft = gauss(absX, 0, 0.07) * (1 - smoothstep(0.02, 0.10, y));
        const gluteMax = gauss(y, -0.02, 0.095) * gauss(absX, 0.38, 0.22);

        r += backW * (0.042 * trapShape + 0.040 * latDorsi + 0.052 * gluteMax - 0.058 * spineFurrow - 0.078 * gluteCleft);
        crevice += backW * (0.48 * spineFurrow + 0.58 * gluteCleft);
        fascia += backW * 0.68 * lumbarFascia;
      }

      outPos.set(cosT * rx * r, y, zOff + (sinT >= 0 ? sinT * rzF : sinT * rzB) * r);
      if (outCol) shadeStriatedMuscle(outCol, crevice, fascia, fiberWave);
    },
  });
  const torsoMuscleMesh = new THREE.Mesh(torsoMuscleGeo, muscleMat);
  torsoMuscleMesh.renderOrder = 3;
  chestMuscleGroup.add(torsoMuscleMesh);
  muscleMeshes.push(torsoMuscleMesh);

  // === B. HEAD (Outer Fresnel Shell + Inset Cranial/Facial Muscles) ===
  const buildHeadSurface = (scaleInset: number, withMuscleDetail: boolean) =>
    buildContinuousSurface({
      uSegs: withMuscleDetail ? 64 : 52,
      vSegs: withMuscleDetail ? 56 : 48,
      withColors: withMuscleDetail,
      evalVertex: (u, v, outPos, outCol) => {
        const theta = u * Math.PI * 2;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const phi = (v - 0.5) * Math.PI;
        const cosP = Math.cos(phi);
        const sinP = Math.sin(phi);

        let rx = 0.114 * scaleInset * cosP;
        let rz = 0.136 * scaleInset * cosP;
        const y = 1.595 + sinP * 0.192 * scaleInset;
        let zCenter = 0.010 - 0.015 * smoothstep(0.0, 0.8, sinP);

        if (sinP < 0.0) {
          const jawT = smoothstep(0.0, -0.85, sinP);
          rx *= lerp(1.0, 0.78, jawT);
          if (sinT > 0) {
            rz *= lerp(1.0, 0.94, jawT);
            zCenter += 0.018 * jawT * smoothstep(0.2, 0.9, sinT);
          } else {
            rz *= lerp(1.0, 0.72, jawT);
          }
        }

        let x = cosT * rx;
        let z = zCenter + sinT * rz;
        let crevice = 0;
        let fascia = 0;
        let fiberWave = 0;
        const frontMask = smoothstep(0.15, 0.65, sinT);
        const absX = Math.abs(x);

        if (frontMask > 0.01) {
          const noseBridge =
            gauss(absX, 0, 0.012) * smoothstep(1.525, 1.565, y) * (1 - smoothstep(1.605, 1.635, y)) * frontMask;
          const noseTip = gauss(absX, 0, 0.014) * gauss(y, 1.535, 0.014) * frontMask;
          const brow = gauss(y, 1.618, 0.014) * (1 - smoothstep(0.04, 0.08, absX)) * frontMask;
          z += (0.024 * noseBridge + 0.032 * noseTip + 0.009 * brow) * scaleInset;

          if (withMuscleDetail) {
            const eyeDist = Math.hypot(absX - 0.037, (y - 1.592) * 1.35);
            const socket = (1 - smoothstep(0.012, 0.034, eyeDist)) * frontMask;
            const masseter = gauss(y, 1.500, 0.028) * gauss(absX, 0.066, 0.016) * smoothstep(-0.1, 0.4, sinT);
            const mouthW = 1 - smoothstep(0.014, 0.032, absX);
            const mouthLine = gauss(y, 1.486, 0.0022) * mouthW * frontMask;
            z -= 0.014 * socket;
            z += 0.007 * masseter;
            crevice += 0.45 * socket + 0.45 * mouthLine;
            fascia += 0.45 * smoothstep(1.635, 1.675, y) + 0.42 * brow;
            fiberWave += Math.sin((y - 0.3 * absX) * 180) * 0.5 * masseter;
          }
        }

        const earSide = smoothstep(0.82, 0.98, Math.abs(cosT));
        const earShape = gauss(y, 1.575, 0.028) * gauss(z - zCenter, -0.008, 0.018) * earSide;
        x += Math.sign(cosT) * 0.018 * scaleInset * earShape;
        outPos.set(x, y, z);
        if (outCol) shadeStriatedMuscle(outCol, crevice, fascia, fiberWave);
      },
    });

  const headShellMesh = new THREE.Mesh(buildHeadSurface(1.0, false), shellMat);
  headShellMesh.renderOrder = 5;
  root.add(headShellMesh);

  const headMuscleMesh = new THREE.Mesh(buildHeadSurface(0.94, true), muscleMat);
  headMuscleMesh.renderOrder = 3;
  root.add(headMuscleMesh);
  muscleMeshes.push(headMuscleMesh);

  // === C. ARMS & LEGS (Outer Fresnel Shell + Inset Striated Muscles) ===
  const armCurves: Record<'L' | 'R', THREE.CatmullRomCurve3> = {
    L: new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.32, 0.995, 0.0),
      new THREE.Vector3(0.435, 0.975, 0.0),
      new THREE.Vector3(0.58, 0.72, 0.0),
      new THREE.Vector3(0.73, 0.48, -0.01),
      new THREE.Vector3(0.84, 0.26, 0.015),
      new THREE.Vector3(0.97, -0.05, 0.05),
      new THREE.Vector3(1.015, -0.175, 0.06),
    ]),
    R: new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.32, 0.995, 0.0),
      new THREE.Vector3(-0.435, 0.975, 0.0),
      new THREE.Vector3(-0.58, 0.72, 0.0),
      new THREE.Vector3(-0.73, 0.48, -0.01),
      new THREE.Vector3(-0.84, 0.26, 0.015),
      new THREE.Vector3(-0.97, -0.05, 0.05),
      new THREE.Vector3(-1.015, -0.175, 0.06),
    ]),
  };

  for (const s of [-1, 1] as const) {
    const armCurve = s === 1 ? armCurves.L : armCurves.R;
    const frames = armCurve.computeFrenetFrames(48, false);

    const buildArmSurface = (scaleInset: number, withMuscles: boolean) =>
      buildContinuousSurface({
        uSegs: withMuscles ? 36 : 28,
        vSegs: 48,
        withColors: withMuscles,
        evalVertex: (u, v, outPos, outCol) => {
          const theta = u * Math.PI * 2;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);
          const pt = armCurve.getPointAt(v);
          const idx = Math.min(48, Math.round(v * 48));
          const N = frames.normals[idx];
          const B = frames.binormals[idx];

          let rN = 0.08;
          let rB = 0.08;
          let crevice = 0;
          let fascia = 0;
          let fiberWave = 0;

          if (v < 0.20) {
            const t = smoothstep(0.0, 0.20, v);
            rN = lerp(0.118, 0.098, t);
            rB = lerp(0.108, 0.095, t);
            if (withMuscles) {
              const deltShape = smoothstep(0.02, 0.08, v) * (1 - smoothstep(0.16, 0.22, v));
              const deltFibers = Math.sin(theta * 24) * deltShape;
              rN += 0.009 * Math.sin(theta * 3 + 0.6) * deltShape;
              crevice += 0.40 * gauss(v, 0.20, 0.025);
              fascia += 0.45 * gauss(v, 0.205, 0.02);
              fiberWave += 0.65 * deltFibers;
            }
          } else if (v < 0.46) {
            const t = smoothstep(0.20, 0.46, v);
            const bicepSwell = Math.sin(t * Math.PI) * 0.015;
            rN = lerp(0.098, 0.072, t) + bicepSwell;
            rB = lerp(0.095, 0.068, t) + bicepSwell * 0.7;
            if (withMuscles) {
              const sepGroove = (gauss(sinT, 0, 0.24) + gauss(cosT, 0, 0.20) * 0.5) * Math.sin(t * Math.PI);
              rN -= 0.006 * sepGroove;
              crevice += 0.45 * sepGroove;
              fiberWave += 0.55 * Math.sin(theta * 22) * Math.sin(t * Math.PI);
            }
          } else if (v < 0.76) {
            const t = smoothstep(0.46, 0.76, v);
            const forearmSwell = Math.sin(t * Math.PI * 0.85) * 0.016;
            rN = lerp(0.072, 0.054, t) + forearmSwell;
            rB = lerp(0.068, 0.044, t) + forearmSwell * 0.6;
            if (withMuscles) {
              const tendonTaper = smoothstep(0.62, 0.76, v);
              const foreGrooves = Math.sin(theta * 5) * Math.sin(t * Math.PI);
              crevice += 0.35 * Math.max(0, -foreGrooves) * (1 - tendonTaper * 0.5);
              fascia += 0.68 * tendonTaper;
              fiberWave += 0.50 * Math.sin(theta * 24) * (1 - tendonTaper * 0.5);
            }
          } else if (v < 0.89) {
            const t = smoothstep(0.76, 0.89, v);
            rN = lerp(0.054, 0.044, t);
            rB = lerp(0.044, 0.028, t);
            fascia += 0.62;
          } else {
            const t = smoothstep(0.89, 1.0, v);
            rN = lerp(0.044, 0.052, t) * (1 - 0.35 * Math.pow(t, 3));
            rB = lerp(0.028, 0.022, t);
            fascia += 0.55;
          }

          rN *= scaleInset;
          rB *= scaleInset;
          outPos.set(
            pt.x + (N.x * cosT * rN + B.x * sinT * rB),
            pt.y + (N.y * cosT * rN + B.y * sinT * rB),
            pt.z + (N.z * cosT * rN + B.z * sinT * rB)
          );
          if (outCol) shadeStriatedMuscle(outCol, crevice, fascia, fiberWave);
        },
      });

    const armShellMesh = new THREE.Mesh(buildArmSurface(1.0, false), shellMat);
    armShellMesh.renderOrder = 5;
    root.add(armShellMesh);

    const armMuscleMesh = new THREE.Mesh(buildArmSurface(0.920, true), muscleMat);
    armMuscleMesh.renderOrder = 3;
    root.add(armMuscleMesh);
    muscleMeshes.push(armMuscleMesh);

    const thumbMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.075, 8, 12), shellMat);
    thumbMesh.position.set(0.975 * s, -0.195, 0.088);
    thumbMesh.rotation.set(0.32, 0, -0.35 * s);
    thumbMesh.renderOrder = 5;
    root.add(thumbMesh);

    for (let f = 0; f < 4; f++) {
      const fSpread = (f - 1.5) * 0.017;
      const fLen = [0.068, 0.078, 0.072, 0.056][f];
      const fMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.0105, fLen, 8, 10), shellMat);
      fMesh.position.set((1.038 + f * 0.002) * s, -0.255 - fLen * 0.35, 0.062 + fSpread);
      fMesh.rotation.set(0.08, 0, 0.16 * s);
      fMesh.renderOrder = 5;
      root.add(fMesh);
    }

    // Leg Shell + Striated Muscle Layer
    const buildLegSurface = (scaleInset: number, withMuscles: boolean) =>
      buildContinuousSurface({
        uSegs: withMuscles ? 48 : 40,
        vSegs: withMuscles ? 76 : 64,
        withColors: withMuscles,
        evalVertex: (u, v, outPos, outCol) => {
          const theta = u * Math.PI * 2;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);
          const lat = cosT * s;
          const y = lerp(-1.70, -0.02, v);
          const cx = lerp(0.255 * s, 0.185 * s, smoothstep(-0.90, -0.02, y));
          const cz = 0.015 * smoothstep(-1.55, -0.88, y) * (1 - smoothstep(-0.40, -0.02, y));

          let rx = 0.08;
          let rzF = 0.08;
          let rzB = 0.08;
          let crevice = 0;
          let fascia = 0;
          let fiberWave = 0;

          if (y > -0.88) {
            const t = smoothstep(-0.88, -0.02, y);
            rx = lerp(0.088, 0.148, t) + 0.018 * Math.sin(t * Math.PI);
            rzF = lerp(0.094, 0.145, t) + 0.022 * Math.sin(t * Math.PI);
            rzB = lerp(0.082, 0.152, t);
            const pat = gauss(y, -0.87, 0.045) * smoothstep(0.45, 0.9, sinT) * (1 - smoothstep(0.35, 0.75, Math.abs(cosT)));
            rzF += 0.018 * pat;

            if (withMuscles) {
              const thighActive = smoothstep(-0.82, -0.72, y) * (1 - smoothstep(-0.08, -0.02, y));
              const sartLat = lerp(-0.68, 0.72, smoothstep(-0.84, -0.05, y));
              const sartGroove = (gauss(lat - (sartLat - 0.16), 0, 0.06) + gauss(lat - (sartLat + 0.16), 0, 0.06)) *
                smoothstep(-0.1, 0.7, sinT) * thighActive;
              const rectusFem = gauss(lat, 0.06, 0.24) * smoothstep(0.35, 0.92, sinT) *
                smoothstep(-0.72, -0.58, y) * (1 - smoothstep(-0.15, -0.04, y));
              const rectusFibers = Math.sin((y - 0.14 * Math.abs(lat - 0.06)) * 85) * rectusFem;
              const itBand = gauss(lat, 0.94, 0.14) * (1 - smoothstep(0.35, 0.68, Math.abs(sinT))) *
                smoothstep(-0.86, -0.70, y);
              const hamSplit = gauss(lat, 0.0, 0.16) * smoothstep(-0.35, -0.9, sinT) * thighActive;
              crevice += 0.45 * sartGroove + 0.48 * hamSplit;
              fascia += 0.75 * itBand + 0.65 * pat;
              fiberWave += 0.60 * rectusFibers + 0.32 * Math.sin(theta * 24) * thighActive;
            }
          } else if (y > -1.56) {
            const t = smoothstep(-1.56, -0.88, y);
            const calfPeak = gauss(t, 0.62, 0.22);
            rx = lerp(0.052, 0.088, t) + 0.028 * calfPeak;
            rzF = lerp(0.058, 0.094, t) + 0.010 * calfPeak;
            rzB = lerp(0.054, 0.082, t) + 0.052 * calfPeak * smoothstep(-0.1, -0.6, sinT);

            if (withMuscles) {
              const gastroGroove = gauss(lat, 0, 0.14) * smoothstep(-0.25, -0.9, sinT) * gauss(t, 0.66, 0.18);
              const achilles = gauss(lat, 0, 0.24) * smoothstep(-0.25, -0.92, sinT) * smoothstep(-1.26, -1.56, y);
              const tibiaCrest = gauss(lat, -0.14, 0.14) * smoothstep(0.45, 0.95, sinT) * smoothstep(-1.52, -1.05, y);
              crevice += 0.50 * gastroGroove;
              fascia += 0.76 * achilles + 0.55 * tibiaCrest;
              fiberWave += 0.48 * Math.sin(theta * 24) * smoothstep(-1.42, -1.0, y);
            }
          } else {
            const t = smoothstep(-1.70, -1.56, y);
            rx = lerp(0.056, 0.052, t);
            rzF = lerp(0.115, 0.058, t);
            rzB = lerp(0.072, 0.054, t);
            fascia += 0.62;
          }

          outPos.set(
            cx + cosT * rx * scaleInset,
            y,
            cz + (sinT >= 0 ? sinT * rzF : sinT * rzB) * scaleInset
          );
          if (outCol) shadeStriatedMuscle(outCol, crevice, fascia, fiberWave);
        },
      });

    const legShellMesh = new THREE.Mesh(buildLegSurface(1.0, false), shellMat);
    legShellMesh.renderOrder = 5;
    root.add(legShellMesh);

    const legMuscleMesh = new THREE.Mesh(buildLegSurface(0.94, true), muscleMat);
    legMuscleMesh.renderOrder = 3;
    root.add(legMuscleMesh);
    muscleMeshes.push(legMuscleMesh);

    const footShellGeo = buildContinuousSurface({
      uSegs: 24,
      vSegs: 24,
      evalVertex: (u, v, outPos) => {
        const theta = u * Math.PI * 2;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const z = lerp(-0.07, 0.205, v);
        const w = lerp(0.050, 0.068, smoothstep(0.1, 0.8, v)) * (1 - 0.35 * Math.pow(smoothstep(0.85, 1.0, v), 2));
        const topH = lerp(0.095, 0.028, smoothstep(0.0, 0.92, v));
        const bottomY = -1.735 + 0.008 * gauss(v, 0.42, 0.14) * smoothstep(-0.8, -0.2, cosT * s);
        const y = sinT >= 0 ? lerp(-1.715, -1.735 + topH, sinT) : lerp(-1.715, bottomY, -sinT);
        outPos.set(0.255 * s + cosT * w, y, z);
      },
    });
    const footMesh = new THREE.Mesh(footShellGeo, shellMat);
    footMesh.renderOrder = 5;
    root.add(footMesh);

    for (let t = 0; t < 5; t++) {
      const tx = (0.222 + t * 0.019) * s;
      const tLen = [0.044, 0.042, 0.036, 0.030, 0.024][t];
      const tr = t === 0 ? 0.0145 : 0.010;
      const toe = new THREE.Mesh(new THREE.CapsuleGeometry(tr, tLen, 6, 10), shellMat);
      toe.position.set(tx, -1.724, 0.205 + tLen * 0.25 - t * 0.005);
      toe.rotation.x = Math.PI / 2 + 0.08;
      toe.renderOrder = 5;
      root.add(toe);
    }
  }

  // === D. INTERIOR SKELETAL SILHOUETTE ===
  const boneParts: THREE.BufferGeometry[] = [];
  boneParts.push(makeTranslated(new THREE.SphereGeometry(0.084, 18, 14), 0, 1.62, 0.005, 0.94, 1.15, 1.08));
  boneParts.push(makeTranslated(new THREE.CylinderGeometry(0.056, 0.042, 0.10, 14), 0, 1.50, 0.035));

  for (let i = 0; i < 18; i++) {
    const t = i / 17;
    const vy = lerp(0.04, 1.34, t);
    const vz = -0.045 + Math.sin(t * Math.PI * 1.6) * 0.022;
    const vr = lerp(0.034, 0.021, t);
    boneParts.push(makeTranslated(new THREE.CylinderGeometry(vr, vr * 1.06, 0.042, 12), 0, vy, vz));
  }

  boneParts.push(makeTranslated(new THREE.BoxGeometry(0.048, 0.26, 0.024), 0, 0.89, 0.145));

  for (let i = 0; i < 10; i++) {
    const rt = i / 9;
    const yBack = lerp(1.04, 0.56, rt);
    const yFront = yBack - 0.06;
    const widthX = lerp(0.15, 0.245, Math.sin(rt * Math.PI * 0.72 + 0.3));
    const depthF = lerp(0.13, 0.195, Math.sin(rt * Math.PI * 0.75 + 0.25));

    for (const s of [-1, 1] as const) {
      boneParts.push(
        makeTube(
          [
            [0.02 * s, yBack, -0.05],
            [widthX * 0.72 * s, yBack - 0.015, -0.02],
            [widthX * s, (yBack + yFront) * 0.5, 0.06],
            [widthX * 0.52 * s, yFront, depthF],
            [i < 7 ? 0.028 * s : 0.10 * s, yFront + 0.01, depthF * 0.85],
          ],
          0.0085,
          16,
          6
        )
      );
    }
  }

  for (const s of [-1, 1] as const) {
    boneParts.push(
      makeTube([[0.025 * s, 1.07, 0.125], [0.14 * s, 1.09, 0.11], [0.27 * s, 1.04, 0.04]], 0.011, 12, 6)
    );
    boneParts.push(
      makeTube(
        [
          [0.04 * s, 0.06, -0.04],
          [0.17 * s, 0.14, 0.02],
          [0.19 * s, 0.02, 0.07],
          [0.04 * s, -0.04, 0.04],
        ],
        0.014,
        14,
        6
      )
    );
    boneParts.push(makeTube([[0.185 * s, -0.04, 0.0], [0.22 * s, -0.88, 0.01]], 0.016, 10, 6));
    boneParts.push(makeTube([[0.225 * s, -0.92, 0.01], [0.255 * s, -1.60, 0.0]], 0.013, 10, 6));
    boneParts.push(makeTube([[0.36 * s, 0.96, 0.0], [0.73 * s, 0.48, -0.01]], 0.013, 10, 6));
    boneParts.push(makeTube([[0.73 * s, 0.48, -0.01], [0.97 * s, -0.05, 0.05]], 0.010, 10, 6));
  }

  const skeletonMesh = new THREE.Mesh(mergePartGeometries(boneParts), boneMat);
  skeletonMesh.renderOrder = 1;
  chestGroup.add(skeletonMesh);

  // === E. GLOWING CRIMSON-RED ARTERIAL NETWORK ===
  const arteryParts: THREE.BufferGeometry[] = [];
  arteryParts.push(makeTranslated(new THREE.SphereGeometry(0.062, 16, 14), 0.032, 0.835, 0.045, 0.85, 1.25, 0.90));
  arteryParts.push(
    makeTube(
      [
        [0.025, 0.86, 0.045],
        [0.018, 0.96, 0.03],
        [0.006, 0.95, -0.01],
        [0.012, 0.65, 0.005],
        [0.010, 0.14, 0.015],
      ],
      0.021,
      28,
      8
    )
  );
  for (const s of [-1, 1] as const) {
    arteryParts.push(makeTube([[0.01, 0.46, 0.01], [0.09 * s, 0.44, 0.03], [0.11 * s, 0.38, 0.04]], 0.007, 10, 6));
    arteryParts.push(makeTube([[0.01, 0.60, 0.01], [0.10 * s, 0.58, 0.05]], 0.006, 8, 5));

    arteryParts.push(
      makeTube(
        [
          [0.015 * s, 0.96, 0.02],
          [0.038 * s, 1.16, 0.032],
          [0.042 * s, 1.44, 0.038],
          [0.058 * s, 1.58, 0.055],
          [0.052 * s, 1.71, 0.035],
        ],
        0.0075,
        22,
        6
      )
    );
    arteryParts.push(
      makeTube(
        [
          [0.042 * s, 1.48, 0.042],
          [0.024 * s, 1.56, 0.105],
          [0.036 * s, 1.67, 0.088],
          [0.015 * s, 1.74, 0.03],
        ],
        0.0045,
        14,
        5
      )
    );

    arteryParts.push(
      makeTube(
        [
          [0.018 * s, 0.96, 0.025],
          [0.20 * s, 1.01, 0.025],
          [0.42 * s, 0.95, 0.015],
          [0.58 * s, 0.72, 0.02],
          [0.73 * s, 0.48, 0.005],
          [0.85 * s, 0.25, 0.025],
          [0.975 * s, -0.05, 0.058],
          [1.015 * s, -0.17, 0.068],
        ],
        0.0085,
        28,
        7
      )
    );
    arteryParts.push(
      makeTube(
        [
          [0.72 * s, 0.47, 0.0],
          [0.82 * s, 0.24, 0.008],
          [0.955 * s, -0.05, 0.045],
          [1.015 * s, -0.18, 0.065],
        ],
        0.0052,
        16,
        5
      )
    );
    for (let f = 0; f < 4; f++) {
      const fSpread = (f - 1.5) * 0.016;
      arteryParts.push(makeTube([[1.015 * s, -0.17, 0.065], [1.045 * s, -0.28, 0.062 + fSpread]], 0.0032, 6, 5));
    }

    arteryParts.push(
      makeTube(
        [
          [0.012, 0.14, 0.015],
          [0.105 * s, 0.02, 0.035],
          [0.175 * s, -0.22, 0.042],
          [0.195 * s, -0.58, 0.032],
          [0.225 * s, -0.90, -0.012],
          [0.245 * s, -1.28, 0.005],
          [0.255 * s, -1.62, 0.015],
          [0.255 * s, -1.70, 0.14],
        ],
        0.0105,
        32,
        7
      )
    );
    arteryParts.push(
      makeTube([[0.145 * s, -0.10, 0.038], [0.195 * s, -0.38, 0.01], [0.215 * s, -0.70, -0.01]], 0.0058, 14, 5)
    );
  }
  const arteryMesh = new THREE.Mesh(mergePartGeometries(arteryParts), arteryMat);
  arteryMesh.renderOrder = 2;
  chestGroup.add(arteryMesh);

  // === F. GLOWING ELECTRIC-BLUE VENOUS NETWORK ===
  const veinParts: THREE.BufferGeometry[] = [];
  veinParts.push(
    makeTube(
      [
        [-0.024, 1.00, 0.022],
        [-0.026, 0.85, 0.032],
        [-0.024, 0.54, 0.008],
        [-0.022, 0.12, 0.018],
      ],
      0.018,
      24,
      8
    )
  );

  for (const s of [-1, 1] as const) {
    veinParts.push(
      makeTube(
        [
          [-0.015, 0.98, 0.022],
          [0.056 * s, 1.15, 0.020],
          [0.058 * s, 1.44, 0.025],
          [0.070 * s, 1.59, 0.020],
          [0.022 * s, 1.72, 0.005],
        ],
        0.007,
        20,
        6
      )
    );
    veinParts.push(
      makeTube(
        [
          [0.01 * s, 0.99, 0.022],
          [0.22 * s, 1.03, 0.018],
          [0.44 * s, 0.96, 0.025],
          [0.60 * s, 0.72, 0.032],
          [0.75 * s, 0.48, 0.015],
          [0.86 * s, 0.25, 0.032],
          [0.985 * s, -0.05, 0.052],
          [1.02 * s, -0.17, 0.058],
        ],
        0.0072,
        26,
        6
      )
    );
    veinParts.push(
      makeTube(
        [
          [0.40 * s, 0.92, -0.005],
          [0.55 * s, 0.70, -0.01],
          [0.70 * s, 0.48, -0.018],
          [0.81 * s, 0.25, -0.004],
          [0.955 * s, -0.05, 0.038],
        ],
        0.0052,
        18,
        5
      )
    );
    veinParts.push(
      makeTube(
        [
          [-0.022, 0.12, 0.018],
          [0.088 * s, -0.02, 0.038],
          [0.145 * s, -0.25, 0.048],
          [0.172 * s, -0.60, 0.040],
          [0.205 * s, -0.90, 0.025],
          [0.225 * s, -1.28, 0.020],
          [0.240 * s, -1.62, 0.025],
          [0.238 * s, -1.70, 0.135],
        ],
        0.0092,
        30,
        7
      )
    );
    veinParts.push(
      makeTube(
        [
          [0.228 * s, -0.90, -0.022],
          [0.270 * s, -1.26, -0.022],
          [0.270 * s, -1.60, -0.015],
        ],
        0.0055,
        14,
        5
      )
    );
  }
  const veinMesh = new THREE.Mesh(mergePartGeometries(veinParts), veinMat);
  veinMesh.renderOrder = 2;
  chestGroup.add(veinMesh);

  // === G. GLOWING GOLDEN-YELLOW NERVOUS SYSTEM ===
  const nerveParts: THREE.BufferGeometry[] = [];
  nerveParts.push(makeTranslated(new THREE.SphereGeometry(0.068, 16, 14), 0, 1.655, 0.008, 0.96, 0.88, 1.12));
  nerveParts.push(
    makeTube(
      [
        [0, 1.56, -0.01],
        [0, 1.32, -0.032],
        [0, 0.90, -0.040],
        [0, 0.45, -0.035],
        [0, 0.06, -0.038],
      ],
      0.012,
      26,
      7
    )
  );

  for (const s of [-1, 1] as const) {
    nerveParts.push(
      makeTube(
        [
          [0, 1.58, 0.02],
          [0.038 * s, 1.59, 0.095],
          [0.055 * s, 1.53, 0.092],
          [0.03 * s, 1.49, 0.10],
        ],
        0.0038,
        12,
        5
      )
    );

    for (const rootY of [1.18, 1.12, 1.06]) {
      nerveParts.push(
        makeTube(
          [
            [0.015 * s, rootY, -0.03],
            [0.18 * s, 1.04, -0.01],
            [0.36 * s, 0.97, -0.005],
          ],
          0.0055,
          10,
          5
        )
      );
    }
    nerveParts.push(
      makeTube(
        [
          [0.36 * s, 0.97, -0.005],
          [0.44 * s, 0.94, 0.0],
          [0.59 * s, 0.72, -0.012],
          [0.74 * s, 0.48, -0.022],
          [0.85 * s, 0.25, 0.008],
          [0.975 * s, -0.05, 0.048],
          [1.015 * s, -0.175, 0.058],
        ],
        0.0062,
        28,
        6
      )
    );
    nerveParts.push(
      makeTube(
        [
          [0.44 * s, 0.94, -0.01],
          [0.62 * s, 0.71, 0.018],
          [0.76 * s, 0.47, 0.010],
          [0.88 * s, 0.25, 0.022],
          [0.99 * s, -0.05, 0.055],
        ],
        0.0044,
        18,
        5
      )
    );

    for (let i = 0; i < 6; i++) {
      const ny = lerp(0.95, 0.56, i / 5);
      const nx = lerp(0.18, 0.23, Math.sin((i / 5) * Math.PI));
      nerveParts.push(
        makeTube(
          [
            [0.015 * s, ny + 0.03, -0.038],
            [nx * s, ny, 0.02],
            [nx * 0.55 * s, ny - 0.03, 0.16],
          ],
          0.0038,
          12,
          5
        )
      );
    }

    nerveParts.push(
      makeTube(
        [
          [0.015 * s, 0.24, -0.03],
          [0.12 * s, 0.08, -0.015],
          [0.185 * s, -0.22, -0.025],
          [0.215 * s, -0.60, -0.030],
          [0.230 * s, -0.90, -0.025],
          [0.245 * s, -1.28, -0.022],
          [0.255 * s, -1.62, -0.008],
          [0.258 * s, -1.70, 0.145],
        ],
        0.0092,
        32,
        7
      )
    );
    nerveParts.push(
      makeTube(
        [
          [0.02 * s, 0.32, -0.02],
          [0.13 * s, 0.06, 0.035],
          [0.205 * s, -0.28, 0.055],
          [0.225 * s, -0.65, 0.048],
          [0.265 * s, -1.25, 0.032],
          [0.268 * s, -1.62, 0.032],
        ],
        0.0052,
        22,
        5
      )
    );
  }
  const nerveMesh = new THREE.Mesh(mergePartGeometries(nerveParts), nerveMat);
  nerveMesh.renderOrder = 2;
  chestGroup.add(nerveMesh);

  void shortsMat;

  return { root, chestGroup, muscleMeshes };
}
