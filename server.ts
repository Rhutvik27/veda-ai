import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  POINTS_3D,
  matchConditionLocal,
  findPointsLocal,
  findAllPointsForRequest,
  type Lang,
} from './src/data/acupoints.ts';
import { ATLAS } from './src/data/atlas.ts';
import { formatMarathiSpeechText, needsMarathiTranslation } from './src/utils/marathiSpeech.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getAiClient(apiVersion?: string): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({
    apiKey,
    ...(apiVersion ? { apiVersion } : {}),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function withRetry<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isTransient = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429');
      if (!isTransient || attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 350));
    }
  }
  throw lastErr;
}

const VALID_3D_IDS = POINTS_3D.map((p) => p.id);

const LANG_LABEL: Record<Lang, string> = {
  en: 'simple everyday English that anyone can understand',
  hi: 'सरल और आम बोलचाल की हिंदी (simple everyday Hindi using Devanagari script, friendly and easy for common people)',
  mr: 'सोपी, नैसर्गिक आणि रोजच्या वापरातील महाराष्ट्रातील बोलचालची मराठी (natural spoken Maharashtra Marathi in Devanagari script, never Hindi)',
};

const ttsCache = new Map<
  string,
  { audioBase64: string; mimeType: string; spokenText: string; phoneticText: string }
>();

