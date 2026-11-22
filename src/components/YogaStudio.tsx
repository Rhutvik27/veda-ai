import React, { useEffect, useRef, useState } from 'react';
import { Play, Square, Volume2, VolumeX, Wind, HeartPulse, CheckCircle2, Eye } from 'lucide-react';
import { BREATHING_PATTERNS, YOGA_EXERCISES, type BreathingPattern } from '../data/yoga';
import type { Lang } from '../data/acupoints';
import { Exercise3DViewer, type ExerciseProgramId } from './Exercise3DViewer';

interface YogaStudioProps {
  lang: Lang;
  onLangChange: (l: Lang) => void;
  recommendedYogaIds?: string[];
  onSpeakCue?: (text: string, lang: Lang) => void;
}

const POSE_TO_3D_PROGRAM: Record<string, ExerciseProgramId> = {
  suryanamaskar: 'suryanamaskar',
  utkatasana: 'utkatasana',
  virabhadrasana_2: 'virabhadrasana_2',
  cobra_pose: 'bhujangasana_flow',
  setu_bandhasana: 'setu_bandhasana',
  tadasana_flow: 'tadasana_flow',
};

type BreathPhase = 'ready' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

const PHASE_LABEL: Record<BreathPhase, Record<Lang, string>> = {
  ready: { en: 'Ready to begin', hi: 'शुरू करने के लिए तैयार', mr: 'सुरू करण्यासाठी तयार' },
  inhale: { en: 'Breathe In Slowly…', hi: 'धीरे-धीरे सांस अंदर लें…', mr: 'हळूहळू श्वास आत घ्या…' },
  holdIn: { en: 'Hold Gently…', hi: 'आराम से रोकें…', mr: 'शांतपणे श्वास रोखून धरा…' },
  exhale: { en: 'Breathe Out Slowly…', hi: 'धीरे-धीरे सांस बाहर छोड़ें…', mr: 'हळूहळू श्वास बाहेर सोडा…' },
  holdOut: { en: 'Pause Softly…', hi: 'हल्का विश्राम करें…', mr: 'थोडा वेळ शांत थांबा…' },
};

function playChime(freq: number) {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
    setTimeout(() => ctx.close().catch(() => {}), 700);
  } catch {
    // Ignore audio context blocks
  }
}

