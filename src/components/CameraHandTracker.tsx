import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Hand, User, RefreshCw } from 'lucide-react';
import { POINTS_3D, type Point3D } from '../data/acupoints';

interface CameraHandTrackerProps {
  activePointIds: string[];
  selectedPoint: Point3D;
  onSelectPoint: (p: Point3D) => void;
}

type SimSubject = 'hand-palm' | 'hand-back' | 'face';

interface Landmark {
  x: number;
  y: number;
  z: number;
}

const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

function lerpPt(a: Landmark, b: Landmark, t: number): Landmark {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
}

function mapHandAcupoints(lm: Landmark[]): Record<string, { x: number; y: number; preferredSide: 'palm' | 'back' | 'both' }> {
  const wrist = lm[0];
  const thumbCmc = lm[1];
  const thumbMcp = lm[2];
  const thumbTip = lm[4];
  const indexMcp = lm[5];
  const indexTip = lm[8];
  const midMcp = lm[9];
  const midTip = lm[12];
  const ringMcp = lm[13];
  const pinkyMcp = lm[17];
  const pinkyTip = lm[20];

  const palmAxisX = midMcp.x - wrist.x;
  const palmAxisY = midMcp.y - wrist.y;

  return {
    LI4: {
      x: (thumbMcp.x + indexMcp.x) * 0.5 + (wrist.x - midMcp.x) * 0.06,
      y: (thumbMcp.y + indexMcp.y) * 0.5 + (wrist.y - midMcp.y) * 0.06,
      preferredSide: 'back',
    },
    PC8: {
      x: (wrist.x + indexMcp.x + midMcp.x + ringMcp.x) / 4,
      y: (wrist.y + indexMcp.y + midMcp.y + ringMcp.y) / 4,
      preferredSide: 'palm',
    },
    LU10: {
      x: (wrist.x + thumbCmc.x + thumbMcp.x + indexMcp.x * 0.5) / 3.5,
      y: (wrist.y + thumbCmc.y + thumbMcp.y + indexMcp.y * 0.5) / 3.5,
      preferredSide: 'palm',
    },
    PC6: {
      x: wrist.x - palmAxisX * 0.42,
      y: wrist.y - palmAxisY * 0.42,
      preferredSide: 'palm',
    },
    TW5: {
      x: wrist.x - palmAxisX * 0.42,
      y: wrist.y - palmAxisY * 0.42,
      preferredSide: 'back',
    },
    HT7: {
      x: lerpPt(wrist, pinkyMcp, 0.28).x,
      y: lerpPt(wrist, pinkyMcp, 0.28).y,
      preferredSide: 'palm',
    },
    SI3: {
      x: pinkyMcp.x + (pinkyMcp.x - ringMcp.x) * 0.35,
      y: pinkyMcp.y + (wrist.y - pinkyMcp.y) * 0.14,
      preferredSide: 'both',
    },
    TW3: {
      x: lerpPt(ringMcp, pinkyMcp, 0.5).x + (wrist.x - midMcp.x) * 0.12,
      y: lerpPt(ringMcp, pinkyMcp, 0.5).y + (wrist.y - midMcp.y) * 0.12,
      preferredSide: 'back',
    },
    PC9: { x: midTip.x, y: midTip.y, preferredSide: 'both' },
    HT9: { x: pinkyTip.x, y: pinkyTip.y, preferredSide: 'both' },
    LU11: { x: thumbTip.x, y: thumbTip.y, preferredSide: 'both' },
    LI1: { x: indexTip.x, y: indexTip.y, preferredSide: 'both' },
  };
}

// Saved SVG Hand Diagram Coordinates (normalized 0..100 in viewBox 0 0 220 300)
const SAVED_HAND_SVG_COORDS: Record<string, { x: number; y: number; side: 'palm' | 'back' | 'both' }> = {
  LI4: { x: 64, y: 146, side: 'back' },
  PC8: { x: 112, y: 150, side: 'palm' },
  LU10: { x: 74, y: 178, side: 'palm' },
  PC6: { x: 112, y: 248, side: 'palm' },
  TW5: { x: 112, y: 248, side: 'back' },
  HT7: { x: 144, y: 214, side: 'palm' },
  SI3: { x: 164, y: 132, side: 'both' },
  TW3: { x: 138, y: 132, side: 'back' },
  PC9: { x: 108, y: 24, side: 'both' },
  HT9: { x: 168, y: 66, side: 'both' },
  LU11: { x: 30, y: 120, side: 'both' },
  LI1: { x: 74, y: 38, side: 'both' },
};