function isMultiPointQuery(query: string, explicitIncludeAll = false): boolean {
  if (explicitIncludeAll) return true;
  if (findAllPointsForRequest(query).length > 3) return true;
  return /\b(all\s*(points|body|42|51)|full\s*body|every\s*point|show\s*all|सर्व\s*बिंदू|सभी\s*बिंदु|सगळे\s*बिंदू)\b/i.test(
    query
  );
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '18mb' }));

  // Serve MediaPipe Tasks Vision WASM locally so hand detection works reliably without external WASM fetches
  const wasmDir = path.resolve(__dirname, 'node_modules/@mediapipe/tasks-vision/wasm');
  app.use('/wasm', express.static(wasmDir));

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, hasKey: Boolean(getAiClient()) });
  });

  // 1. Analyze patient symptom in English, Hindi, or Marathi -> 3-step structured response
  app.post('/api/analyze', async (req, res) => {
    const query = String(req.body?.query || '').trim();
    const lang: Lang = ['en', 'hi', 'mr'].includes(req.body?.language) ? req.body.language : 'en';
    const includeAll = Boolean(req.body?.includeAll);

    if (!query) {
      return res.status(400).json({ error: 'Please describe your health concern first.' });
    }

    const ai = getAiClient();
    const localPreset = matchConditionLocal(query);
    const localPts = findPointsLocal(query);
    const allMatchedPts = findAllPointsForRequest(query);
    const multiRequest = isMultiPointQuery(query, includeAll);

    if (!ai) {
      if (multiRequest && allMatchedPts.length > 0) {
        const pt = allMatchedPts[0];
        const summaryIds = allMatchedPts.map((p) => p.id);
        const spokenScripts = localPreset?.spokenScript || {
          en: `Showing ${summaryIds.length} acupressure points on the full body: ${summaryIds.slice(0, 6).join(', ')}. ${pt.how.en}`,
          hi: `पूरे शरीर पर ${summaryIds.length} एक्यूप्रेशर बिंदु दिखाए गए हैं: ${summaryIds.slice(0, 6).join(', ')}। ${pt.how.hi}`,
          mr: `पूर्ण शरीरावर ${summaryIds.length} अ‍ॅक्युप्रेशर बिंदू दाखवले आहेत: ${summaryIds.slice(0, 6).join(', ')}. ${pt.how.mr}`,
        };
        return res.json({
          source: 'clinical-knowledge',
          isEmergency: Boolean(localPreset?.isEmergency || pt.emergency),
          problemSummary:
            localPreset?.summary[lang] ||
            `${summaryIds.join(', ')}: ${pt.use[lang]} — ${pt.loc[lang]}`,
          spokenScript: spokenScripts[lang],
          spokenScripts,
          pressGuide: localPreset?.pressGuide[lang] || pt.how[lang],
          recommendedPointIds: summaryIds,
          primaryRegion: summaryIds.length > 3 ? 'body' : localPreset?.primaryRegion || 'body',
          recommendedYogaIds: localPreset?.yogaIds || ['deep_belly'],
        });
      }
      // Return clear error if key is missing while providing curated clinical match
      if (localPreset) {
        return res.json({
          source: 'clinical-knowledge',
          isEmergency: Boolean(localPreset.isEmergency),
          problemSummary: localPreset.summary[lang],
          spokenScript: localPreset.spokenScript[lang],
          spokenScripts: localPreset.spokenScript,
          pressGuide: localPreset.pressGuide[lang],
          recommendedPointIds: localPreset.pointIds.slice(0, 3),
          primaryRegion: localPreset.primaryRegion,
          recommendedYogaIds: localPreset.yogaIds,
        });
      }
      if (localPts.length > 0) {
        const pt = localPts[0];
        const spokenScripts = {
          en: `${pt.id}, ${pt.n}. ${pt.loc.en} ${pt.how.en}`,
          hi: `${pt.id}, ${pt.n}. ${pt.loc.hi} ${pt.how.hi}`,
          mr: `${pt.id} बिंदू. ${pt.loc.mr} ${pt.how.mr}`,
        };
        return res.json({
          source: 'clinical-knowledge',
          isEmergency: Boolean(pt.emergency),
          problemSummary: `${pt.id} (${pt.n}): ${pt.use[lang]} — ${pt.loc[lang]}`,
          spokenScript: spokenScripts[lang],
          spokenScripts,
          pressGuide: pt.how[lang],
          recommendedPointIds: localPts.map((p) => p.id).slice(0, 3),
          primaryRegion: pt.regions.includes('hand')
            ? 'hand'
            : pt.regions.includes('leg')
            ? 'leg'
            : pt.regions.includes('shoulder')
            ? 'shoulder'
            : 'body',
          recommendedYogaIds: ['deep_belly'],
        });
      }
      return res.status(503).json({
        error: 'Gemini API key is not configured in Secrets, and no local preset matched your query.',
      });
    }

    try {
      const pointCatalogSummary = POINTS_3D.map(
        (p) => `${p.id}${p.aliases ? '/' + p.aliases.join('/') : ''} (${p.n}, regions: ${p.regions.join(',')}, uses: ${p.use.en})`
      ).join('\n');

      const prompt = `Patient message: "${query}"
Requested reply language: ${LANG_LABEL[lang]}.

Verified 3D acupressure points available in Veda AI:
${pointCatalogSummary}

Rules:
1. Interpret everyday / rural / misspelled Indian terms & clinical aliases accurately (e.g., "dinates"/"sugar" -> diabetes: SP10, ST36, SP6; "lagpain" -> leg pain: ST36, GB34, BL57; "UB11"/"UB12"/"UB10"/"UB21"/"UB23"/"UB54"/"UB62" -> BL11/BL12/BL10/BL21/BL23/BL54/BL62; "LIV8" -> LV8; "K3" -> KI3; "heart attack"/"chest pain" -> EMERGENCY with PC6, HT7, CV17; knee ligament/cartilage/water -> ST36 CW, SP10/SP9/ST35/GB34/BL54 ACW, LV8/KI3 CW; slip disc / L5-S1 gap / pinched nerve -> BL23 CW, GV3/BL54/GB34/GV14 ACW; sciatica -> BL62/GB30/BL54 ACW; spondylitis/spondylosis/stiff neck -> GB20/BL21/SI3 ACW, GB14/BL10 CW; vertigo -> LU7 CW, GB20/TW10 ACW).
2. ${
        multiRequest
          ? `The patient asked for multiple points or comprehensive relief. Return ALL relevant matching acupressure point IDs strictly from the catalog (${VALID_3D_IDS.join(', ')}), ordered with the TOP instant-relief points first.`
          : `Choose ONLY the TOP 2 to 3 most effective points for INSTANT RELIEF strictly from the Verified 3D acupressure points list above (${VALID_3D_IDS.join(', ')}), ordered #1 fastest-relief point first.`
      }
3. Choose primaryRegion from: "body", "hand", "leg", "shoulder" (pick "body" whenever >3 points span different areas, "hand" if hand/headache/cough/heart-emergency finger points are primary, "leg" if knee/leg/diabetes points are primary, "shoulder" if shoulder/neck/UB11-UB12 bone points are primary, otherwise "body").
4. Write problemSummary and pressGuide in ${LANG_LABEL[lang]}. Lead clearly with the Top Instant-Relief Points (#1, #2, #3), explicitly stating the exact pressing duration (e.g. 30–60 sec for finger emergencies, 1–2 min for limb/back/head points) and pressure force level (Very Light, Gentle, Moderate-Firm, Firm, or Deep-Firm), plus Clockwise / Anticlockwise pressing rotation where helpful for knee, spine, slip disc, sciatica, spondylitis, spondylosis, or vertigo relief.
5. Also fill spokenScripts with 2–4 natural spoken sentences (no markdown, no symbols, no English brackets) for ALL THREE languages so the patient can switch Talk-Back voice anytime:
   - spokenScripts.en: simple everyday English
   - spokenScripts.hi: सरल बोलचाल की हिंदी (Devanagari)
   - spokenScripts.mr: शुद्ध पण सोपी महाराष्ट्रातील बोलचालची मराठी (Devanagari only for Marathi text; use natural Marathi verbs like 'दाबा', 'करा', 'घ्या', 'आहे', never Hindi words like 'करें', 'दबाएं', 'है', 'दर्द')
6. Set isEmergency=true for heart attack, severe chest pain, stroke, unconsciousness, or severe breathing crisis, and put calling 108/112 ambulance first in problemSummary and all spokenScripts.
7. Choose 1–2 yogaIds from: ["deep_belly","anulom_vilom","bhramari","box_calm","mandukasana","vajrasana","quad_stretch","ankle_pumps","cat_cow","cobra_pose","neck_rolls","wrist_stretch","shavasana"].`;

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            systemInstruction:
              'You are Veda AI, an accurate, compassionate acupressure and wellness educator in India. Always prioritize patient safety and anatomical accuracy.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isEmergency: { type: Type.BOOLEAN },
                problemSummary: { type: Type.STRING },
                spokenScripts: {
                  type: Type.OBJECT,
                  properties: {
                    en: { type: Type.STRING },
                    hi: { type: Type.STRING },
                    mr: { type: Type.STRING },
                  },
                  required: ['en', 'hi', 'mr'],
                },
                pressGuide: { type: Type.STRING },
                recommendedPointIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                primaryRegion: { type: Type.STRING },
                recommendedYogaIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'isEmergency',
                'problemSummary',
                'spokenScripts',
                'pressGuide',
                'recommendedPointIds',
                'primaryRegion',
                'recommendedYogaIds',
              ],
            },
          },
        })
      );

      const parsed = JSON.parse((response.text ?? '{}').trim());
      const sanitizedIds = (Array.isArray(parsed.recommendedPointIds) ? parsed.recommendedPointIds : [])
        .map((id: string) =>
          String(id)
            .toUpperCase()
            .replace(/^UB/, 'BL')
            .replace(/^LIV/, 'LV')
            .replace(/^K(\d+)/, 'KI$1')
        )
        .filter((id: string) => VALID_3D_IDS.includes(id));

      const mergedMulti = Array.from(
        new Set([...sanitizedIds, ...allMatchedPts.map((p) => p.id)])
      );
      const finalIds = multiRequest
        ? mergedMulti.length > 0
          ? mergedMulti
          : ['LI4', 'ST36', 'SP6']
        : sanitizedIds.length > 0
        ? sanitizedIds.slice(0, 3)
        : (localPreset?.pointIds || (localPts.length ? localPts.map((p) => p.id) : ['LI4', 'ST36'])).slice(0, 3);

      const validRegion =
        finalIds.length > 3
          ? 'body'
          : ['body', 'hand', 'leg', 'shoulder'].includes(parsed.primaryRegion)
          ? parsed.primaryRegion
          : localPreset?.primaryRegion || 'body';

      const fallbackFirstPt = POINTS_3D.find((p) => p.id === finalIds[0]);
      const spokenScripts = {
        en:
          parsed.spokenScripts?.en ||
          localPreset?.spokenScript.en ||
          (fallbackFirstPt ? `${fallbackFirstPt.id}, ${fallbackFirstPt.n}. ${fallbackFirstPt.loc.en} ${fallbackFirstPt.how.en}` : ''),
        hi:
          parsed.spokenScripts?.hi ||
          localPreset?.spokenScript.hi ||
          (fallbackFirstPt ? `${fallbackFirstPt.id}, ${fallbackFirstPt.n}. ${fallbackFirstPt.loc.hi} ${fallbackFirstPt.how.hi}` : ''),
        mr:
          parsed.spokenScripts?.mr ||
          localPreset?.spokenScript.mr ||
          (fallbackFirstPt ? `${fallbackFirstPt.id} बिंदू. ${fallbackFirstPt.loc.mr} ${fallbackFirstPt.how.mr}` : ''),
      };

      return res.json({
        source: 'gemini-ai',
        isEmergency: Boolean(parsed.isEmergency || localPreset?.isEmergency),
        problemSummary: parsed.problemSummary || localPreset?.summary[lang] || '',
        spokenScript: spokenScripts[lang],
        spokenScripts,
        pressGuide: parsed.pressGuide || localPreset?.pressGuide[lang] || '',
        recommendedPointIds: finalIds,
        primaryRegion: validRegion,
        recommendedYogaIds:
          Array.isArray(parsed.recommendedYogaIds) && parsed.recommendedYogaIds.length
            ? parsed.recommendedYogaIds
            : localPreset?.yogaIds || ['deep_belly'],
      });
    } catch (err: unknown) {
      console.error('Gemini /api/analyze error:', err);
      // Propagate meaningful error if no clinical fallback exists; otherwise return error info clearly
      const message = err instanceof Error ? err.message : 'Failed to analyze concern with Gemini AI.';
      return res.status(502).json({ error: message });
    }
  });

  // 2. Multilingual Voice Talk-Back TTS (English, Hindi, Marathi)
  app.post('/api/tts', async (req, res) => {
    const text = String(req.body?.text || '').trim();
    const lang: Lang = ['en', 'hi', 'mr'].includes(req.body?.language) ? req.body.language : 'en';

    if (!text) {
      return res.status(400).json({ error: 'Text is required for speech generation.' });
    }

    const cacheKey = `${lang}:${text}`;
    const cached = ttsCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const ai = getAiClient('v1beta');
    if (!ai) {
      const phoneticText = lang === 'mr' ? formatMarathiSpeechText(text) : text;
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured.',
        spokenText: text,
        phoneticText,
      });
    }

    let textToSpeak = text;
    let speechInput = lang === 'mr' ? formatMarathiSpeechText(textToSpeak) : textToSpeak;

    try {
      // Ensure Marathi (or Hindi) Talk-Back translates English or cross-language Devanagari (e.g. Hindi -> Marathi)
      // into pure, natural, spoken Maharashtra Marathi (or Hindi) before phonetic speech formatting.
      const hasDevanagari = /[\u0900-\u097F]/.test(text);
      const shouldTranslate =
        (lang === 'mr' && needsMarathiTranslation(text)) ||
        (lang === 'hi' && !hasDevanagari);

      if (shouldTranslate) {
        const textAi = getAiClient();
        if (textAi) {
          const translatePrompt =
            lang === 'mr'
              ? `Convert this acupressure guidance into natural, idiomatic, spoken Maharashtra Marathi (मराठी, Devanagari script — NOT Hindi). Use natural everyday Marathi words (like दाबा, करा, घ्या, आहे, दुखणे, गुडघा, कंबर, मान, बोटे) and keep acupoint IDs like ST36, SP10, BL23, LV8, GB20, LU7, PC6 clearly. Return ONLY plain spoken Marathi sentences without markdown, bullets, or quotes:\n\n${text}`
              : `Translate this acupressure wellness guidance into natural, simple spoken Hindi (हिन्दी, Devanagari script). Keep point IDs like LI4, ST36, SP10, PC6 clear. Return only the translated spoken text without quotes or markdown:\n\n${text}`;
          try {
            const tr = await withRetry(() =>
              textAi.models.generateContent({
                model: 'gemini-4-hydrogen',
                contents: translatePrompt,
                config: { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } },
              })
            );
            const translated = (tr.text ?? '').trim();
            if (translated) textToSpeak = translated;
          } catch {
            try {
              const trLite = await textAi.models.generateContent({
                model: 'gemini-3.1-flash-lite',
                contents: translatePrompt,
              });
              const translated = (trLite.text ?? '').trim();
              if (translated) textToSpeak = translated;
            } catch {
              // Keep original text if both translation calls fail
            }
          }
        }
      }

      // Convert acupoint codes, numbers, and symbols to phonetic Marathi Devanagari so the voice never stumbles
      speechInput = lang === 'mr' ? formatMarathiSpeechText(textToSpeak) : textToSpeak;

      const styleMap: Record<Lang, string> = {
        en: 'Speak warmly and clearly in simple everyday Indian English as a caring health guide.',
        hi: 'Speak clearly and warmly in natural everyday Indian Hindi (Devanagari, standard Hindi pronunciation, not Marathi), at a calm, unhurried pace.',
        mr: 'A warm, calm native Marathi wellness educator from Pune, Maharashtra. Speak strictly in authentic Marathi pronunciation (standard Maharashtra Marathi, NEVER a Hindi accent), articulating ळ, ण, अनुस्वार, च/ज/झ, and Marathi word endings clearly at a gentle, reassuring pace.',
      };

      const ttsModels =
        lang === 'mr'
          ? (['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'] as const)
          : (['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts'] as const);

      const synthesizeWithModel = async (ttsModel: string) =>
        ai.models.generateContent({
          model: ttsModel,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: speechInput,
                  speechMetadata: {
                    style: styleMap[lang],
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: lang === 'mr' ? 'Kore' : 'Kore' },
              },
            },
          },
        });

      let response;
      let lastTtsErr: unknown;
      for (const m of ttsModels) {
        try {
          response = await withRetry(() => synthesizeWithModel(m));
          if (response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) break;
        } catch (err) {
          lastTtsErr = err;
        }
      }
      if (!response) throw lastTtsErr ?? new Error('TTS synthesis failed.');

      const part = response.candidates?.[0]?.content?.parts?.[0];
      const base64Audio = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType || 'audio/wav';

      if (!base64Audio) {
        return res.status(502).json({
          error: 'No audio returned by TTS model.',
          spokenText: textToSpeak,
          phoneticText: speechInput,
        });
      }

      const payload = { audioBase64: base64Audio, mimeType, spokenText: textToSpeak, phoneticText: speechInput };
      if (ttsCache.size >= 50) {
        const oldestKey = ttsCache.keys().next().value;
        if (oldestKey) ttsCache.delete(oldestKey);
      }
      ttsCache.set(cacheKey, payload);
      return res.json(payload);
    } catch (err: unknown) {
      console.error('Gemini /api/tts error:', err);
      const message = err instanceof Error ? err.message : 'TTS generation failed.';
      return res.status(502).json({
        error: message,
        spokenText: textToSpeak,
        phoneticText: speechInput,
      });
    }
  });

  // 3. Multilingual Audio Transcription (English, Hindi, Marathi)
  app.post('/api/transcribe', async (req, res) => {
    const audioBase64 = String(req.body?.audioBase64 || '');
    const mimeType = String(req.body?.mimeType || 'audio/webm');
    const lang: Lang = ['en', 'hi', 'mr'].includes(req.body?.language) ? req.body.language : 'en';

    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured for server audio transcription.' });
    }

    try {
      const langHint =
        lang === 'mr'
          ? 'The speaker is speaking Marathi (मराठी, Maharashtra dialect). Transcribe accurately in Marathi Devanagari script, preserving ळ, ण, अनुस्वार, and acupoint terms clearly without adding commentary.'
          : lang === 'hi'
          ? 'The speaker is likely speaking Hindi (or English/Marathi). Transcribe accurately in Devanagari script without adding commentary.'
          : 'Transcribe this health concern accurately. If spoken in Hindi or Marathi, transcribe clearly.';

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-3.5-transcribe',
          contents: {
            parts: [
              { inlineData: { mimeType, data: audioBase64 } },
              { text: langHint },
            ],
          },
        })
      );

      return res.json({ text: (response.text ?? '').trim() });
    } catch (err: unknown) {
      console.error('Gemini /api/transcribe error:', err);
      const message = err instanceof Error ? err.message : 'Audio transcription failed.';
      return res.status(502).json({ error: message });
    }
  });

  // 4. Acupressure Chat Assistant
  app.post('/api/chat', async (req, res) => {
    const message = String(req.body?.message || '').trim();
    const lang: Lang = ['en', 'hi', 'mr'].includes(req.body?.language) ? req.body.language : 'en';
    const mode = req.body?.mode === 'Quick lookup' ? 'Quick lookup' : 'Educator';

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    try {
      const normInput = message
        .toUpperCase()
        .replace(/\bUB\s*(\d+)/g, 'BL$1')
        .replace(/\bLIV\s*(\d+)/g, 'LV$1')
        .replace(/\bK\s*3\b/g, 'KI3');
      const atlasHint = ATLAS.filter((a) => normInput.includes(a.id))
        .slice(0, 6)
        .map((a) => `${a.id} (${a.n}): ${a.t}${a.c ? ' | Uses: ' + a.c : ''}`)
        .join('\n');

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: `${atlasHint ? 'Atlas context:\n' + atlasHint + '\n\n' : ''}Available 3D Point IDs: ${VALID_3D_IDS.join(', ')}\nUser question: ${message}`,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            systemInstruction: `You are Veda AI, an acupressure & wellness educator. Reply in ${LANG_LABEL[lang]}.
IMPORTANT: Whenever the user asks about any point or symptom, list and explain the TOP 2–3 points for INSTANT RELIEF first (including their exact IDs like LI4, ST36, SP10, PC6, BL11/UB11, LV8, GV3, GB30, BL62, LU7, TW10), exact location, Clockwise/Anticlockwise pressing direction if relevant, and quick 60-second thumb pressure tip. Mode: ${
              mode === 'Quick lookup'
                ? 'Concise bulleted list of the Top 2-3 instant-relief points in 2-3 short lines.'
                : 'Clear list of Top 2-3 instant-relief points with simple location, quick pressure technique, and safety note.'
            } For chest pain / heart attack symptoms, always put calling 108/112 first.`,
          },
        })
      );

      const replyText = (response.text ?? '').trim();
      const normCombined = `${message} ${replyText}`
        .toUpperCase()
        .replace(/\bUB\s*(\d+)/g, 'BL$1')
        .replace(/\bLIV\s*(\d+)/g, 'LV$1')
        .replace(/\bK\s*3\b/g, 'KI3');
      const mentionedIds = VALID_3D_IDS.filter((id) => new RegExp(`\\b${id}\\b`).test(normCombined));
      const allMatched = findAllPointsForRequest(message);
      const multiRequest = isMultiPointQuery(message);
      const matchedFallback = findPointsLocal(message).map((p) => p.id);
      const mergedAllIds = Array.from(new Set([...mentionedIds, ...allMatched.map((p) => p.id)]));
      const topPointIds = multiRequest
        ? mergedAllIds.length > 0
          ? mergedAllIds
          : matchedFallback
        : (mentionedIds.length > 0 ? mentionedIds : matchedFallback).slice(0, 3);

      return res.json({ reply: replyText, topPointIds });
    } catch (err: unknown) {
      console.error('Gemini /api/chat error:', err);
      const errMsg = err instanceof Error ? err.message : 'Chat failed.';
      return res.status(502).json({ error: errMsg });
    }
  });

  // Vite dev middleware or production static build
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Veda AI server running at http://localhost:${PORT}`);
  });
}

startServer();