export const YogaStudio: React.FC<YogaStudioProps> = ({
  lang,
  onLangChange,
  recommendedYogaIds = [],
  onSpeakCue,
}) => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('ready');
  const [phaseLeft, setPhaseLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [chimeOn, setChimeOn] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activePoseId, setActivePoseId] = useState<string | null>(null);
  const [poseSecondsLeft, setPoseSecondsLeft] = useState(0);
  const [selected3dProgram, setSelected3dProgram] = useState<ExerciseProgramId | null>(null);
  const modelSectionRef = useRef<HTMLDivElement | null>(null);

  const chimeRef = useRef(chimeOn);
  chimeRef.current = chimeOn;

  // Breathing timer state machine
  useEffect(() => {
    if (!running) {
      setPhase('ready');
      setPhaseLeft(0);
      return;
    }

    let currentPhase: BreathPhase = 'inhale';
    let remaining = selectedPattern.inhale;
    let cyclesDone = 0;

    setPhase(currentPhase);
    setPhaseLeft(remaining);
    setCycleCount(1);
    if (chimeRef.current) playChime(528);

    const interval = window.setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setPhaseLeft(remaining);
        return;
      }

      // Advance to next phase
      const nextPhase = (): { p: BreathPhase; d: number; newCycle: boolean } => {
        if (currentPhase === 'inhale') {
          if (selectedPattern.holdIn > 0) return { p: 'holdIn', d: selectedPattern.holdIn, newCycle: false };
          return { p: 'exhale', d: selectedPattern.exhale, newCycle: false };
        }
        if (currentPhase === 'holdIn') {
          return { p: 'exhale', d: selectedPattern.exhale, newCycle: false };
        }
        if (currentPhase === 'exhale') {
          if (selectedPattern.holdOut > 0) return { p: 'holdOut', d: selectedPattern.holdOut, newCycle: false };
          return { p: 'inhale', d: selectedPattern.inhale, newCycle: true };
        }
        return { p: 'inhale', d: selectedPattern.inhale, newCycle: true };
      };

      const nxt = nextPhase();
      if (nxt.newCycle) {
        cyclesDone += 1;
        if (cyclesDone >= selectedPattern.cycles) {
          setRunning(false);
          if (chimeRef.current) playChime(660);
          return;
        }
        setCycleCount(cyclesDone + 1);
      }

      currentPhase = nxt.p;
      remaining = nxt.d;
      setPhase(currentPhase);
      setPhaseLeft(remaining);
      if (chimeRef.current) {
        playChime(currentPhase === 'inhale' ? 528 : currentPhase === 'exhale' ? 396 : 440);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [running, selectedPattern]);

  // Pose countdown timer
  useEffect(() => {
    if (!activePoseId) return;
    const id = window.setInterval(() => {
      setPoseSecondsLeft((s) => {
        if (s <= 1) {
          if (chimeRef.current) playChime(660);
          setActivePoseId(null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [activePoseId]);

  const orbScale =
    phase === 'inhale' || phase === 'holdIn'
      ? 'scale-125 shadow-[0_0_65px_rgba(90,200,250,0.6)]'
      : phase === 'exhale'
      ? 'scale-90 shadow-[0_0_25px_rgba(52,211,153,0.35)]'
      : 'scale-100 shadow-[0_0_30px_rgba(90,200,250,0.28)]';

  const filteredPoses = YOGA_EXERCISES.filter((y) => {
    if (categoryFilter === 'recommended' && recommendedYogaIds.length > 0) {
      return recommendedYogaIds.includes(y.id);
    }
    if (categoryFilter === 'all') return true;
    return y.category === categoryFilter;
  });

  return (
    <div className="space-y-4">
      {/* Interactive 3D Suryanamaskar & Therapeutic Exercise Model */}
      <div ref={modelSectionRef}>
        <Exercise3DViewer
          lang={lang}
          onSpeakCue={onSpeakCue}
          externalProgramId={selected3dProgram}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Pranayama Breathing Pacer */}
        <div className="lg:col-span-5 glass-panel p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Wind className="w-5 h-5 text-sky-300" />
              Pranayama &amp; Breathing Guide
            </h2>
            <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl">
              {(['en', 'hi', 'mr'] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onLangChange(l)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    lang === l ? 'bg-sky-500 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {l === 'en' ? 'EN' : l === 'hi' ? 'हिं' : 'मर'}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern selector */}
          <div className="flex flex-wrap gap-1.5">
            {BREATHING_PATTERNS.map((bp) => {
              const isRec = recommendedYogaIds.includes(bp.id);
              return (
                <button
                  key={bp.id}
                  type="button"
                  onClick={() => {
                    setRunning(false);
                    setSelectedPattern(bp);
                  }}
                  className={`veda-chip ${selectedPattern.id === bp.id ? 'on' : ''}`}
                >
                  {bp.name[lang].split('(')[0].trim()}
                  {isRec ? ' ★' : ''}
                </button>
              );
            })}
          </div>

          {/* Expanding/Contracting Visual Breathing Orb */}
          <div className="relative h-60 rounded-2xl bg-slate-950/55 border border-white/15 flex flex-col items-center justify-center overflow-hidden">
            <div
              className={`w-36 h-36 rounded-full bg-gradient-to-br from-sky-400/75 via-emerald-400/60 to-indigo-500/70 border-2 border-white/50 flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out ${orbScale}`}
            >
              <span className="text-2xl font-bold font-mono text-white">
                {running ? `${phaseLeft}s` : `${selectedPattern.inhale}-${selectedPattern.holdIn}-${selectedPattern.exhale}`}
              </span>
              <span className="text-[11px] font-semibold text-white/90 mt-1">
                {running ? `Cycle ${cycleCount}/${selectedPattern.cycles}` : 'In · Hold · Out'}
              </span>
            </div>
            <div className="mt-4 text-sm font-bold text-sky-200 text-center px-3">
              {PHASE_LABEL[phase][lang]}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className={`veda-btn flex-1 flex items-center justify-center gap-2 ${
                running ? 'veda-btn-danger' : 'veda-btn-green'
              }`}
            >
              {running ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {running
                ? lang === 'hi'
                  ? 'रोकें'
                  : lang === 'mr'
                  ? 'थांबवा'
                  : 'Stop Session'
                : lang === 'hi'
                ? 'सांस अभ्यास शुरू करें'
                : lang === 'mr'
                ? 'श्वसन सराव सुरू करा'
                : 'Start Breathing'}
            </button>
            <button
              type="button"
              onClick={() => setChimeOn((c) => !c)}
              title="Toggle gentle chime sound"
              className="veda-btn flex items-center gap-1.5"
            >
              {chimeOn ? <Volume2 className="w-4 h-4 text-sky-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              Chime
            </button>
          </div>

          {/* Pattern details */}
          <div className="rounded-xl bg-black/25 border border-white/10 p-3.5 text-xs space-y-2">
            <div className="font-semibold text-emerald-300">{selectedPattern.benefits[lang]}</div>
            <ol className="list-decimal list-inside space-y-1 text-slate-200">
              {selectedPattern.steps[lang].map((st, idx) => (
                <li key={idx}>{st}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right: Therapeutic Yoga & Gentle Exercises */}
        <div className="lg:col-span-7 glass-panel p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-300" />
              Therapeutic Yoga &amp; Patient Exercises
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {[
                ['all', 'All'],
                ...(recommendedYogaIds.length > 0 ? [['recommended', 'For Your Problem ★']] : []),
                ['diabetes', 'Diabetes'],
                ['knee', 'Knee & Leg'],
                ['back', 'Back & Bone'],
                ['neck', 'Neck & Hand'],
                ['bp', 'BP & Calm'],
              ].map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setCategoryFilter(k)}
                  className={`veda-chip ${categoryFilter === k ? 'on' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[540px] overflow-y-auto pr-1">
            {filteredPoses.map((pose) => {
              const isRec = recommendedYogaIds.includes(pose.id);
              const isRunningPose = activePoseId === pose.id;
              const linked3d = POSE_TO_3D_PROGRAM[pose.id];
              return (
                <div
                  key={pose.id}
                  className={`rounded-2xl p-4 border transition-colors flex flex-col justify-between gap-3 ${
                    isRec
                      ? 'bg-emerald-500/10 border-emerald-400/40'
                      : 'bg-black/25 border-white/15'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-white">{pose.name[lang]}</h3>
                        <div className="text-[11px] text-sky-300">{pose.sanskrit} · {pose.durationSec}s</div>
                      </div>
                      {isRec && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Recommended
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-emerald-200/95">{pose.benefits[lang]}</p>

                    <ol className="list-decimal list-inside text-xs text-slate-200 space-y-1">
                      {pose.instructions[lang].map((ins, i) => (
                        <li key={i}>{ins}</li>
                      ))}
                    </ol>

                    <div className="text-[11px] text-amber-200/90 bg-amber-500/10 border border-amber-400/25 rounded-lg px-2.5 py-1.5">
                      {pose.caution[lang]}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="font-mono text-xs text-slate-300">
                      {isRunningPose ? `Time left: ${poseSecondsLeft}s` : `${pose.durationSec}s`}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {linked3d && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelected3dProgram(linked3d);
                            modelSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="veda-btn text-xs py-1.5 px-2.5 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-sky-300" /> 3D Model
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (isRunningPose) {
                            setActivePoseId(null);
                          } else {
                            setActivePoseId(pose.id);
                            setPoseSecondsLeft(pose.durationSec);
                          }
                        }}
                        className={`veda-btn text-xs py-1.5 px-3 ${isRunningPose ? 'veda-btn-danger' : 'veda-btn-primary'}`}
                      >
                        {isRunningPose ? 'Stop' : 'Start Timer'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
