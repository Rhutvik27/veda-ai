import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  Upload,
  Sparkles,
  Volume2,
  Square,
  AlertTriangle,
  MessageSquare,
  Wind,
  Maximize2,
  CheckCircle2,
  Loader2,
  Clock,
  Gauge,
  Leaf,
} from 'lucide-react';
import {
  CONDITION_PRESETS,
  POINTS_3D,
  findPointsLocal,
  findAllPointsForRequest,
  getPointPressSpec,
  matchConditionLocal,
  type Lang,
  type Point3D,
  type Region3D,
} from './data/acupoints';
import { getPointHomeRemedy } from './data/remedies';
import { ATLAS, MERIDIAN_NAMES } from './data/atlas';
import { Muscular3DViewer } from './components/Muscular3DViewer';
import { MiniBody3D } from './components/MiniBody3D';
import { CameraHandTracker } from './components/CameraHandTracker';
import { YogaStudio } from './components/YogaStudio';
import { HomeRemediesStudio } from './components/HomeRemediesStudio';
import { ArduinoHardware } from './components/ArduinoHardware';
import { AcupointLibrary } from './components/AcupointLibrary';
import { HistoryTab, type HistoryEntry } from './components/HistoryTab';
import { GuidedSessionTimer } from './components/GuidedSessionTimer';
import { formatMarathiSpeechText } from './utils/marathiSpeech';

type TabKey = 'assist' | 'body' | 'yoga' | 'remedies' | 'hw' | 'lib' | 'hist';

interface DiagnosisResult {
  query: string;
  lang: Lang;
  isEmergency: boolean;
  problemSummary: string;
  spokenScript: string;
  spokenScripts: Record<Lang, string>;
  pressGuide: string;
  recommendedPointIds: string[];
  primaryRegion: Region3D;
  recommendedYogaIds: string[];
}

interface ChatMsg {
  role: 'assistant' | 'user';
  html: string;
  mrText?: string;
}

const UI_COPY: Record<
  Lang,
  {
    loc: string;
    how: string;
    use: string;
    dur: string;
    pres: string;
    saf: string;
    tech: string;
    safetyNotice: string;
    pregWarn: string;
    placeholder: string;
    analyzeBtn: string;
    speakBtn: string;
    stopSpeakBtn: string;
    step1: string;
    step2: string;
    step3: string;
  }
> = {
  en: {
    loc: 'Point location',
    how: 'Acupressure technique',
    use: 'Indications and relief',
    dur: 'Pressing duration',
    pres: 'Pressure used',
    saf: 'Safety notice',
    tech: 'Press firmly with the thumb in slow circles for 2 minutes. Breathe deeply and stop if it hurts.',
    safetyNotice: 'Educational wellness guidance, not a medical diagnosis. Avoid broken skin. For heart attack or severe pain, call 108/112 immediately.',
    pregWarn: 'Avoid during pregnancy.',
    placeholder: 'Speak or type your problem in English, Hindi, or Marathi (e.g. “knee pain”, “diabetes”, “heart emergency”, “UB11 bone pain”)…',
    analyzeBtn: 'Get 3-Step Solution',
    speakBtn: 'Speak Problem',
    stopSpeakBtn: 'Stop & Analyze',
    step1: 'Step 1 · Written Answer',
    step2: 'Step 2 · Voice Talk-Back',
    step3: 'Step 3 · 3D Problem Location',
  },
  hi: {
    loc: 'बिंदु का स्थान',
    how: 'एक्यूप्रेशर विधि',
    use: 'उपयोग और राहत',
    dur: 'दबाने की अवधि (समय)',
    pres: 'दबाव की मात्रा (प्रेशर)',
    saf: 'सावधानी',
    tech: 'अंगूठे से 2 मिनट धीरे-धीरे गोल दबाएं। गहरी सांस लें, तेज दर्द हो तो रुकें।',
    safetyNotice: 'यह केवल स्वास्थ्य जानकारी है, चिकित्सीय जांच नहीं। सीने में तेज दर्द या आपात स्थिति में तुरंत 108/112 पर कॉल करें।',
    pregWarn: 'गर्भावस्था में न दबाएं।',
    placeholder: 'अपनी समस्या बोलकर या लिखकर बताएं (जैसे: घुटने का दर्द, शुगर/डायबिटीज, बीपी, कमर दर्द, खांसी)…',
    analyzeBtn: '3-चरण समाधान पाएं',
    speakBtn: 'बोलकर बताएं',
    stopSpeakBtn: 'रोकें और उत्तर देखें',
    step1: 'चरण 1 · लिखित उत्तर',
    step2: 'चरण 2 · आवाज़ में सुनें (Talk-Back)',
    step3: 'चरण 3 · 3D शरीर पर स्थान',
  },
  mr: {
    loc: 'बिंदूचे स्थान',
    how: 'अ‍ॅक्युप्रेशर पद्धत',
    use: 'उपयोग आणि आराम',
    dur: 'दाबण्याचा कालावधी (वेळ)',
    pres: 'दाबाची तीव्रता (प्रेशर)',
    saf: 'सावधानता',
    tech: 'अंगठ्याने २ मिनिटे हळुवार गोलाकार दाबा. संथ श्वास घ्या, तीव्र वेदना झाल्यास थांबा.',
    safetyNotice: 'ही केवळ आरोग्य माहिती आहे, वैद्यकीय निदान नाही. छातीत दुखणे किंवा आपत्कालीन स्थितीत लगेच १०८/११२ वर कॉल करा.',
    pregWarn: 'गर्भावस्थेत दाबू नका.',
    placeholder: 'तुमचा त्रास बोलून किंवा लिहून सांगा (उदा. गुडघेदुखी, मधुमेह/शुगर, बीपी, कंबरदुखी, खोकला)…',
    analyzeBtn: '३-टप्प्यात उत्तर मिळवा',
    speakBtn: 'बोलून सांगा',
    stopSpeakBtn: 'थांबवा आणि उत्तर पहा',
    step1: 'टप्पा १ · लिखित उत्तर',
    step2: 'टप्पा २ · आवाजात ऐका (Talk-Back)',
    step3: 'टप्पा ३ · 3D मॉडेलवर अचूक जागा',
  },
};