export const CameraHandTracker: React.FC<CameraHandTrackerProps> = ({
  activePointIds,
  selectedPoint,
  onSelectPoint,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<unknown>(null);
  const rafRef = useRef<number>(0);

  const [camActive, setCamActive] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [handDetected, setHandDetected] = useState(false);
  const [modelStatus, setModelStatus] = useState<'idle' | 'loading' | 'ready' | 'fallback'>('idle');
  const [simSubject, setSimSubject] = useState<SimSubject>('hand-palm');

  const activeIdsRef = useRef(activePointIds);
  activeIdsRef.current = activePointIds;
  const selectedRef = useRef(selectedPoint);
  selectedRef.current = selectedPoint;

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCamActive(false);
    setHandDetected(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamActive(true);

      // Initialize MediaPipe HandLandmarker (strictly detects hands, ignores faces!)
      if (!landmarkerRef.current) {
        setModelStatus('loading');
        try {
          const vision = await import('@mediapipe/tasks-vision');
          const fileset = await vision.FilesetResolver.forVisionTasks('/wasm');
          const handLandmarker = await vision.HandLandmarker.createFromOptions(fileset, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 2,
            minHandDetectionConfidence: 0.55,
            minHandPresenceConfidence: 0.55,
            minTrackingConfidence: 0.55,
          });
          landmarkerRef.current = handLandmarker;
          setModelStatus('ready');
        } catch (err) {
          console.warn('HandLandmarker model load error, using fallback guide:', err);
          setModelStatus('fallback');
        }
      }

      const renderLoop = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !streamRef.current) return;

        const w = canvas.clientWidth || 480;
        const h = canvas.clientHeight || 420;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, w, h);

        // Mirror video draw onto canvas so landmarks align 1:1
        if (video.readyState >= 2) {
          ctx.save();
          ctx.translate(w, 0);
          ctx.scale(-1, 1);

          // Cover-fit crop math
          const vw = video.videoWidth || 640;
          const vh = video.videoHeight || 480;
          const scale = Math.max(w / vw, h / vh);
          const dw = vw * scale;
          const dh = vh * scale;
          const dx = (w - dw) / 2;
          const dy = (h - dh) / 2;
          ctx.drawImage(video, dx, dy, dw, dh);
          ctx.restore();

          const lmInst = landmarkerRef.current as {
            detectForVideo: (v: HTMLVideoElement, ts: number) => { landmarks: Landmark[][] };
          } | null;

          if (lmInst) {
            const result = lmInst.detectForVideo(video, performance.now());
            const hands = result?.landmarks || [];
            setHandDetected(hands.length > 0);

            if (hands.length > 0) {
              hands.forEach((lmList) => {
                // Convert normalized video coordinates to mirrored cover-fit canvas coordinates
                const toPx = (pt: Landmark) => {
                  const mirroredX = 1 - pt.x;
                  return {
                    x: dx + mirroredX * dw,
                    y: dy + pt.y * dh,
                  };
                };

                const hasRequestedPoints = activeIdsRef.current.length > 0;
                const handPts = hasRequestedPoints
                  ? POINTS_3D.filter((p) => p.handPos && activeIdsRef.current.includes(p.id))
                  : [];

                // Draw hand landmarks cleanly; only overlay meridian lines & acupressure points once requested
                ctx.strokeStyle = hasRequestedPoints && handPts.length > 0 ? 'rgba(90, 200, 250, 0.55)' : 'rgba(148, 163, 184, 0.35)';
                ctx.lineWidth = hasRequestedPoints && handPts.length > 0 ? 2 : 1.2;
                HAND_CONNECTIONS.forEach(([a, b]) => {
                  const pa = toPx(lmList[a]);
                  const pb = toPx(lmList[b]);
                  ctx.beginPath();
                  ctx.moveTo(pa.x, pa.y);
                  ctx.lineTo(pb.x, pb.y);
                  ctx.stroke();
                });

                if (!hasRequestedPoints || handPts.length === 0) return;

                // Map requested instant-relief hand acupoints onto detected landmarks
                const mapped = mapHandAcupoints(lmList);
                const tNow = performance.now() * 0.004;

                handPts.forEach((pt) => {
                  const coords = mapped[pt.id];
                  if (!coords) return;
                  const px = toPx({ x: coords.x, y: coords.y, z: 0 });
                  const pulse = 1 + Math.sin(tNow) * 0.25;

                  // Outer pulse ring
                  ctx.beginPath();
                  ctx.arc(px.x, px.y, 14 * pulse, 0, Math.PI * 2);
                  ctx.strokeStyle = pt.c;
                  ctx.lineWidth = 2.2;
                  ctx.stroke();

                  // Core acupoint dot
                  ctx.beginPath();
                  ctx.arc(px.x, px.y, 7, 0, Math.PI * 2);
                  ctx.fillStyle = pt.c;
                  ctx.fill();
                  ctx.strokeStyle = '#ffffff';
                  ctx.lineWidth = 2;
                  ctx.stroke();

                  // Crisp pill label
                  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
                  const label = `${pt.id} · ${pt.n.split(' ')[0]}`;
                  const tw = ctx.measureText(label).width;
                  ctx.fillStyle = 'rgba(7, 11, 26, 0.86)';
                  ctx.beginPath();
                  ctx.roundRect(px.x + 12, px.y - 12, tw + 12, 22, 6);
                  ctx.fill();
                  ctx.fillStyle = '#ffffff';
                  ctx.fillText(label, px.x + 18, px.y + 3);
                });
              });
            }
          }
        }

        rafRef.current = requestAnimationFrame(renderLoop);
      };

      rafRef.current = requestAnimationFrame(renderLoop);
    } catch (err) {
      setCamError('Camera permission denied or unavailable. Use the Saved Hand Reference simulation below.');
      setCamActive(false);
    }
  };

  // Show acupoints ONLY when activePointIds has requested points (never show acupressure points by default)
  const hasRequestedPoints = activePointIds.length > 0;
  const simDisplayPts = hasRequestedPoints
    ? POINTS_3D.filter((p) => p.handPos && activePointIds.includes(p.id))
    : [];

  return (
    <div className="flex flex-col gap-3">
      {/* Vertically stretched camera viewport so an upright hand fits comfortably */}
      <div className="relative h-[380px] sm:h-[420px] w-full rounded-2xl bg-slate-950/75 border border-white/15 overflow-hidden flex items-center justify-center shadow-inner">
        <video ref={videoRef} playsInline muted className="hidden" />
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full ${camActive ? 'block' : 'hidden'}`}
        />

        {/* Simulation Mode: Saved Hand Reference OR Face-Exclusion Demo */}
        {!camActive && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            {simSubject === 'face' ? (
              <div className="flex flex-col items-center text-center gap-3">
                <svg width="150" height="190" viewBox="0 0 120 150" className="opacity-75">
                  <circle cx="60" cy="48" r="28" fill="rgba(255,255,255,0.12)" stroke="#94a3b8" strokeWidth="2" />
                  <path
                    d="M14 146c0-40 20-58 46-58s46 18 46 58z"
                    fill="rgba(255,255,255,0.09)"
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                </svg>
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-medium">
                  Face detected — Acupoints hidden. Show your hand to display points.
                </div>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center h-full">
                {/* Saved Hand Picture / Anatomical SVG Reference with Interactive Acupoints */}
                <svg viewBox="0 0 220 290" className="h-[310px] sm:h-[340px] w-auto drop-shadow-[0_0_24px_rgba(90,200,250,0.22)]">
                  <defs>
                    <linearGradient id="handSkinGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e5a68c" stopOpacity="0.48" />
                      <stop offset="100%" stopColor="#8b5a4b" stopOpacity="0.32" />
                    </linearGradient>
                  </defs>
                  {/* Anatomical Forearm + Palm + 5 Fingers Silhouette */}
                  <path
                    d="M84 285 L86 205 C62 195 45 162 24 128 C18 118 28 106 38 116 L68 148
                       L66 54 C66 40 82 40 82 54 L86 116
                       L94 26 C94 12 112 12 112 26 L112 114
                       L122 36 C122 22 140 22 140 36 L136 118
                       L150 68 C152 54 168 56 166 72 L154 152
                       C152 178 142 196 138 208 L138 285 Z"
                    fill="url(#handSkinGrad)"
                    stroke="#5ac8fa"
                    strokeWidth="2"
                  />
                  {/* Meridian guide lines (only when hand points are requested) */}
                  {simDisplayPts.length > 0 && (
                    <>
                      <path d="M112 280 L112 150 L104 28" stroke="#ff6b9d" strokeWidth="1.4" strokeDasharray="4 4" fill="none" opacity="0.7" />
                      <path d="M90 278 L74 178 L32 120" stroke="#9be15d" strokeWidth="1.4" strokeDasharray="4 4" fill="none" opacity="0.7" />
                      <path d="M134 278 L144 214 L164 132 L162 70" stroke="#b794ff" strokeWidth="1.4" strokeDasharray="4 4" fill="none" opacity="0.7" />
                    </>
                  )}

                  {/* Active Acupoint Markers on Saved Hand Reference */}
                  {simDisplayPts.map((pt) => {
                    const c = SAVED_HAND_SVG_COORDS[pt.id];
                    if (!c) return null;
                    const sideMode = simSubject === 'hand-palm' ? 'palm' : 'back';
                    const isMatchingSide = c.side === 'both' || c.side === sideMode;
                    const isSel = pt.id === selectedPoint.id;
                    return (
                      <g
                        key={pt.id}
                        className="cursor-pointer"
                        opacity={isMatchingSide ? 1 : 0.35}
                        onClick={() => onSelectPoint(pt)}
                      >
                        {isSel && (
                          <circle cx={c.x} cy={c.y} r="14" fill="none" stroke={pt.c} strokeWidth="2" opacity="0.85" />
                        )}
                        <circle cx={c.x} cy={c.y} r={isSel ? 7 : 5.5} fill={pt.c} stroke="#ffffff" strokeWidth="1.8" />
                        <rect
                          x={c.x + 9}
                          y={c.y - 9}
                          width={34}
                          height={17}
                          rx={5}
                          fill="rgba(7,11,26,0.88)"
                          stroke={pt.c}
                          strokeWidth="1"
                        />
                        <text x={c.x + 26} y={c.y + 3} textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="700">
                          {pt.id}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                {hasRequestedPoints && simDisplayPts.length === 0 && (
                  <div className="mt-1 px-3 py-1 rounded-lg bg-sky-500/15 border border-sky-400/30 text-[11px] text-sky-200 text-center">
                    Top relief points ({activePointIds.join(', ')}) are shown on the 3D Body/Leg view.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Top-left live status badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/85 border border-white/15 text-xs font-medium text-slate-100">
          {camActive
            ? handDetected
              ? hasRequestedPoints
                ? 'Hand detected — Top relief points active'
                : 'Hand detected — Ask a concern or point to show relief points'
              : modelStatus === 'loading'
              ? 'Loading hand tracker...'
              : 'Show your hand (Face hidden / ignored)'
            : simSubject === 'face'
            ? 'Simulation: Face (No points shown)'
            : !hasRequestedPoints
            ? `Hand Ready (${simSubject === 'hand-palm' ? 'Palm' : 'Back'}) — Ask about a problem or point`
            : `Hand Reference (${simSubject === 'hand-palm' ? 'Palm' : 'Back'})`}
        </div>
      </div>

      {camError && (
        <div className="text-xs text-amber-300 bg-amber-500/15 border border-amber-400/30 rounded-xl px-3 py-2">
          {camError}
        </div>
      )}

      {/* Camera controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => (camActive ? stopCamera() : startCamera())}
          className={`veda-btn flex items-center gap-1.5 ${camActive ? 'veda-btn-danger' : 'veda-btn-primary'}`}
        >
          {camActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          {camActive ? 'Stop Camera' : 'Start Hand Camera'}
        </button>

        {!camActive && (
          <>
            <button
              type="button"
              onClick={() => setSimSubject((s) => (s === 'hand-palm' ? 'hand-back' : 'hand-palm'))}
              className="veda-btn flex items-center gap-1.5"
            >
              <Hand className="w-4 h-4" />
              {simSubject === 'hand-palm' ? 'Switch: Back of Hand' : 'Switch: Palm View'}
            </button>
            <button
              type="button"
              onClick={() => setSimSubject((s) => (s === 'face' ? 'hand-palm' : 'face'))}
              className="veda-btn flex items-center gap-1.5"
            >
              {simSubject === 'face' ? <RefreshCw className="w-4 h-4" /> : <User className="w-4 h-4" />}
              {simSubject === 'face' ? 'Show Saved Hand' : 'Test Face Rule'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
