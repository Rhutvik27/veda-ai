import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Square, Timer } from 'lucide-react';

interface GuidedSessionTimerProps {
  timerLeft: number;
  totalSeconds?: number;
  timerRunning: boolean;
  pointId?: string;
  durationBadge?: string;
  pressureBadge?: string;
  onToggle: () => void;
  onReset: () => void;
}

export const GuidedSessionTimer: React.FC<GuidedSessionTimerProps> = ({
  timerLeft,
  totalSeconds = 120,
  timerRunning,
  pointId,
  durationBadge,
  pressureBadge,
  onToggle,
  onReset,
}) => {
  const discreteElapsed = Math.max(0, totalSeconds - timerLeft);
  const [smoothElapsed, setSmoothElapsed] = useState(discreteElapsed);

  const anchorTimeRef = useRef<number>(0);
  const anchorElapsedRef = useRef<number>(discreteElapsed);

  // Keep discrete boundary jumps / resets synced cleanly
  useEffect(() => {
    if (!timerRunning) {
      setSmoothElapsed(discreteElapsed);
      anchorElapsedRef.current = discreteElapsed;
      return;
    }
    // Gently realign only if smooth clock drifts noticeably from second-tick anchor
    if (Math.abs(smoothElapsed - discreteElapsed) > 0.65) {
      anchorElapsedRef.current = discreteElapsed;
      anchorTimeRef.current = performance.now();
      setSmoothElapsed(discreteElapsed);
    }
  }, [discreteElapsed, timerRunning]);

  // Smooth 60fps animation frame loop locked to breathing cycle while running
  useEffect(() => {
    if (!timerRunning) return;

    anchorElapsedRef.current = Math.max(0, totalSeconds - timerLeft);
    anchorTimeRef.current = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const dtSec = (now - anchorTimeRef.current) / 1000;
      const next = Math.min(totalSeconds, anchorElapsedRef.current + dtSec);
      setSmoothElapsed(next);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [timerRunning, totalSeconds]);

  // 8-second breathing cycle: 0..4s Inhale (grow), 4..8s Exhale (shrink)
  const cyclePos = smoothElapsed % 8;
  const isInhale = cyclePos < 4;
  const phaseFraction = isInhale ? cyclePos / 4 : (cyclePos - 4) / 4;

  // Smooth C1 cosine easing between 0 (contracted) and 1 (expanded)
  const breathPulse = timerRunning
    ? isInhale
      ? 0.5 - 0.5 * Math.cos(Math.PI * phaseFraction)
      : 0.5 + 0.5 * Math.cos(Math.PI * phaseFraction)
    : 0.15;

  // Compute SVG ring radii & opacities purely from breathPulse
  const progressRadius = 52;
  const progressCircumference = 2 * Math.PI * progressRadius;
  const sessionRatio = Math.max(0, Math.min(1, smoothElapsed / totalSeconds));
  const progressOffset = progressCircumference * (1 - sessionRatio);

  const outerHaloR = 26 + breathPulse * 21; // 26 -> 47
  const mainRingR = 22 + breathPulse * 17;  // 22 -> 39
  const innerCoreR = 14 + breathPulse * 11; // 14 -> 25
  const ringStrokeW = 2.5 + breathPulse * 2.5;
  const haloOpacity = timerRunning ? 0.18 + breathPulse * 0.34 : 0.14;
  const ringOpacity = timerRunning ? 0.72 + breathPulse * 0.28 : 0.45;

  const activeColor = !timerRunning ? '#5ac8fa' : isInhale ? '#34d399' : '#5ac8fa';
  const instruction = !timerRunning
    ? 'Ready'
    : isInhale
    ? 'Breathe in slowly…'
    : 'Breathe out gently…';

  const phaseSecondsLeft = timerRunning
    ? Math.max(1, Math.ceil(isInhale ? 4 - cyclePos : 8 - cyclePos))
    : 4;

  const mins = Math.floor(timerLeft / 60);
  const secs = String(timerLeft % 60).padStart(2, '0');

  return (
    <div className="rounded-2xl bg-black/30 border border-white/15 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-sm flex items-center gap-1.5 text-white">
          <Timer className="w-4 h-4 text-emerald-300" />
          Guided Session{pointId ? ` · ${pointId}` : ''}
        </span>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            !timerRunning
              ? 'bg-white/10 text-slate-300 border-white/15'
              : isInhale
              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
              : 'bg-sky-500/20 text-sky-200 border-sky-400/40'
          }`}
        >
          {timerRunning
            ? isInhale
              ? `Inhale · ${phaseSecondsLeft}s`
              : `Exhale · ${phaseSecondsLeft}s`
            : `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')} Acupressure`}
        </span>
      </div>

      {(durationBadge || pressureBadge) && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {durationBadge && (
            <span className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-400/30 text-sky-200 font-medium">
              ⏱ {durationBadge}
            </span>
          )}
          {pressureBadge && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-amber-200 font-medium">
              ✋ {pressureBadge}
            </span>
          )}
        </div>
      )}

      {/* Synced Pulsing SVG Breathing Ring + Timer Display */}
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full overflow-visible"
            aria-hidden="true"
          >
            {/* Ambient background progress track */}
            <circle
              cx="60"
              cy="60"
              r={progressRadius}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="4"
            />
            {/* 2:00 Session completion progress arc */}
            <circle
              cx="60"
              cy="60"
              r={progressRadius}
              fill="none"
              stroke={activeColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={progressCircumference}
              strokeDashoffset={progressOffset}
              transform="rotate(-90 60 60)"
              strokeOpacity="0.85"
            />
            {/* Outer expanding/contracting halo ring synced with breath */}
            <circle
              cx="60"
              cy="60"
              r={outerHaloR}
              fill="none"
              stroke={activeColor}
              strokeWidth="2"
              strokeOpacity={haloOpacity}
            />
            {/* Primary growing & shrinking pulsing SVG ring */}
            <circle
              cx="60"
              cy="60"
              r={mainRingR}
              fill={activeColor}
              fillOpacity={timerRunning ? 0.08 + breathPulse * 0.14 : 0.06}
              stroke={activeColor}
              strokeWidth={ringStrokeW}
              strokeOpacity={ringOpacity}
            />
            {/* Inner lung/pulse core circle */}
            <circle
              cx="60"
              cy="60"
              r={innerCoreR}
              fill={activeColor}
              fillOpacity={timerRunning ? 0.14 + breathPulse * 0.2 : 0.08}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-base font-bold text-white drop-shadow">
            {mins}:{secs}
          </span>
        </div>

        <div className="flex-1 min-w-0 space-y-2.5">
          <div>
            <div
              className={`text-sm font-semibold ${
                !timerRunning ? 'text-slate-300' : isInhale ? 'text-emerald-300' : 'text-sky-300'
              }`}
            >
              {instruction}
            </div>
            <div className="text-[11px] text-slate-400">
              {timerRunning
                ? 'Press steadily while following the pulsing ring'
                : `Start for a ${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')} guided breathing & press pace`}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReset}
              className="veda-btn text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              type="button"
              onClick={onToggle}
              className={`veda-btn text-xs py-1.5 px-3 flex items-center gap-1 ${
                timerRunning ? 'veda-btn-danger' : 'veda-btn-green'
              }`}
            >
              {timerRunning ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {timerRunning ? 'Pause' : 'Start'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