export default function App() {
  const [tab, setTab] = useState<TabKey>('assist');
  const [lang, setLang] = useState<Lang>('en');
  const [query, setQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [requestedPointIds, setRequestedPointIds] = useState<string[] | null>(null);
  const [activeRegion, setActiveRegion] = useState<Region3D>('body');
  const [selectedPoint, setSelectedPoint] = useState<Point3D>(
    () => POINTS_3D.find((p) => p.id === 'ST36') || POINTS_3D[0]
  );

  // Voice recording state (Dual MediaRecorder + SpeechRecognition)
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecRef = useRef<unknown>(null);
  const liveTranscriptRef = useRef('');

  // Voice Talk-Back playback state (supports English, Hindi, and Marathi independently or synced)
  const [speaking, setSpeaking] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [autoTalkBack, setAutoTalkBack] = useState(true);
  const [talkBackLang, setTalkBackLang] = useState<Lang>('en');
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const speechVoicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const syncVoices = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length > 0) speechVoicesRef.current = list;
    };
    syncVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', syncVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', syncVoices);
    };
  }, []);

  const htmlToPlainText = (html: string) =>
    html
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();

  // Chat state
  const [chatMode, setChatMode] = useState<'Educator' | 'Quick lookup'>('Educator');
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      role: 'assistant',
      html: 'Namaste! I am <b>Veda AI</b>. Ask about any health concern or point in <b>English, हिन्दी, or मराठी</b> and I will tell you the <b>top points for instant relief</b> with voice talk-back and 3D body guidance.',
      mrText:
        'नमस्कार! मी वेदा एआय आहे. तुमचा कोणताही आरोग्य त्रास किंवा अ‍ॅक्युप्रेशर बिंदू विचारा, मी तुम्हाला तात्काळ आरामासाठी प्रमुख बिंदू, आवाजात माहिती आणि 3D शरीरावर अचूक जागा सांगेन.',
    },
  ]);

  // Guided session timer synced to active point pressing duration
  const [timerLeft, setTimerLeft] = useState(() =>
    getPointPressSpec(POINTS_3D.find((p) => p.id === 'ST36') || POINTS_3D[0]).durationSec
  );
  const [timerRunning, setTimerRunning] = useState(false);

  // Arduino hardware state
  const [pins, setPins] = useState<Record<number, boolean>>({});
  const [serialLogs, setSerialLogs] = useState<{ dir: 'tx' | 'rx'; text: string }[]>([]);

  // History state
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('veda') || '[]');
    } catch {
      return [];
    }
  });

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number>(0);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMsg(null), 2800);
  };

  // Guided timer loop
  useEffect(() => {
    if (!timerRunning) return;
    const targetDur = getPointPressSpec(selectedPoint).durationSec;
    const id = window.setInterval(() => {
      setTimerLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          if (selectedPoint.pin) togglePin(selectedPoint.pin, false);
          showToast('Session complete. Well done.');
          return targetDur;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, selectedPoint]);

  const addSerialLog = (dir: 'tx' | 'rx', text: string) => {
    setSerialLogs((prev) => [...prev.slice(-80), { dir, text }]);
  };

  const togglePin = (pin: number, forceVal?: boolean) => {
    setPins((prev) => {
      const next = forceVal !== undefined ? forceVal : !prev[pin];
      return { ...prev, [pin]: next };
    });
  };

  const handleSelectPoint = (pt: Point3D) => {
    setSelectedPoint(pt);
    if (!timerRunning) {
      setTimerLeft(getPointPressSpec(pt).durationSec);
    }
    if (pt.pin) {
      togglePin(pt.pin, true);
      addSerialLog('tx', `LED:${pt.pin}:1`);
      setTimeout(() => {
        togglePin(pt.pin!, false);
        addSerialLog('tx', `LED:${pt.pin}:0`);
      }, 1600);
    }
  };

  // Stop any playing Voice Talk-Back audio
  const stopSpeaking = () => {
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  };

  // Play Voice Talk-Back in English, Hindi, or Marathi (Gemini TTS primary + phonetic Web Speech fallback)
  const speakText = async (text: string, targetLang: Lang) => {
    if (!text.trim()) return;
    stopSpeaking();
    setTtsLoading(true);

    let fallbackText = targetLang === 'mr' ? formatMarathiSpeechText(text) : text;

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: targetLang }),
      });

      const data = await res.json().catch(() => null);
      if (data?.phoneticText) {
        fallbackText = data.phoneticText;
      }

      if (res.ok && data?.audioBase64) {
        const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
        audioElRef.current = audio;
        audio.onended = () => setSpeaking(false);
        audio.onerror = () => setSpeaking(false);
        setTtsLoading(false);
        setSpeaking(true);
        await audio.play();
        return;
      }
    } catch {
      // Fallback to browser SpeechSynthesis below with phonetically formatted text
    }

    setTtsLoading(false);
    if ('speechSynthesis' in window) {
      const targetCode = targetLang === 'mr' ? 'mr-IN' : targetLang === 'hi' ? 'hi-IN' : 'en-IN';
      const cleanSpeech = targetLang === 'mr' ? fallbackText.replace(/।/g, '. ') : fallbackText;
      const utter = new SpeechSynthesisUtterance(cleanSpeech);
      utter.lang = targetCode;
      const voices = speechVoicesRef.current.length
        ? speechVoicesRef.current
        : window.speechSynthesis.getVoices();
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase() === targetCode.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(targetLang)) ||
        (targetLang === 'mr' ? voices.find((v) => v.lang.toLowerCase().startsWith('hi')) : undefined);
      if (matchedVoice) {
        utter.voice = matchedVoice;
        utter.lang = matchedVoice.lang;
      }
      utter.rate = targetLang === 'mr' ? 0.90 : 0.94;
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utter);
    } else {
      showToast('Voice playback unavailable in this browser.');
    }
  };

  // Core 3-Step Analysis (Step 1 Written, Step 2 Voice Talk-Back, Step 3 3D Body/Hand/Leg/Shoulder)
  const runAnalysis = async (customQuery?: string, customLang?: Lang) => {
    const q = (customQuery ?? query).trim();
    const activeLang = customLang ?? lang;
    if (!q) {
      showToast('Speak or type your concern first.');
      return;
    }

    setAnalyzing(true);
    stopSpeaking();

    const allLocalPts = findAllPointsForRequest(q);
    const isMultiRequest =
      allLocalPts.length > 3 ||
      /\b(all\s*(points|body|42|51)|full\s*body|every\s*point|show\s*all|सर्व\s*बिंदू|सभी\s*बिंदु|सगळे\s*बिंदू)\b/i.test(q);

    const buildLocalFallback = (): Omit<DiagnosisResult, 'query' | 'lang'> | null => {
      if (isMultiRequest && allLocalPts.length > 0) {
        const p = allLocalPts[0];
        const ids = allLocalPts.map((x) => x.id);
        const preset = matchConditionLocal(q);
        const spokenScripts: Record<Lang, string> = preset?.spokenScript || {
          en: `Showing all ${ids.length} requested acupressure points on the full body: ${ids.slice(0, 6).join(', ')}. ${p.how.en}`,
          hi: `पूरे शरीर पर मांगे गए सभी ${ids.length} एक्यूप्रेशर बिंदु दिखाए गए हैं: ${ids.slice(0, 6).join(', ')}। ${p.how.hi}`,
          mr: `पूर्ण शरीरावर विचारलेले सर्व ${ids.length} अ‍ॅक्युप्रेशर बिंदू दाखवले आहेत: ${ids.slice(0, 6).join(', ')}. ${p.how.mr}`,
        };
        return {
          isEmergency: Boolean(preset?.isEmergency || p.emergency),
          problemSummary: preset?.summary[activeLang] || `${ids.join(', ')}: ${p.use[activeLang]}`,
          spokenScript: spokenScripts[activeLang],
          spokenScripts,
          pressGuide: preset?.pressGuide[activeLang] || p.how[activeLang],
          recommendedPointIds: ids,
          primaryRegion: ids.length > 3 ? 'body' : preset?.primaryRegion || 'body',
          recommendedYogaIds: preset?.yogaIds || ['deep_belly'],
        };
      }
      const preset = matchConditionLocal(q);
      if (preset) {
        return {
          isEmergency: Boolean(preset.isEmergency),
          problemSummary: preset.summary[activeLang],
          spokenScript: preset.spokenScript[activeLang],
          spokenScripts: preset.spokenScript,
          pressGuide: preset.pressGuide[activeLang],
          recommendedPointIds: preset.pointIds,
          primaryRegion: preset.primaryRegion,
          recommendedYogaIds: preset.yogaIds,
        };
      }
      const pts = findPointsLocal(q);
      if (pts.length > 0) {
        const p = pts[0];
        const spokenScripts: Record<Lang, string> = {
          en: `${p.id}, ${p.n}. ${p.loc.en} ${p.how.en}`,
          hi: `${p.id}, ${p.n}. ${p.loc.hi} ${p.how.hi}`,
          mr: `${p.id} बिंदू. ${p.loc.mr} ${p.how.mr}`,
        };
        return {
          isEmergency: Boolean(p.emergency),
          problemSummary: `${p.id} (${p.n}): ${p.use[activeLang]} ${p.loc[activeLang]}`,
          spokenScript: spokenScripts[activeLang],
          spokenScripts,
          pressGuide: p.how[activeLang],
          recommendedPointIds: pts.map((x) => x.id),
          primaryRegion: p.regions.includes('hand')
            ? 'hand'
            : p.regions.includes('leg')
            ? 'leg'
            : p.regions.includes('shoulder')
            ? 'shoulder'
            : 'body',
          recommendedYogaIds: ['deep_belly'],
        };
      }
      return null;
    };

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 10000);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language: activeLang, includeAll: isMultiRequest }),
        signal: controller.signal,
      }).finally(() => window.clearTimeout(timeoutId));

      let resultData: Omit<DiagnosisResult, 'query' | 'lang'> | null = null;
      if (res.ok) {
        resultData = await res.json();
      } else {
        resultData = buildLocalFallback();
        if (!resultData) {
          const errPayload = await res.json().catch(() => ({}));
          showToast(errPayload.error || 'Could not analyze problem. Try describing body part or pain.');
          setAnalyzing(false);
          return;
        }
      }

      if (resultData) {
        const mergedIds = isMultiRequest
          ? Array.from(new Set([...resultData.recommendedPointIds, ...allLocalPts.map((p) => p.id)]))
          : resultData.recommendedPointIds.slice(0, 3);
        const topIds = mergedIds;
        const scripts: Record<Lang, string> = resultData.spokenScripts || {
          en: resultData.spokenScript,
          hi: resultData.spokenScript,
          mr: resultData.spokenScript,
        };
        const finalDiag: DiagnosisResult = {
          query: q,
          lang: activeLang,
          ...resultData,
          primaryRegion: topIds.length > 3 ? 'body' : resultData.primaryRegion,
          spokenScripts: scripts,
          recommendedPointIds: topIds,
        };
        setDiagnosis(finalDiag);
        setRequestedPointIds(topIds);
        setActiveRegion(finalDiag.primaryRegion);
        const firstPt = POINTS_3D.find((p) => p.id === topIds[0]) || POINTS_3D[0];
        handleSelectPoint(firstPt);

        // Save to localStorage History
        const nextHist: HistoryEntry[] = [
          { t: Date.now(), text: q, pts: topIds },
          ...history,
        ].slice(0, 50);
        setHistory(nextHist);
        localStorage.setItem('veda', JSON.stringify(nextHist));

        const voiceTargetLang = customLang ?? talkBackLang;
        const voiceText = finalDiag.spokenScripts[voiceTargetLang] || finalDiag.spokenScript;
        if (autoTalkBack && voiceText) {
          speakText(voiceText, voiceTargetLang);
        }
      }
    } catch {
      const fallback = buildLocalFallback();
      if (fallback) {
        const topIds = isMultiRequest
          ? fallback.recommendedPointIds
          : fallback.recommendedPointIds.slice(0, 3);
        const finalDiag: DiagnosisResult = {
          query: q,
          lang: activeLang,
          ...fallback,
          primaryRegion: topIds.length > 3 ? 'body' : fallback.primaryRegion,
          recommendedPointIds: topIds,
        };
        setDiagnosis(finalDiag);
        setRequestedPointIds(topIds);
        setActiveRegion(finalDiag.primaryRegion);
        const firstPt = POINTS_3D.find((p) => p.id === topIds[0]) || POINTS_3D[0];
        handleSelectPoint(firstPt);
        const voiceTargetLang = customLang ?? talkBackLang;
        const voiceText = finalDiag.spokenScripts[voiceTargetLang] || finalDiag.spokenScript;
        if (autoTalkBack && voiceText) {
          speakText(voiceText, voiceTargetLang);
        }
      } else {
        showToast('Network timeout while analyzing. Please try again.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  // Working Push-to-Speak Voice Input (MediaRecorder -> Gemini Transcribe + SpeechRecognition live captions)
  const toggleVoiceInput = async () => {
    if (recording) {
      setRecording(false);
      try {
        (speechRecRef.current as { stop?: () => void } | null)?.stop?.();
      } catch {
        // Ignore
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    stopSpeaking();
    liveTranscriptRef.current = '';

    // Start Web Speech Recognition if available for instant live captions
    const win = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        continuous: boolean;
        onresult: (e: { results: ArrayLike<{ 0: { transcript: string } }> }) => void;
        start: () => void;
        stop: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        continuous: boolean;
        onresult: (e: { results: ArrayLike<{ 0: { transcript: string } }> }) => void;
        start: () => void;
        stop: () => void;
      };
    };
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SR) {
      try {
        const rec = new SR();
        rec.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
        rec.interimResults = true;
        rec.continuous = true;
        rec.onresult = (e) => {
          const text = Array.from(e.results)
            .map((r) => r[0].transcript)
            .join(' ')
            .trim();
          liveTranscriptRef.current = text;
          setQuery(text);
        };
        rec.start();
        speechRecRef.current = rec;
      } catch {
        // MediaRecorder handles audio capture reliably regardless
      }
    }

    // Start MediaRecorder for reliable Gemini transcription across all browsers
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const mr = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      mr.ondataavailable = (ev) => {
        if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        if (blob.size < 800) {
          if (liveTranscriptRef.current) {
            runAnalysis(liveTranscriptRef.current);
          }
          return;
        }

        setTranscribing(true);
        try {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64 = String(reader.result || '').split(',')[1] || '';
            try {
              const res = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioBase64: base64, mimeType, language: lang }),
              });
              if (res.ok) {
                const data = await res.json();
                const finalText = (data.text || liveTranscriptRef.current || '').trim();
                if (finalText) {
                  setQuery(finalText);
                  setTranscribing(false);
                  runAnalysis(finalText);
                  return;
                }
              }
            } catch {
              // Fallback to live speech transcript if present
            }
            setTranscribing(false);
            if (liveTranscriptRef.current) {
              runAnalysis(liveTranscriptRef.current);
            } else {
              showToast('Could not hear clearly. Please try again or type your concern.');
            }
          };
          reader.readAsDataURL(blob);
        } catch {
          setTranscribing(false);
        }
      };

      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
    } catch {
      if (speechRecRef.current) {
        setRecording(true);
      } else {
        showToast('Microphone permission denied. Please allow mic access or type below.');
      }
    }
  };

  // Audio File Upload Transcription
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTranscribing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = String(reader.result || '').split(',')[1] || '';
      try {
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64,
            mimeType: file.type || 'audio/mp3',
            language: lang,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.text) {
            setQuery(data.text);
            setTranscribing(false);
            runAnalysis(data.text);
            return;
          }
        }
        showToast('Audio transcription failed. Please try voice record or typing.');
      } catch {
        showToast('Network error transcribing audio.');
      } finally {
        setTranscribing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Chat Send — highlights top 2-3 instant-relief points whenever any point or problem is requested
  const sendChat = async (overrideMsg?: string) => {
    const msg = (overrideMsg ?? chatInput).trim();
    if (!msg) return;
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', html: msg }]);
    setChatBusy(true);

    const activateTopPoints = (pts: Point3D[]) => {
      if (pts.length === 0) return;
      const isMulti = pts.length > 3;
      const chosen = isMulti ? pts : pts.slice(0, 3);
      setRequestedPointIds(chosen.map((p) => p.id));
      handleSelectPoint(chosen[0]);
      if (isMulti) {
        setActiveRegion('body');
      } else {
        const p = chosen[0];
        setActiveRegion(
          p.regions.includes('hand')
            ? 'hand'
            : p.regions.includes('leg')
            ? 'leg'
            : p.regions.includes('shoulder')
            ? 'shoulder'
            : 'body'
        );
      }
    };

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 10000);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, language: lang, mode: chatMode }),
        signal: controller.signal,
      }).finally(() => window.clearTimeout(timeoutId));
      if (res.ok) {
        const data = await res.json();
        const serverIds: string[] = Array.isArray(data.topPointIds) ? data.topPointIds : [];
        const localAll = findAllPointsForRequest(msg);
        const multiReq =
          serverIds.length > 3 ||
          localAll.length > 3 ||
          /\b(all\s*(points|body|42|51)|full\s*body|every\s*point|show\s*all|सर्व\s*बिंदू|सभी\s*बिंदु)\b/i.test(msg);
        const resolvedPts = multiReq
          ? Array.from(
              new Set([...serverIds, ...localAll.map((p) => p.id)])
            )
              .map((id) => POINTS_3D.find((p) => p.id === id))
              .filter((p): p is Point3D => Boolean(p))
          : serverIds.length > 0
          ? serverIds.map((id) => POINTS_3D.find((p) => p.id === id)).filter((p): p is Point3D => Boolean(p))
          : findPointsLocal(msg);
        activateTopPoints(resolvedPts);
        const topBadge =
          resolvedPts.length > 0
            ? `<div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.12);font-size:12px;color:#7fe3ff"><b>${
                resolvedPts.length > 3
                  ? `Showing All ${resolvedPts.length} Requested Points:`
                  : 'Top Instant-Relief Points:'
              }</b> ${resolvedPts
                .slice(0, 8)
                .map((p, idx) => `#${idx + 1} ${p.id}`)
                .join(' · ')}${resolvedPts.length > 8 ? ` +${resolvedPts.length - 8} more` : ''} (highlighted on Full 3D Body)</div>`
            : '';
        setChatMessages((prev) => [...prev, { role: 'assistant', html: `${data.reply}${topBadge}` }]);
        setChatBusy(false);
        return;
      }
    } catch {
      // Fallback to local Top Instant-Relief lookup
    }

    const allPts = findAllPointsForRequest(msg);
    const pts = allPts.length > 3 ? allPts : findPointsLocal(msg).slice(0, 3);
    if (pts.length > 0) {
      activateTopPoints(pts);
      const listHtml = pts
        .map((p, idx) => {
          const spec = getPointPressSpec(p);
          return `<div style="margin-top:4px"><b>#${idx + 1} ${p.id} · ${p.n.split('(')[0].trim()}</b> — ${
            chatMode === 'Educator'
              ? `${p.loc[lang]} <i>${p.how[lang]}</i>`
              : p.use[lang]
          } <span style="color:#7fe3ff;font-size:11px">[⏱ ${spec.duration[lang]} · ✋ ${spec.pressureLabel[lang]}]</span></div>`;
        })
        .join('');
      const mrSpeech = `तात्काळ आरामासाठी प्रमुख ${pts.length} बिंदू: ${pts
        .slice(0, 4)
        .map((p, idx) => `#${idx + 1} ${p.id}. ${p.loc.mr} ${p.how.mr}`)
        .join(' ')}`;
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          html: `<b>Top ${pts.length} Point${pts.length > 1 ? 's' : ''} for Instant Relief:</b>${listHtml}`,
          mrText: mrSpeech,
        },
      ]);
    } else {
      const norm = msg.toUpperCase().replace(/\bUB(\d+)/g, 'BL$1');
      const atlasHit = ATLAS.find((a) => norm.includes(a.id) || msg.toLowerCase().includes(a.n.toLowerCase()));
      if (atlasHit) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            html: `<b>Top Instant-Relief Reference · ${atlasHit.id} (${atlasHit.n})</b> (${MERIDIAN_NAMES[atlasHit.m]})<br/>${atlasHit.t}${
              atlasHit.c ? '<br/>Best for: ' + atlasHit.c : ''
            }`,
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            html: 'Ask me about any symptom or point (e.g. knee pain, headache, UB11 bone pain, high BP, diabetes) and I will give you the <b>top points for instant relief</b>.',
          },
        ]);
      }
    }
    setChatBusy(false);
  };

  const u = UI_COPY[lang];
  const activePointSpec = getPointPressSpec(selectedPoint);
  const activePointRemedy = getPointHomeRemedy(selectedPoint);
  const atlasRef = ATLAS.find((a) => a.id === selectedPoint.id);

  const navItems: { key: TabKey; label: string }[] = [
    { key: 'assist', label: 'Smart assistant' },
    { key: 'body', label: '3D Muscular Body' },
    { key: 'yoga', label: 'Yoga & Exercises' },
    { key: 'remedies', label: 'Home Remedies' },
    { key: 'hw', label: 'Arduino hardware' },
    { key: 'lib', label: 'Acupoint library' },
    { key: 'hist', label: `History (${history.length})` },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Cosmic Glassmorphic Ambient Background */}
      <div className="veda-bg">
        <i />
        <i />
        <i />
      </div>

      {/* Header — Top Bar Contract: Brand | Nav Links | Language Indicator (Interactive demo button REMOVED as requested) */}
      <header className="mx-3 sm:mx-6 mt-3 px-4 py-2.5 glass-panel !rounded-full flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="w-8 h-8 rounded-xl grid place-items-center font-bold text-white bg-gradient-to-br from-[#7fe3ff] to-[#2f7bff] shadow-[0_3px_0_#1b4fb0]">
            V
          </span>
          <span className="font-bold text-base tracking-tight whitespace-nowrap text-white">Veda AI</span>
        </div>

        <nav className="flex items-center gap-1 bg-black/25 p-1 rounded-full overflow-x-auto max-w-full">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                tab === item.key
                  ? 'bg-gradient-to-b from-white/35 to-white/10 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 shrink-0">
          <select
            aria-label="Select Language"
            value={lang}
            onChange={(e) => {
              const next = e.target.value as Lang;
              setLang(next);
              setTalkBackLang(next);
            }}
            className="veda-input !py-1.5 !px-3 !rounded-full text-xs font-semibold w-auto"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1340px] mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* === SMART ASSISTANT TAB === */}
        {tab === 'assist' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* Camera Hand Point Overlay */}
              <div className="lg:col-span-5 glass-panel p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-bold">Camera Hand Point System</h2>
                  <span className="text-xs text-sky-200">Points show on hand only (not on face)</span>
                </div>
                <CameraHandTracker
                  activePointIds={requestedPointIds || []}
                  selectedPoint={selectedPoint}
                  onSelectPoint={handleSelectPoint}
                />
              </div>

              {/* Voice & Written Problem Teller */}
              <div className="lg:col-span-4 glass-panel p-5 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-bold">Voice &amp; Written Problem Teller</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-black/30 p-0.5 rounded-lg border border-white/10">
                      <span className="text-[11px] text-slate-300 px-1.5">Talk-Back:</span>
                      {(['en', 'hi', 'mr'] as Lang[]).map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setTalkBackLang(l)}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                            talkBackLang === l ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {l === 'en' ? 'EN' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
                        </button>
                      ))}
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoTalkBack}
                        onChange={(e) => setAutoTalkBack(e.target.checked)}
                        className="accent-sky-400"
                      />
                      Auto Talk-Back
                    </label>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={u.placeholder}
                  className="veda-input w-full text-sm resize-none"
                />

                {/* Push-to-Speak Voice & Analyze Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    disabled={transcribing}
                    className={`veda-btn flex items-center gap-2 ${
                      recording ? 'veda-btn-danger' : 'veda-btn-green'
                    }`}
                  >
                    {transcribing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : recording ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                    {transcribing ? 'Transcribing…' : recording ? u.stopSpeakBtn : u.speakBtn}
                  </button>

                  <label className="veda-btn flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Upload Audio</span>
                    <input type="file" accept="audio/*" hidden onChange={handleAudioUpload} />
                  </label>

                  <button
                    type="button"
                    disabled={analyzing}
                    onClick={() => runAnalysis()}
                    className="veda-btn veda-btn-primary ml-auto flex items-center gap-1.5"
                  >
                    {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {analyzing ? 'Analyzing…' : u.analyzeBtn}
                  </button>
                </div>

                {/* Quick Symptom & Emergency Test Chips */}
                <div>
                  <div className="text-xs text-slate-300 mb-1.5">
                    Quick Health &amp; Emergency Cases ({lang === 'hi' ? 'हिन्दी' : lang === 'mr' ? 'मराठी' : 'English'}):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CONDITION_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          const txt = preset.sampleQuery[lang];
                          setQuery(txt);
                          runAnalysis(txt, lang);
                        }}
                        className={`veda-chip ${
                          preset.isEmergency ? '!border-rose-400/60 !bg-rose-500/20 text-rose-100' : ''
                        }`}
                      >
                        {preset.isEmergency ? '⚠ ' : ''}
                        {preset.label[lang]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mini 3D Anatomical Body Preview */}
              <div className="lg:col-span-3 glass-panel p-4 flex flex-col gap-2.5">
                <MiniBody3D
                  selectedPoint={selectedPoint}
                  onSelectPoint={handleSelectPoint}
                  highlightedIds={requestedPointIds}
                  onOpenFull3D={() => {
                    setActiveRegion('body');
                    setTab('body');
                  }}
                />
              </div>
            </div>

            {/* === 3-STEP PATIENT SOLUTION PANEL === */}
            {diagnosis && (
              <div className="glass-panel p-5 space-y-4 border-sky-400/35">
                {diagnosis.isEmergency && (
                  <div className="rounded-2xl bg-rose-500/20 border border-rose-400/60 p-4 flex items-start gap-3 text-rose-100">
                    <AlertTriangle className="w-6 h-6 text-rose-300 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-bold text-base">MEDICAL EMERGENCY ALERT · Call 108 / 112 Immediately</div>
                      <p className="mt-1 opacity-95">
                        Acupressure is supportive first-aid only while waiting for emergency medical transport. Do not delay hospital care.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  {/* STEP 1 & STEP 2: Written Answer + Voice Talk-Back */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Step 1: Written Answer */}
                    <div className="rounded-2xl bg-black/30 border border-white/15 p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                          {u.step1}
                        </span>
                        <span className="text-xs text-slate-300">
                          {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिन्दी' : 'English'}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-white">{diagnosis.problemSummary}</p>
                      <div className="text-xs text-sky-200 bg-sky-500/10 border border-sky-400/25 rounded-xl p-2.5">
                        <b>How to Press:</b> {diagnosis.pressGuide}
                      </div>

                      <div>
                        <div className="text-xs text-slate-300 mb-1.5">
                          {diagnosis.recommendedPointIds.length > 3
                            ? `All ${diagnosis.recommendedPointIds.length} Requested Points (Top instant-relief first · Tap to inspect):`
                            : `Top ${diagnosis.recommendedPointIds.length} Points for Instant Relief (Tap to inspect):`}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {diagnosis.recommendedPointIds.map((pid, idx) => {
                            const pt = POINTS_3D.find((x) => x.id === pid);
                            if (!pt) return null;
                            return (
                              <button
                                key={pid}
                                type="button"
                                onClick={() => {
                                  handleSelectPoint(pt);
                                  if (pt.regions.includes('hand')) setActiveRegion('hand');
                                  else if (pt.regions.includes('leg')) setActiveRegion('leg');
                                  else if (pt.regions.includes('shoulder')) setActiveRegion('shoulder');
                                  else setActiveRegion('body');
                                }}
                                style={{ borderColor: pt.c }}
                                className={`veda-chip ${selectedPoint.id === pt.id ? 'on' : ''}`}
                              >
                                #{idx + 1} · {pt.id} · {pt.n.split('(')[0].trim()}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Selected Point Duration & Pressure Used */}
                      <div className="rounded-xl bg-white/5 border border-white/15 p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-white">
                            {selectedPoint.id} · {selectedPoint.n.split('(')[0].trim()}
                          </span>
                          <span className="text-[11px] text-sky-300 font-semibold">
                            {u.dur} &amp; {u.pres}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="rounded-lg bg-sky-500/10 border border-sky-400/25 px-2.5 py-2">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {u.dur}
                            </div>
                            <div className="font-semibold text-white mt-0.5">{activePointSpec.duration[lang]}</div>
                          </div>
                          <div className="rounded-lg bg-amber-500/10 border border-amber-400/25 px-2.5 py-2">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                              <Gauge className="w-3 h-3" /> {u.pres}
                            </div>
                            <div className="font-semibold text-white mt-0.5">{activePointSpec.pressureLabel[lang]}</div>
                            <div className="flex gap-1 mt-1" aria-hidden="true">
                              {[1, 2, 3, 4, 5].map((lvl) => (
                                <span
                                  key={lvl}
                                  className={`h-1.5 flex-1 rounded-full ${
                                    lvl <= activePointSpec.pressureLevel ? 'bg-amber-400' : 'bg-white/15'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-300 leading-relaxed">
                          {activePointSpec.pressureDetail[lang]}
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Voice Talk-Back (English, Hindi & Marathi) */}
                    <div className="rounded-2xl bg-black/30 border border-white/15 p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                          {u.step2}
                        </span>
                        <div className="flex gap-1 bg-black/30 p-0.5 rounded-lg border border-white/10">
                          {(['en', 'hi', 'mr'] as Lang[]).map((l) => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => {
                                setTalkBackLang(l);
                                const script = diagnosis.spokenScripts?.[l] || diagnosis.spokenScript;
                                speakText(script, l);
                              }}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                                talkBackLang === l ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-white/10'
                              }`}
                            >
                              {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        “{diagnosis.spokenScripts?.[talkBackLang] || diagnosis.spokenScript}”
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const activeScript = diagnosis.spokenScripts?.[talkBackLang] || diagnosis.spokenScript;
                            if (speaking) stopSpeaking();
                            else speakText(activeScript, talkBackLang);
                          }}
                          disabled={ttsLoading}
                          className={`veda-btn flex items-center gap-1.5 ${
                            speaking ? 'veda-btn-danger' : 'veda-btn-primary'
                          }`}
                        >
                          {ttsLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : speaking ? (
                            <Square className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                          {ttsLoading
                            ? 'Preparing Voice…'
                            : speaking
                            ? 'Stop Voice'
                            : talkBackLang === 'mr'
                            ? 'मराठीत ऐका (Marathi)'
                            : talkBackLang === 'hi'
                            ? 'हिंदी में सुनें (Hindi)'
                            : 'Listen Voice Answer'}
                        </button>

                        {talkBackLang !== 'mr' && (
                          <button
                            type="button"
                            disabled={ttsLoading}
                            onClick={() => {
                              setTalkBackLang('mr');
                              const mrScript = diagnosis.spokenScripts?.mr || diagnosis.spokenScript;
                              speakText(mrScript, 'mr');
                            }}
                            className="veda-btn flex items-center gap-1.5"
                          >
                            <Volume2 className="w-4 h-4 text-amber-300" />
                            मराठीत ऐका
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setTab('yoga')}
                          className="veda-btn veda-btn-green flex items-center gap-1.5"
                        >
                          <Wind className="w-4 h-4" />
                          Related Yoga &amp; Breathing
                        </button>

                        <button
                          type="button"
                          onClick={() => setTab('remedies')}
                          className="veda-btn flex items-center gap-1.5"
                        >
                          <Leaf className="w-4 h-4 text-emerald-300" />
                          Instant Home Remedies
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Clean 3D Problem Location (Problem Points Only) */}
                  <div className="lg:col-span-7 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        {u.step3} — Showing{' '}
                        {diagnosis.recommendedPointIds.length > 5
                          ? `${diagnosis.recommendedPointIds.length} requested points`
                          : diagnosis.recommendedPointIds.join(', ')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTab('body')}
                        className="veda-btn text-xs py-1 px-2.5 flex items-center gap-1"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> Open Full 3D Studio
                      </button>
                    </div>
                    <Muscular3DViewer
                      region={activeRegion}
                      onRegionChange={setActiveRegion}
                      selectedPoint={selectedPoint}
                      onSelectPoint={handleSelectPoint}
                      problemPointIds={diagnosis.recommendedPointIds}
                      heightClass="h-[430px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Acupressure Assistant Chat (Preserved from Veda AI) */}
            <div className="glass-panel p-5 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-sky-300" />
                  Acupressure Assistant Chat
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex bg-black/30 p-1 rounded-xl">
                    {(['Educator', 'Quick lookup'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setChatMode(m)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          chatMode === m ? 'bg-sky-500 text-white' : 'text-slate-300'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setChatMessages([])}
                    className="veda-btn text-xs py-1 px-3"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="h-56 overflow-y-auto space-y-2.5 pr-1">
                {chatMessages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex flex-col gap-1 ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm border ${
                        m.role === 'user'
                          ? 'bg-gradient-to-b from-sky-400 to-blue-600 text-white border-sky-300/40'
                          : 'bg-white/10 text-slate-100 border-white/15'
                      }`}
                      dangerouslySetInnerHTML={{ __html: m.html }}
                    />
                    {m.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 pl-1">
                        <button
                          type="button"
                          disabled={ttsLoading}
                          onClick={() => {
                            const txt =
                              talkBackLang === 'mr' && m.mrText ? m.mrText : htmlToPlainText(m.html);
                            if (speaking) stopSpeaking();
                            else speakText(txt, talkBackLang);
                          }}
                          className="flex items-center gap-1 text-[11px] text-sky-300 hover:text-sky-200 px-2 py-0.5 rounded-full bg-white/5 border border-white/10"
                        >
                          <Volume2 className="w-3 h-3" />
                          {talkBackLang === 'mr' ? 'मराठीत ऐका' : talkBackLang === 'hi' ? 'हिंदी में सुनें' : 'Talk-Back'}
                        </button>
                        {talkBackLang !== 'mr' && (
                          <button
                            type="button"
                            disabled={ttsLoading}
                            onClick={() => {
                              setTalkBackLang('mr');
                              speakText(m.mrText || htmlToPlainText(m.html), 'mr');
                            }}
                            className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 px-2 py-0.5 rounded-full bg-white/5 border border-white/10"
                          >
                            <Volume2 className="w-3 h-3" />
                            मराठी Talk-Back
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {chatBusy && <div className="text-xs text-sky-200">Thinking…</div>}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  'What is ST36 and SP10?',
                  'UB11 bone pain point',
                  'Emergency heart attack points',
                  'Points for diabetes',
                ].map((q) => (
                  <button key={q} type="button" onClick={() => sendChat(q)} className="veda-chip">
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendChat();
                  }}
                  placeholder="Ask about any point (LI4, ST36, SP10, UB11) or symptom…"
                  className="veda-input flex-1 text-sm"
                />
                <button type="button" onClick={() => sendChat()} className="veda-btn veda-btn-primary">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === 3D MUSCULAR BODY STUDIO TAB === */}
        {tab === 'body' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7 glass-panel p-5 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-bold">
                  3D Muscular Anatomy — Body, Hand, Leg &amp; Shoulder
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300">Drag to rotate · Scroll/buttons to zoom</span>
                  {requestedPointIds && requestedPointIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setRequestedPointIds(null);
                        setDiagnosis(null);
                      }}
                      className="veda-btn text-xs py-1 px-2.5"
                    >
                      Clear Points
                    </button>
                  )}
                </div>
              </div>

              <Muscular3DViewer
                region={activeRegion}
                onRegionChange={setActiveRegion}
                selectedPoint={selectedPoint}
                onSelectPoint={handleSelectPoint}
                problemPointIds={requestedPointIds}
                defaultShowAllPoints={true}
                heightClass="h-[540px]"
              />

              {/* Show Top Instant-Relief filter chips when active, or interactive point strip on body */}
              {requestedPointIds && requestedPointIds.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs font-semibold text-emerald-300 mr-1">Top Instant-Relief:</span>
                  {requestedPointIds.map((pid, idx) => {
                    const pt = POINTS_3D.find((p) => p.id === pid);
                    if (!pt) return null;
                    return (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => {
                          handleSelectPoint(pt);
                          if (pt.regions.includes('hand')) setActiveRegion('hand');
                          else if (pt.regions.includes('leg')) setActiveRegion('leg');
                          else if (pt.regions.includes('shoulder')) setActiveRegion('shoulder');
                          else setActiveRegion('body');
                        }}
                        className={`veda-chip ${selectedPoint.id === pt.id ? 'on' : ''}`}
                      >
                        #{idx + 1} {pt.id} · {pt.n.split('(')[0].trim()}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 pt-1 max-h-24 overflow-y-auto pr-1">
                  {POINTS_3D.filter((p) =>
                    activeRegion === 'body'
                      ? p.regions.includes('body') && !p.regions.includes('hand')
                      : p.regions.includes(activeRegion)
                  ).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPoint(p)}
                      className={`veda-chip ${selectedPoint.id === p.id ? 'on' : ''}`}
                    >
                      {p.id}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Selected Point Guide + Top Instant-Relief Finder */}
            <div className="lg:col-span-5 glass-panel p-5 space-y-4">
              {(!requestedPointIds || requestedPointIds.length === 0) && (
                <div className="rounded-2xl bg-black/25 border border-white/10 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-sky-300">
                      Filter Top Relief Points ({lang === 'hi' ? 'हिन्दी' : lang === 'mr' ? 'मराठी' : 'English'}):
                    </span>
                    <button
                      type="button"
                      onClick={() => setTab('assist')}
                      className="text-xs text-emerald-300 hover:underline flex items-center gap-1"
                    >
                      <Mic className="w-3 h-3" /> Ask by Voice
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CONDITION_PRESETS.filter((pr) => pr.primaryRegion !== 'hand')
                      .slice(0, 6)
                      .map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          const txt = preset.sampleQuery[lang];
                          setQuery(txt);
                          runAnalysis(txt, lang);
                        }}
                        className={`veda-chip !py-1 !px-2 text-[11px] ${
                          preset.isEmergency ? '!border-rose-400/60 !bg-rose-500/20 text-rose-100' : ''
                        }`}
                      >
                        {preset.isEmergency ? '⚠ ' : ''}
                        {preset.label[lang]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="px-2.5 py-1 rounded-lg font-bold text-sm text-slate-950"
                  style={{ background: selectedPoint.c }}
                >
                  {selectedPoint.id}
                </span>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedPoint.n}</h3>
                  <div className="text-xs text-slate-300">{selectedPoint.m} meridian</div>
                </div>
                <div className="ml-auto flex gap-1 bg-black/30 p-1 rounded-xl">
                  {(['en', 'hi', 'mr'] as Lang[]).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => {
                        setLang(l);
                        setTalkBackLang(l);
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        lang === l ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {l === 'en' ? 'EN' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  speaking
                    ? stopSpeaking()
                    : speakText(
                        lang === 'mr'
                          ? `${selectedPoint.id} बिंदू. ${selectedPoint.loc.mr} कालावधी: ${activePointSpec.duration.mr}. दाब: ${activePointSpec.pressureLabel.mr}. ${selectedPoint.how.mr}`
                          : lang === 'hi'
                          ? `${selectedPoint.id}, ${selectedPoint.n}. ${selectedPoint.loc.hi} समय: ${activePointSpec.duration.hi}। दबाव: ${activePointSpec.pressureLabel.hi}। ${selectedPoint.how.hi}`
                          : `${selectedPoint.id}, ${selectedPoint.n}. ${selectedPoint.loc.en} Duration: ${activePointSpec.duration.en}. Pressure: ${activePointSpec.pressureLabel.en}. ${selectedPoint.how.en}`,
                        lang
                      )
                }
                className={`veda-btn w-full flex items-center justify-center gap-2 ${
                  speaking ? 'veda-btn-danger' : 'veda-btn-primary'
                }`}
              >
                {speaking ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {speaking
                  ? 'Stop Voice Explanation'
                  : lang === 'mr'
                  ? 'मराठीत माहिती ऐका (Talk-Back)'
                  : lang === 'hi'
                  ? 'हिंदी में सुनें (Talk-Back)'
                  : 'Listen Point Guide in Voice'}
              </button>

              {/* Pressing Duration & Pressure Used Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-sky-500/10 border border-sky-400/30 p-3 space-y-1">
                  <div className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {u.dur}
                  </div>
                  <div className="text-sm font-bold text-white">{activePointSpec.duration[lang]}</div>
                  <div className="text-[11px] text-slate-300">
                    {Math.floor(activePointSpec.durationSec / 60)}:
                    {String(activePointSpec.durationSec % 60).padStart(2, '0')} guided timer preset
                  </div>
                </div>

                <div className="rounded-xl bg-amber-500/10 border border-amber-400/30 p-3 space-y-1.5">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5" />
                    {u.pres}
                  </div>
                  <div className="text-sm font-bold text-white">{activePointSpec.pressureLabel[lang]}</div>
                  <div className="flex gap-1" aria-label={`Pressure level ${activePointSpec.pressureLevel} out of 5`}>
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <span
                        key={lvl}
                        className={`h-1.5 flex-1 rounded-full ${
                          lvl <= activePointSpec.pressureLevel ? 'bg-amber-400' : 'bg-white/15'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-200 leading-snug">{activePointSpec.pressureDetail[lang]}</div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-xs font-bold text-sky-300 mb-1">{u.loc}</div>
                  <div className="rounded-xl bg-black/30 p-3 text-slate-100">{selectedPoint.loc[lang]}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300 mb-1">{u.how}</div>
                  <div className="rounded-xl bg-black/30 p-3 text-slate-100">{selectedPoint.how[lang]}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-300 mb-1">{u.use}</div>
                  <div className="rounded-xl bg-black/30 p-3 text-slate-100">{selectedPoint.use[lang]}</div>
                </div>
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/30 p-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5" />
                      Instant Home Remedy · {activePointRemedy.prepTime[lang]}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTab('remedies')}
                      className="text-[11px] font-semibold text-sky-300 hover:underline cursor-pointer"
                    >
                      Open Remedies Tab →
                    </button>
                  </div>
                  <div className="font-semibold text-white text-xs">{activePointRemedy.title[lang]}</div>
                  <div className="text-xs text-slate-200/90 leading-relaxed">{activePointRemedy.steps[lang]}</div>
                </div>
              </div>

              <div className="rounded-xl bg-amber-500/15 border border-amber-400/40 p-3 text-xs text-amber-200">
                <b>{u.saf}:</b> {selectedPoint.pregnancyCaution ? `${u.pregWarn} ` : ''}
                {u.safetyNotice}
              </div>

              {atlasRef && (
                <div>
                  <div className="text-xs font-bold text-slate-300 mb-1">Atlas Reference</div>
                  <div className="rounded-xl bg-black/25 p-3 text-xs text-slate-200 space-y-1">
                    <div>{atlasRef.t}</div>
                    {atlasRef.c && <div className="text-sky-300">Key point for: {atlasRef.c}</div>}
                    {atlasRef.w && <div className="text-amber-300">⚠ {atlasRef.w}</div>}
                  </div>
                </div>
              )}

              {/* Guided Acupressure Session Timer Synced to Point Duration */}
              <GuidedSessionTimer
                timerLeft={timerLeft}
                totalSeconds={activePointSpec.durationSec}
                timerRunning={timerRunning}
                pointId={selectedPoint.id}
                durationBadge={activePointSpec.duration[lang]}
                pressureBadge={activePointSpec.pressureLabel[lang]}
                onReset={() => {
                  setTimerRunning(false);
                  setTimerLeft(activePointSpec.durationSec);
                  if (selectedPoint.pin) togglePin(selectedPoint.pin, false);
                }}
                onToggle={() => {
                  if (timerRunning) {
                    setTimerRunning(false);
                    if (selectedPoint.pin) togglePin(selectedPoint.pin, false);
                  } else {
                    if (timerLeft <= 0 || timerLeft > activePointSpec.durationSec) {
                      setTimerLeft(activePointSpec.durationSec);
                    }
                    setTimerRunning(true);
                    if (selectedPoint.pin) togglePin(selectedPoint.pin, true);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* === YOGA & BREATHING TAB === */}
        {tab === 'yoga' && (
          <YogaStudio
            lang={lang}
            onLangChange={setLang}
            recommendedYogaIds={diagnosis?.recommendedYogaIds || []}
            onSpeakCue={speakText}
          />
        )}

        {/* === INSTANT HOME REMEDIES TAB (Between Yoga & Exercises and Arduino Hardware) === */}
        {tab === 'remedies' && (
          <HomeRemediesStudio
            lang={lang}
            onLangChange={setLang}
            selectedPoint={selectedPoint}
            onSelectPoint={handleSelectPoint}
            recommendedPointIds={requestedPointIds}
            onSpeakCue={speakText}
            onShowIn3D={(pt) => {
              setRequestedPointIds([pt.id]);
              handleSelectPoint(pt);
              setActiveRegion(
                pt.regions.includes('hand')
                  ? 'hand'
                  : pt.regions.includes('leg')
                  ? 'leg'
                  : pt.regions.includes('shoulder')
                  ? 'shoulder'
                  : 'body'
              );
              setTab('body');
            }}
            onOpenYoga={() => setTab('yoga')}
          />
        )}

        {/* === ARDUINO HARDWARE TAB === */}
        {tab === 'hw' && (
          <ArduinoHardware
            pins={pins}
            onTogglePin={togglePin}
            onAllOff={() => setPins({})}
            serialLogs={serialLogs}
            onAddLog={addSerialLog}
            selectedPoint={selectedPoint}
            onSelectPoint={handleSelectPoint}
          />
        )}

        {/* === ACUPOINT LIBRARY TAB === */}
        {tab === 'lib' && (
          <AcupointLibrary
            onShowIn3D={(pt) => {
              setRequestedPointIds([pt.id]);
              handleSelectPoint(pt);
              setActiveRegion(
                pt.regions.includes('hand')
                  ? 'hand'
                  : pt.regions.includes('leg')
                  ? 'leg'
                  : pt.regions.includes('shoulder')
                  ? 'shoulder'
                  : 'body'
              );
              setTab('body');
            }}
          />
        )}

        {/* === HISTORY TAB === */}
        {tab === 'hist' && (
          <HistoryTab
            entries={history}
            onClear={() => {
              localStorage.removeItem('veda');
              setHistory([]);
              showToast('History cleared');
            }}
            onLoadEntry={(entry) => {
              setQuery(entry.text);
              setTab('assist');
              runAnalysis(entry.text);
            }}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full glass-panel text-sm font-semibold text-white flex items-center gap-2 shadow-2xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          {toastMsg}
        </div>
      )}
    </div>
  );
}
