import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  ChevronDown,
  ChevronUp,
  Sun,
} from 'lucide-react';
import { createIrlSkinTextures } from './irlBodyBuilder';
import { SURYANAMASKAR_STEPS } from '../data/yoga';
import type { Lang } from '../data/acupoints';

export type ExerciseProgramId =
  | 'suryanamaskar'
  | 'tadasana_flow'
  | 'utkatasana'
  | 'virabhadrasana_2'
  | 'bhujangasana_flow'
  | 'setu_bandhasana';

export interface ExercisePoseTarget {
  pelvisPosZ: number;
  pelvisRot: [number, number, number];
  lumbarRot: [number, number, number];
  thoraxRot: [number, number, number];
  neckRot: [number, number, number];
  shoulderL: [number, number, number];
  elbowL: [number, number, number];
  wristL: [number, number, number];
  shoulderR: [number, number, number];
  elbowR: [number, number, number];
  wristR: [number, number, number];
  hipL: [number, number, number];
  kneeL: [number, number, number];
  ankleL: [number, number, number];
  hipR: [number, number, number];
  kneeR: [number, number, number];
  ankleR: [number, number, number];
}

export interface ExerciseStepMeta {
  id: string;
  sanskrit: string;
  breath: 'Inhale' | 'Exhale' | 'Hold';
  durationSec: number;
  name: Record<Lang, string>;
  cue: Record<Lang, string>;
  pose: ExercisePoseTarget;
}

export interface ExerciseProgram {
  id: ExerciseProgramId;
  title: Record<Lang, string>;
  subtitle: Record<Lang, string>;
  steps: ExerciseStepMeta[];
}

// === KEYFRAME POSES (Right-handed Y-up, +Z forward, +X person's left) ===
const POSE_LIBRARY: Record<string, ExercisePoseTarget> = {
  tadasana: {
    pelvisPosZ: 0.0,
    pelvisRot: [0, 0, 0],
    lumbarRot: [0, 0, 0],
    thoraxRot: [0, 0, 0],
    neckRot: [0, 0, 0],
    shoulderL: [0.05, 0, 0.16],
    elbowL: [-0.14, 0, 0],
    wristL: [0, 0, -0.05],
    shoulderR: [0.05, 0, -0.16],
    elbowR: [-0.14, 0, 0],
    wristR: [0, 0, 0.05],
    hipL: [0, 0, 0.03],
    kneeL: [0.02, 0, 0],
    ankleL: [0, 0, 0],
    hipR: [0, 0, -0.03],
    kneeR: [0.02, 0, 0],
    ankleR: [0, 0, 0],
  },
  pranamasana: {
    pelvisPosZ: 0.48,
    pelvisRot: [0, 0, 0],
    lumbarRot: [0, 0, 0],
    thoraxRot: [0.02, 0, 0],
    neckRot: [0.04, 0, 0],
    shoulderL: [-0.42, 0.38, 0.22],
    elbowL: [-1.85, 0, -0.45],
    wristL: [0, 0, -0.30],
    shoulderR: [-0.42, -0.38, -0.22],
    elbowR: [-1.85, 0, 0.45],
    wristR: [0, 0, 0.30],
    hipL: [0, 0, 0.02],
    kneeL: [0.02, 0, 0],
    ankleL: [0, 0, 0],
    hipR: [0, 0, -0.02],
    kneeR: [0.02, 0, 0],
    ankleR: [0, 0, 0],
  },
  hasta_uttanasana: {
    pelvisPosZ: 0.48,
    pelvisRot: [-0.12, 0, 0],
    lumbarRot: [-0.22, 0, 0],
    thoraxRot: [-0.22, 0, 0],
    neckRot: [-0.18, 0, 0],
    shoulderL: [-2.86, 0, 0.08],
    elbowL: [-0.10, 0, 0],
    wristL: [0, 0, 0],
    shoulderR: [-2.86, 0, -0.08],
    elbowR: [-0.10, 0, 0],
    wristR: [0, 0, 0],
    hipL: [0.12, 0, 0.03],
    kneeL: [0.02, 0, 0],
    ankleL: [-0.02, 0, 0],
    hipR: [0.12, 0, -0.03],
    kneeR: [0.02, 0, 0],
    ankleR: [-0.02, 0, 0],
  },
  hastapadasana: {
    pelvisPosZ: 0.34,
    pelvisRot: [1.65, 0, 0],
    lumbarRot: [0.36, 0, 0],
    thoraxRot: [0.32, 0, 0],
    neckRot: [0.22, 0, 0],
    shoulderL: [-0.95, 0, 0.05],
    elbowL: [-0.08, 0, 0],
    wristL: [-0.2, 0, 0],
    shoulderR: [-0.95, 0, -0.05],
    elbowR: [-0.08, 0, 0],
    wristR: [-0.2, 0, 0],
    hipL: [-1.62, 0, 0.03],
    kneeL: [0.08, 0, 0],
    ankleL: [-0.08, 0, 0],
    hipR: [-1.62, 0, -0.03],
    kneeR: [0.08, 0, 0],
    ankleR: [-0.08, 0, 0],
  },
  ashwa_right: {
    pelvisPosZ: 0.08,
    pelvisRot: [0.42, 0, 0],
    lumbarRot: [-0.16, 0, 0],
    thoraxRot: [-0.18, 0, 0],
    neckRot: [-0.16, 0, 0],
    shoulderL: [-1.06, 0, 0.14],
    elbowL: [-0.08, 0, 0],
    wristL: [0.25, 0, 0],
    shoulderR: [-1.06, 0, -0.14],
    elbowR: [-0.08, 0, 0],
    wristR: [0.25, 0, 0],
    hipL: [-1.86, 0, 0.04],
    kneeL: [1.58, 0, 0],
    ankleL: [-0.14, 0, 0],
    hipR: [0.76, 0, -0.04],
    kneeR: [0.36, 0, 0],
    ankleR: [0.85, 0, 0],
  },
  ashwa_left: {
    pelvisPosZ: 0.08,
    pelvisRot: [0.42, 0, 0],
    lumbarRot: [-0.16, 0, 0],
    thoraxRot: [-0.18, 0, 0],
    neckRot: [-0.16, 0, 0],
    shoulderL: [-1.06, 0, 0.14],
    elbowL: [-0.08, 0, 0],
    wristL: [0.25, 0, 0],
    shoulderR: [-1.06, 0, -0.14],
    elbowR: [-0.08, 0, 0],
    wristR: [0.25, 0, 0],
    hipL: [0.76, 0, 0.04],
    kneeL: [0.36, 0, 0],
    ankleL: [0.85, 0, 0],
    hipR: [-1.86, 0, -0.04],
    kneeR: [1.58, 0, 0],
    ankleR: [-0.14, 0, 0],
  },
  dandasana: {
    pelvisPosZ: -0.18,
    pelvisRot: [1.34, 0, 0],
    lumbarRot: [0.02, 0, 0],
    thoraxRot: [0.02, 0, 0],
    neckRot: [-0.30, 0, 0],
    shoulderL: [-1.34, 0, 0.06],
    elbowL: [-0.06, 0, 0],
    wristL: [-1.32, 0, 0],
    shoulderR: [-1.34, 0, -0.06],
    elbowR: [-0.06, 0, 0],
    wristR: [-1.32, 0, 0],
    hipL: [0.02, 0, 0.03],
    kneeL: [0.04, 0, 0],
    ankleL: [1.10, 0, 0],
    hipR: [0.02, 0, -0.03],
    kneeR: [0.04, 0, 0],
    ankleR: [1.10, 0, 0],
  },
  ashtanga: {
    pelvisPosZ: -0.16,
    pelvisRot: [1.96, 0, 0],
    lumbarRot: [-0.42, 0, 0],
    thoraxRot: [-0.28, 0, 0],
    neckRot: [-0.52, 0, 0],
    shoulderL: [-0.55, 0, 0.16],
    elbowL: [-1.72, 0, 0],
    wristL: [-0.85, 0, 0],
    shoulderR: [-0.55, 0, -0.16],
    elbowR: [-1.72, 0, 0],
    wristR: [-0.85, 0, 0],
    hipL: [-0.94, 0, 0.03],
    kneeL: [1.38, 0, 0],
    ankleL: [0.98, 0, 0],
    hipR: [-0.94, 0, -0.03],
    kneeR: [1.38, 0, 0],
    ankleR: [0.98, 0, 0],
  },
  bhujangasana: {
    pelvisPosZ: -0.16,
    pelvisRot: [1.48, 0, 0],
    lumbarRot: [-0.44, 0, 0],
    thoraxRot: [-0.46, 0, 0],
    neckRot: [-0.30, 0, 0],
    shoulderL: [-0.55, 0, 0.12],
    elbowL: [-0.22, 0, 0],
    wristL: [-1.25, 0, 0],
    shoulderR: [-0.55, 0, -0.12],
    elbowR: [-0.22, 0, 0],
    wristR: [-1.25, 0, 0],
    hipL: [0.08, 0, 0.03],
    kneeL: [0.04, 0, 0],
    ankleL: [0.55, 0, 0],
    hipR: [0.08, 0, -0.03],
    kneeR: [0.04, 0, 0],
    ankleR: [0.55, 0, 0],
  },
  parvatasana: {
    pelvisPosZ: -0.10,
    pelvisRot: [2.35, 0, 0],
    lumbarRot: [0.06, 0, 0],
    thoraxRot: [0.05, 0, 0],
    neckRot: [0.10, 0, 0],
    shoulderL: [-2.96, 0, 0.07],
    elbowL: [-0.04, 0, 0],
    wristL: [-1.15, 0, 0],
    shoulderR: [-2.96, 0, -0.07],
    elbowR: [-0.04, 0, 0],
    wristR: [-1.15, 0, 0],
    hipL: [-1.62, 0, 0.04],
    kneeL: [0.05, 0, 0],
    ankleL: [-0.35, 0, 0],
    hipR: [-1.62, 0, -0.04],
    kneeR: [0.05, 0, 0],
    ankleR: [-0.35, 0, 0],
  },
  overhead_reach: {
    pelvisPosZ: 0.0,
    pelvisRot: [-0.03, 0, 0],
    lumbarRot: [-0.05, 0, 0],
    thoraxRot: [-0.06, 0, 0],
    neckRot: [-0.05, 0, 0],
    shoulderL: [-3.02, 0, 0.14],
    elbowL: [-0.08, 0, 0],
    wristL: [0, 0, 0],
    shoulderR: [-3.02, 0, -0.14],
    elbowR: [-0.08, 0, 0],
    wristR: [0, 0, 0],
    hipL: [0.03, 0, 0.03],
    kneeL: [0.02, 0, 0],
    ankleL: [0, 0, 0],
    hipR: [0.03, 0, -0.03],
    kneeR: [0.02, 0, 0],
    ankleR: [0, 0, 0],
  },
  arm_spread_t: {
    pelvisPosZ: 0.0,
    pelvisRot: [0, 0, 0],
    lumbarRot: [-0.06, 0, 0],
    thoraxRot: [-0.08, 0, 0],
    neckRot: [0, 0, 0],
    shoulderL: [0, 0, 1.54],
    elbowL: [-0.06, 0, 0],
    wristL: [0, 0, 0],
    shoulderR: [0, 0, -1.54],
    elbowR: [-0.06, 0, 0],
    wristR: [0, 0, 0],
    hipL: [0, 0, 0.03],
    kneeL: [0.02, 0, 0],
    ankleL: [0, 0, 0],
    hipR: [0, 0, -0.03],
    kneeR: [0.02, 0, 0],
    ankleR: [0, 0, 0],
  },
  utkatasana: {
    pelvisPosZ: -0.04,
    pelvisRot: [0.34, 0, 0],
    lumbarRot: [0.12, 0, 0],
    thoraxRot: [-0.14, 0, 0],
    neckRot: [-0.12, 0, 0],
    shoulderL: [-2.42, 0, 0.12],
    elbowL: [-0.08, 0, 0],
    wristL: [0, 0, 0],
    shoulderR: [-2.42, 0, -0.12],
    elbowR: [-0.08, 0, 0],
    wristR: [0, 0, 0],
    hipL: [-1.42, 0, 0.04],
    kneeL: [1.38, 0, 0],
    ankleL: [-0.30, 0, 0],
    hipR: [-1.42, 0, -0.04],
    kneeR: [1.38, 0, 0],
    ankleR: [-0.30, 0, 0],
  },
  warrior_ii_right: {
    pelvisPosZ: 0.0,
    pelvisRot: [0.04, -1.35, 0],
    lumbarRot: [0, 0.10, 0],
    thoraxRot: [0, 0.12, 0],
    neckRot: [0, 1.08, 0],
    shoulderL: [0, 0, 1.56],
    elbowL: [-0.04, 0, 0],
    wristL: [0, 0, 0],
    shoulderR: [0, 0, -1.56],
    elbowR: [-0.04, 0, 0],
    wristR: [0, 0, 0],
    hipL: [-0.62, 0, 0.68],
    kneeL: [0.08, 0, 0],
    ankleL: [0.04, 0, -0.45],
    hipR: [-0.88, -0.25, -0.78],
    kneeR: [1.18, 0, 0],
    ankleR: [-0.30, 0, 0.15],
  },
  warrior_ii_left: {
    pelvisPosZ: 0.0,
    pelvisRot: [0.04, 1.35, 0],
    lumbarRot: [0, -0.10, 0],
    thoraxRot: [0, -0.12, 0],
    neckRot: [0, -1.08, 0],
    shoulderL: [0, 0, 1.56],
    elbowL: [-0.04, 0, 0],
    wristL: [0, 0, 0],
    shoulderR: [0, 0, -1.56],
    elbowR: [-0.04, 0, 0],
    wristR: [0, 0, 0],
    hipL: [-0.88, 0.25, 0.78],
    kneeL: [1.18, 0, 0],
    ankleL: [-0.30, 0, -0.15],
    hipR: [-0.62, 0, -0.68],
    kneeR: [0.08, 0, 0],
    ankleR: [0.04, 0, 0.45],
  },
  prone_rest: {
    pelvisPosZ: -0.18,
    pelvisRot: [1.56, 0, 0],
    lumbarRot: [-0.04, 0, 0],
    thoraxRot: [-0.05, 0, 0],
    neckRot: [-0.15, 0, 0],
    shoulderL: [-0.32, 0, 0.22],
    elbowL: [-1.20, 0, 0],
    wristL: [-0.5, 0, 0],
    shoulderR: [-0.32, 0, -0.22],
    elbowR: [-1.20, 0, 0],
    wristR: [-0.5, 0, 0],
    hipL: [0.02, 0, 0.04],
    kneeL: [0.04, 0, 0],
    ankleL: [0.65, 0, 0],
    hipR: [0.02, 0, -0.04],
    kneeR: [0.04, 0, 0],
    ankleR: [0.65, 0, 0],
  },
  supine_prep: {
    pelvisPosZ: 0.08,
    pelvisRot: [-1.55, 0, 0],
    lumbarRot: [0.02, 0, 0],
    thoraxRot: [0.04, 0, 0],
    neckRot: [0.05, 0, 0],
    shoulderL: [0.06, 0, 0.22],
    elbowL: [-0.08, 0, 0],
    wristL: [0, 0, 0],
    shoulderR: [0.06, 0, -0.22],
    elbowR: [-0.08, 0, 0],
    wristR: [0, 0, 0],
    hipL: [-1.24, 0, 0.04],
    kneeL: [2.12, 0, 0],
    ankleL: [-0.78, 0, 0],
    hipR: [-1.24, 0, -0.04],
    kneeR: [2.12, 0, 0],
    ankleR: [-0.78, 0, 0],
  },
  bridge_lift: {
    pelvisPosZ: 0.06,
    pelvisRot: [-1.18, 0, 0],
    lumbarRot: [-0.18, 0, 0],
    thoraxRot: [-0.14, 0, 0],
    neckRot: [0.08, 0, 0],
    shoulderL: [-0.28, 0, 0.16],
    elbowL: [-0.06, 0, 0],
    wristL: [0, 0, 0],
    shoulderR: [-0.28, 0, -0.16],
    elbowR: [-0.06, 0, 0],
    wristR: [0, 0, 0],
    hipL: [-1.42, 0, 0.04],
    kneeL: [1.84, 0, 0],
    ankleL: [-0.42, 0, 0],
    hipR: [-1.42, 0, -0.04],
    kneeR: [1.84, 0, 0],
    ankleR: [-0.42, 0, 0],
  },
};

export const EXERCISE_PROGRAMS: ExerciseProgram[] = [
  {
    id: 'suryanamaskar',
    title: {
      en: 'Suryanamaskar (12-Pose Sun Salutation)',
      hi: 'सूर्य नमस्कार (12 आसन मॉडल)',
      mr: 'सूर्यनमस्कार (१२ आसनांचे 3D मॉडेल)',
    },
    subtitle: {
      en: 'Full-body sequence synchronizing breath with 12 classical postures',
      hi: 'सांस के तालमेल के साथ पूरे शरीर के 12 पारंपरिक आसन',
      mr: 'श्वासाच्या लयीसह संपूर्ण शरीरासाठी १२ पारंपरिक आसनांचा क्रम',
    },
    steps: SURYANAMASKAR_STEPS.map((s) => ({
      id: `sn_${s.step}`,
      sanskrit: `${s.step}. ${s.sanskrit}`,
      breath: s.breath,
      durationSec: 4,
      name: s.name,
      cue: s.cue,
      pose: POSE_LIBRARY[s.poseKey],
    })),
  },
  {
    id: 'utkatasana',
    title: {
      en: 'Utkatasana (Chair Knee & Quad Flow)',
      hi: 'उत्कटासन (घुटने व जांघ व्यायाम)',
      mr: 'उत्कटासन (गुडघे व मांडी बळकटी)',
    },
    subtitle: {
      en: 'Strengthens thighs & knees around ST36 and SP10 safely',
      hi: 'जांघ व घुटनों के जोड़ों को मजबूत करने का सरल क्रम',
      mr: 'गुडघ्यांचे सांधे आणि मांड्यांचे स्नायू मजबूत करण्यासाठी',
    },
    steps: [
      {
        id: 'ut_1',
        sanskrit: '1. Tadasana Prep',
        breath: 'Inhale',
        durationSec: 3,
        name: { en: 'Mountain Stance', hi: 'ताड़ासन तैयारी', mr: 'ताडासन प्रारंभ' },
        cue: {
          en: 'Stand evenly with feet hip-width apart and spine lengthened.',
          hi: 'पैरों को कंधे की चौड़ाई पर रखकर सीधे खड़े हों।',
          mr: 'दोन्ही पायांमध्ये खांद्यांएवढे अंतर ठेवून सरळ उभे रहा.',
        },
        pose: POSE_LIBRARY.tadasana,
      },
      {
        id: 'ut_2',
        sanskrit: '2. Hasta Raise',
        breath: 'Inhale',
        durationSec: 3,
        name: { en: 'Arms Overhead Lift', hi: 'हाथ ऊपर उठाएं', mr: 'दोन्ही हात वर न्या' },
        cue: {
          en: 'Inhale and sweep both arms upward alongside your ears.',
          hi: 'सांस लेते हुए दोनों हाथ कानों के पास ऊपर उठाएं।',
          mr: 'श्वास आत घेत दोन्ही हात कानांलगत वर न्या.',
        },
        pose: POSE_LIBRARY.overhead_reach,
      },
      {
        id: 'ut_3',
        sanskrit: '3. Utkatasana Hold',
        breath: 'Exhale',
        durationSec: 5,
        name: { en: 'Chair Squat Hold', hi: 'उत्कटासन स्थिति', mr: 'उत्कटासन स्थिर स्थिती' },
        cue: {
          en: 'Exhale, bend knees gently back over heels, and lift chest smoothly.',
          hi: 'सांस छोड़ते हुए कुर्सी की तरह घुटने मोड़ें और छाती सीधी रखें।',
          mr: 'श्वास सोडत खुर्चीवर बसल्याप्रमाणे गुडघे वाकवा व पाठ ताठ ठेवा.',
        },
        pose: POSE_LIBRARY.utkatasana,
      },
    ],
  },
  {
    id: 'virabhadrasana_2',
    title: {
      en: 'Virabhadrasana II (Warrior II Stamina)',
      hi: 'वीरभद्रासन II (स्टैमिना व कमर)',
      mr: 'वीरभद्रासन २ (ताकद व कंबर मोकळी करणे)',
    },
    subtitle: {
      en: 'Builds leg endurance, opens hips & boosts circulation',
      hi: 'पैरों की ताकत, कूल्हों का लचीलापन और रक्त संचार बढ़ाता है',
      mr: 'पायांची ताकद, कंबरेची लवचिकता आणि रक्ताभिसरण वाढवते',
    },
    steps: [
      {
        id: 'w2_1',
        sanskrit: '1. Center Open',
        breath: 'Inhale',
        durationSec: 3,
        name: { en: 'Chest & Arms Open', hi: 'छाती व हाथ फैलाएं', mr: 'छाती व हात मोकळे करा' },
        cue: {
          en: 'Stand upright and stretch both arms out comfortably at shoulder height.',
          hi: 'सीधे खड़े होकर दोनों हाथ कंधों की सीध में फैलाएं।',
          mr: 'सरळ उभे राहून दोन्ही हात खांद्यांच्या रेषेत लांब पसरवा.',
        },
        pose: POSE_LIBRARY.arm_spread_t,
      },
      {
        id: 'w2_2',
        sanskrit: '2. Warrior II (Right)',
        breath: 'Exhale',
        durationSec: 5,
        name: { en: 'Right Knee Warrior II', hi: 'दायां वीरभद्रासन', mr: 'उजवे वीरभद्रासन २' },
        cue: {
          en: 'Lunge smoothly onto your right knee while keeping back leg strong and chest centered.',
          hi: 'दायां घुटना आगे मोड़ें और पिछला पैर सीधा व मजबूत रखें।',
          mr: 'उजवा गुडघा समोर वाकवा आणि मागचा पाय सरळ व स्थिर ठेवा.',
        },
        pose: POSE_LIBRARY.warrior_ii_right,
      },
      {
        id: 'w2_3',
        sanskrit: '3. Warrior II (Left)',
        breath: 'Exhale',
        durationSec: 5,
        name: { en: 'Left Knee Warrior II', hi: 'बायां वीरभद्रासन', mr: 'डावे वीरभद्रासन २' },
        cue: {
          en: 'Switch sides smoothly, bending left knee over ankle and gazing over left hand.',
          hi: 'दूसरी ओर बायां घुटना मोड़ें और बाएं हाथ की ओर देखें।',
          mr: 'आता डावा गुडघा वाकवा आणि डाव्या हाताच्या दिशेने स्थिर पहा.',
        },
        pose: POSE_LIBRARY.warrior_ii_left,
      },
    ],
  },
  {
    id: 'bhujangasana_flow',
    title: {
      en: 'Bhujangasana (Cobra Back Relief)',
      hi: 'भुजंगासन (कमर व रीढ़ आराम)',
      mr: 'भुजंगासन (पाठ व कंबरदुखी निवारण)',
    },
    subtitle: {
      en: 'Gentle spinal extension and chest expansion flow',
      hi: 'रीढ़ की जकड़न खोलने और फेफड़ों को फैलाने का सरल अभ्यास',
      mr: 'पाठीच्या मणक्याची ताठरता कमी करून छाती मोकळी करण्यासाठी',
    },
    steps: [
      {
        id: 'bh_1',
        sanskrit: '1. Makarasana Prep',
        breath: 'Exhale',
        durationSec: 3,
        name: { en: 'Prone Relaxed Base', hi: 'पेट के बल तैयारी', mr: 'पोटावर शांत स्थिती' },
        cue: {
          en: 'Lie flat on your abdomen with palms beside lower chest and elbows tucked.',
          hi: 'पेट के बल लेटें और हथेलियां कंधों के नीचे रखें।',
          mr: 'पोटावर सरळ झोपा आणि तळहात खांद्यांखाली चटईवर ठेवा.',
        },
        pose: POSE_LIBRARY.prone_rest,
      },
      {
        id: 'bh_2',
        sanskrit: '2. Bhujangasana Arch',
        breath: 'Inhale',
        durationSec: 5,
        name: { en: 'Gentle Cobra Lift', hi: 'सरल भुजंगासन', mr: 'भुजंगासन वर उचलणे' },
        cue: {
          en: 'Inhale, press palms lightly, and lift chest forward and upward with relaxed shoulders.',
          hi: 'सांस लेते हुए छाती और सिर ऊपर उठाएं; कंधे ढीले रखें।',
          mr: 'श्वास घेत छाती व डोके हळुवार वर उचला; खांदे सैल ठेवा.',
        },
        pose: POSE_LIBRARY.bhujangasana,
      },
    ],
  },
  {
    id: 'setu_bandhasana',
    title: {
      en: 'Setu Bandhasana (Bridge Pose — Back & BP)',
      hi: 'सेतुबंधासन (कमर व बीपी शांति)',
      mr: 'सेतुबंधासन (कंबर व रक्तदाब संतुलन)',
    },
    subtitle: {
      en: 'Calms nervous tension while strengthening lower back and glutes',
      hi: 'तनाव और बीपी कम कर कमर की मांसपेशियों को मजबूत करता है',
      mr: 'तणाव व रक्तदाब शांत करून कंबरेचे स्नायू बळकट करते',
    },
    steps: [
      {
        id: 'sb_1',
        sanskrit: '1. Supine Knee Bent',
        breath: 'Exhale',
        durationSec: 3,
        name: { en: 'Supine Bridge Prep', hi: 'पीठ के बल तैयारी', mr: 'पाठीवर दुमडलेले गुडघे' },
        cue: {
          en: 'Rest comfortably on your back with knees bent and feet planted hip-width apart.',
          hi: 'पीठ के बल लेटकर घुटने मोड़ें और पैर जमीन पर टिकाएं।',
          mr: 'पाठीवर झोपून गुडघे दुमडा आणि दोन्ही पावले जमिनीवर स्थिर ठेवा.',
        },
        pose: POSE_LIBRARY.supine_prep,
      },
      {
        id: 'sb_2',
        sanskrit: '2. Setu Bandhasana Lift',
        breath: 'Inhale',
        durationSec: 5,
        name: { en: 'Bridge Pelvic Lift', hi: 'सेतुबंधासन उठाव', mr: 'सेतुबंधासन वर स्थिती' },
        cue: {
          en: 'Inhale and lift your hips evenly toward the sky while keeping neck calm.',
          hi: 'सांस लेते हुए कमर को ऊपर उठाएं और गर्दन सीधी व शांत रखें।',
          mr: 'श्वास आत घेत कंबर हळुवार वर उचला आणि मान स्थिर ठेवा.',
        },
        pose: POSE_LIBRARY.bridge_lift,
      },
    ],
  },
  {
    id: 'tadasana_flow',
    title: {
      en: 'Tadasana & Shoulder Opener',
      hi: 'ताड़ासन व कंधा खोलने का व्यायाम',
      mr: 'ताडासन व खांदे मोकळे करण्याचा व्यायाम',
    },
    subtitle: {
      en: 'Decompresses spine and releases neck & desk posture tension',
      hi: 'गर्दन, कंधे और रीढ़ की जकड़न दूर करने के लिए सरल प्रवाह',
      mr: 'मान, खांदे आणि पाठीचा ताठरपणा दूर करण्यासाठी सोपा सराव',
    },
    steps: [
      {
        id: 'td_1',
        sanskrit: '1. Samasthiti',
        breath: 'Exhale',
        durationSec: 3,
        name: { en: 'Aligned Mountain Pose', hi: 'समस्थिति ताड़ासन', mr: 'समस्थिती ताडासन' },
        cue: {
          en: 'Ground both feet evenly and drop shoulders softly down away from ears.',
          hi: 'दोनों पैरों पर समान संतुलन रखकर कंधे ढीले छोड़ें।',
          mr: 'दोन्ही पायांवर समान भार देऊन खांदे कानांपासून दूर सैल ठेवा.',
        },
        pose: POSE_LIBRARY.tadasana,
      },
      {
        id: 'td_2',
        sanskrit: '2. Shoulder Open',
        breath: 'Inhale',
        durationSec: 3,
        name: { en: 'Chest & Shoulder Expand', hi: 'कंधे व छाती विस्तार', mr: 'खांदे व छाती विस्तार' },
        cue: {
          en: 'Inhale arms out wide at shoulder height, gently squeezing shoulder blades back.',
          hi: 'सांस लेकर दोनों हाथ बगल में फैलाएं और कंधे पीछे की ओर खोलें।',
          mr: 'श्वास घेत दोन्ही हात बाजूला पसरवून खांदे मागील बाजूस मोकळे करा.',
        },
        pose: POSE_LIBRARY.arm_spread_t,
      },
      {
        id: 'td_3',
        sanskrit: '3. Urdhva Hastasana',
        breath: 'Inhale',
        durationSec: 4,
        name: { en: 'Overhead Spine Reach', hi: 'ऊर्ध्व हस्तासन', mr: 'ऊर्ध्व हस्तासन' },
        cue: {
          en: 'Lift arms overhead, lengthening ribcage cleanly upward.',
          hi: 'दोनों हाथ ऊपर ले जाकर रीढ़ को हल्का ऊपर खींचें।',
          mr: 'दोन्ही हात वर उचलून पाठीचा कणा हळुवार वर ताणा.',
        },
        pose: POSE_LIBRARY.overhead_reach,
      },
    ],
  },
];

// Detect Software WebGL (SwiftShader / llvmpipe) to pace CPU rendering cleanly without altering scene content
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

interface RigHandles {
  character: THREE.Group;
  pelvis: THREE.Group;
  lumbar: THREE.Group;
  thorax: THREE.Group;
  neck: THREE.Group;
  shoulderL: THREE.Group;
  elbowL: THREE.Group;
  wristL: THREE.Group;
  shoulderR: THREE.Group;
  elbowR: THREE.Group;
  wristR: THREE.Group;
  hipL: THREE.Group;
  kneeL: THREE.Group;
  ankleL: THREE.Group;
  hipR: THREE.Group;
  kneeR: THREE.Group;
  ankleR: THREE.Group;
  contacts: THREE.Object3D[];
}

function createYogaMatTextures(maxAnisotropy: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1b3146';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle woven non-slip mat grip grid
  for (let y = 0; y < 512; y += 6) {
    ctx.fillStyle = y % 12 === 0 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, y, 512, 2);
  }
  for (let x = 0; x < 512; x += 6) {
    ctx.fillStyle = x % 12 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.06)';
    ctx.fillRect(x, 0, 2, 512);
  }

  // Subtle center alignment guide line & lotus-ring border
  ctx.strokeStyle = 'rgba(130, 200, 235, 0.25)';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, 476, 476);
  ctx.beginPath();
  ctx.moveTo(256, 36);
  ctx.lineTo(256, 476);
  ctx.stroke();

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = maxAnisotropy;
  return map;
}

function buildArticulatedEcorcheRig(
  muscleMat: THREE.MeshPhysicalMaterial,
  creviceMat: THREE.MeshPhysicalMaterial,
  fasciaMat: THREE.MeshPhysicalMaterial
): RigHandles {
  const character = new THREE.Group();
  const contacts: THREE.Object3D[] = [];
  const addContact = (parent: THREE.Object3D, x: number, y: number, z: number) => {
    const loc = new THREE.Object3D();
    loc.position.set(x, y, z);
    parent.add(loc);
    contacts.push(loc);
  };

  // Helper to sculpt tapered clay limb segment hanging down -Y
  const makeTaperLimb = (
    topR: number,
    botR: number,
    len: number,
    scaleX = 1.0,
    scaleZ = 1.0,
    mat: THREE.Material = muscleMat
  ) => {
    const grp = new THREE.Group();
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(topR, botR, len, 20, 4), mat);
    cyl.position.y = -len / 2;
    cyl.scale.set(scaleX, 1, scaleZ);
    cyl.castShadow = true;
    cyl.receiveShadow = true;
    grp.add(cyl);

    const topCap = new THREE.Mesh(new THREE.SphereGeometry(topR * 0.98, 16, 12), fasciaMat);
    topCap.scale.set(scaleX, 0.85, scaleZ);
    topCap.castShadow = true;
    grp.add(topCap);

    return grp;
  };

  // === PELVIS ROOT ===
  const pelvis = new THREE.Group();
  pelvis.position.set(0, 0.90, 0);
  character.add(pelvis);

  const pelvisCore = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.14, 10, 18), muscleMat);
  pelvisCore.rotation.z = Math.PI / 2;
  pelvisCore.scale.set(1.0, 1.0, 0.86);
  pelvisCore.castShadow = true;
  pelvisCore.receiveShadow = true;
  pelvis.add(pelvisCore);

  // Iliac fascia belt & glute definition
  for (const sx of [-1, 1] as const) {
    const glute = new THREE.Mesh(new THREE.SphereGeometry(0.088, 16, 14), muscleMat);
    glute.position.set(0.068 * sx, -0.015, -0.055);
    glute.scale.set(1.0, 1.15, 0.92);
    glute.castShadow = true;
    pelvis.add(glute);
  }
  addContact(pelvis, 0, -0.095, -0.05);
  addContact(pelvis, 0, 0, -0.105); // supine back contact

  // === LUMBAR / ABDOMEN (6-pack + Linea Alba) ===
  const lumbar = new THREE.Group();
  lumbar.position.set(0, 0.06, 0);
  pelvis.add(lumbar);

  const abdomen = new THREE.Mesh(new THREE.CylinderGeometry(0.142, 0.132, 0.22, 24, 2), muscleMat);
  abdomen.position.y = 0.11;
  abdomen.scale.set(1.08, 1.0, 0.78);
  abdomen.castShadow = true;
  abdomen.receiveShadow = true;
  lumbar.add(abdomen);

  const lineaAlba = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.20, 0.014), fasciaMat);
  lineaAlba.position.set(0, 0.11, 0.104);
  lumbar.add(lineaAlba);

  // Subtle sculpted rectus abdominis pods
  for (let row = 0; row < 3; row++) {
    for (const sx of [-1, 1] as const) {
      const abPod = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 10), muscleMat);
      abPod.position.set(0.040 * sx, 0.05 + row * 0.058, 0.092);
      abPod.scale.set(1.05, 0.72, 0.55);
      lumbar.add(abPod);
    }
  }

  // === THORAX / CHEST / CLAVICLES ===
  const thorax = new THREE.Group();
  thorax.position.set(0, 0.21, 0);
  lumbar.add(thorax);

  const ribcage = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.142, 0.30, 26, 2), muscleMat);
  ribcage.position.y = 0.15;
  ribcage.scale.set(1.12, 1.0, 0.74);
  ribcage.castShadow = true;
  ribcage.receiveShadow = true;
  thorax.add(ribcage);

  // Pectoralis Major sculpted fan plates + sternum fascia
  const sternum = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.20, 0.018), fasciaMat);
  sternum.position.set(0, 0.18, 0.122);
  thorax.add(sternum);

  for (const sx of [-1, 1] as const) {
    const pec = new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 14), muscleMat);
    pec.position.set(0.078 * sx, 0.20, 0.088);
    pec.scale.set(1.08, 0.85, 0.56);
    pec.castShadow = true;
    thorax.add(pec);

    const clav = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 0.12, 6, 10), fasciaMat);
    clav.position.set(0.088 * sx, 0.292, 0.078);
    clav.rotation.z = (Math.PI / 2 - 0.14) * sx;
    thorax.add(clav);

    // Back scapula & trapezius
    const trap = new THREE.Mesh(new THREE.SphereGeometry(0.088, 14, 12), creviceMat);
    trap.position.set(0.072 * sx, 0.22, -0.082);
    trap.scale.set(1.0, 1.2, 0.52);
    thorax.add(trap);
  }
  addContact(thorax, 0, 0.19, 0.142); // chest contact for Ashtanga Namaskara
  addContact(thorax, 0, 0.22, -0.132); // upper back contact for supine/Bridge

  // === NECK & SCULPTED BALD ÉCORCHÉ HEAD ===
  const neck = new THREE.Group();
  neck.position.set(0, 0.31, 0);
  thorax.add(neck);

  const neckCol = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.058, 0.10, 16), muscleMat);
  neckCol.position.y = 0.045;
  neckCol.castShadow = true;
  neck.add(neckCol);

  // V-shaped SCM neck tendons
  for (const sx of [-1, 1] as const) {
    const scm = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.085, 6, 8), fasciaMat);
    scm.position.set(0.022 * sx, 0.045, 0.034);
    scm.rotation.z = -0.26 * sx;
    neck.add(scm);
  }

  const head = new THREE.Group();
  head.position.set(0, 0.095, 0.008);
  neck.add(head);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.098, 22, 18), fasciaMat);
  cranium.position.y = 0.085;
  cranium.scale.set(0.92, 1.16, 1.06);
  cranium.castShadow = true;
  cranium.receiveShadow = true;
  head.add(cranium);

  // Jaw & Masseter sculpted clay plane
  const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.068, 16, 12), muscleMat);
  jaw.position.set(0, 0.025, 0.032);
  jaw.scale.set(0.92, 1.05, 0.98);
  head.add(jaw);

  // Nose ridge & brow arch
  const brow = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.016, 0.032), fasciaMat);
  brow.position.set(0, 0.102, 0.088);
  head.add(brow);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.046, 10), fasciaMat);
  nose.position.set(0, 0.072, 0.104);
  nose.rotation.x = 0.35;
  head.add(nose);

  addContact(head, 0, -0.025, 0.062); // chin contact for Ashtanga Namaskara
  addContact(head, 0, 0.095, -0.108); // back of head for supine Bridge

  // === LEFT & RIGHT ARTICULATED ARMS ===
  const buildArm = (sx: 1 | -1) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(0.205 * sx, 0.275, 0);
    thorax.add(shoulder);

    // Striated teardrop deltoid cap
    const deltoid = new THREE.Mesh(new THREE.SphereGeometry(0.066, 16, 14), muscleMat);
    deltoid.position.set(0.01 * sx, -0.025, 0);
    deltoid.scale.set(0.95, 1.32, 0.96);
    deltoid.castShadow = true;
    shoulder.add(deltoid);

    const upperArm = makeTaperLimb(0.056, 0.044, 0.27, 0.96, 1.04, muscleMat);
    shoulder.add(upperArm);

    const elbow = new THREE.Group();
    elbow.position.set(0, -0.27, 0);
    shoulder.add(elbow);

    const forearm = makeTaperLimb(0.045, 0.031, 0.25, 1.0, 0.88, muscleMat);
    elbow.add(forearm);

    // Pale wrist tendon cuff
    const wrist = new THREE.Group();
    wrist.position.set(0, -0.25, 0);
    elbow.add(wrist);

    const wristTendon = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.028, 0.032, 14), fasciaMat);
    wristTendon.position.y = -0.012;
    wristTendon.scale.set(1.05, 1, 0.7);
    wrist.add(wristTendon);

    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.095, 0.022), fasciaMat);
    palm.position.set(0, -0.068, 0.005);
    palm.castShadow = true;
    wrist.add(palm);

    const fingers = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.062, 0.018), fasciaMat);
    fingers.position.set(0, -0.142, 0.005);
    fingers.castShadow = true;
    wrist.add(fingers);

    addContact(wrist, 0, -0.028, 0.015); // heel of palm
    addContact(wrist, 0, -0.165, 0.015); // fingertips

    return { shoulder, elbow, wrist };
  };

  const armL = buildArm(1);
  const armR = buildArm(-1);

  // === LEFT & RIGHT ARTICULATED LEGS ===
  const buildLeg = (sx: 1 | -1) => {
    const hip = new THREE.Group();
    hip.position.set(0.098 * sx, -0.045, 0);
    pelvis.add(hip);

    const thigh = makeTaperLimb(0.088, 0.060, 0.41, 0.96, 1.05, muscleMat);
    hip.add(thigh);

    // Subtle IT-band / Quad fascia strip on outer thigh
    const itBand = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.34, 0.036), fasciaMat);
    itBand.position.set(0.068 * sx, -0.20, 0.01);
    hip.add(itBand);

    const knee = new THREE.Group();
    knee.position.set(0, -0.41, 0);
    hip.add(knee);

    // Sculpted Patella & Tendon
    const patella = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 10), fasciaMat);
    patella.position.set(0, 0.005, 0.048);
    patella.scale.set(0.95, 1.15, 0.65);
    knee.add(patella);

    addContact(knee, 0, -0.02, 0.058); // knee contact for Lunge / Ashtanga Namaskara

    const shin = makeTaperLimb(0.058, 0.038, 0.40, 0.94, 1.06, muscleMat);
    knee.add(shin);

    // Gastrocnemius calf muscle swell
    const calf = new THREE.Mesh(new THREE.SphereGeometry(0.054, 14, 12), muscleMat);
    calf.position.set(0, -0.135, -0.032);
    calf.scale.set(0.92, 1.85, 0.95);
    calf.castShadow = true;
    knee.add(calf);

    // Pale Achilles tendon down ankle back
    const achilles = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.17, 10), fasciaMat);
    achilles.position.set(0, -0.31, -0.032);
    knee.add(achilles);

    const ankle = new THREE.Group();
    ankle.position.set(0, -0.40, 0);
    knee.add(ankle);

    // Anatomical Foot (heel + forefoot + toes, sole at y = -0.048)
    const footBody = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.048, 0.195), fasciaMat);
    footBody.position.set(0, -0.024, 0.058);
    footBody.castShadow = true;
    footBody.receiveShadow = true;
    ankle.add(footBody);

    const toeCap = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), fasciaMat);
    toeCap.position.set(0, -0.030, 0.158);
    toeCap.scale.set(1.06, 0.56, 1.12);
    toeCap.castShadow = true;
    ankle.add(toeCap);

    addContact(ankle, 0, -0.048, -0.035); // heel bottom
    addContact(ankle, 0, -0.048, 0.185);  // toe ball bottom

    return { hip, knee, ankle };
  };

  const legL = buildLeg(1);
  const legR = buildLeg(-1);

  return {
    character,
    pelvis,
    lumbar,
    thorax,
    neck,
    shoulderL: armL.shoulder,
    elbowL: armL.elbow,
    wristL: armL.wrist,
    shoulderR: armR.shoulder,
    elbowR: armR.elbow,
    wristR: armR.wrist,
    hipL: legL.hip,
    kneeL: legL.knee,
    ankleL: legL.ankle,
    hipR: legR.hip,
    kneeR: legR.knee,
    ankleR: legR.ankle,
    contacts,
  };
}

interface Exercise3DViewerProps {
  lang: Lang;
  onSpeakCue?: (text: string, lang: Lang) => void;
  externalProgramId?: ExerciseProgramId | null;
}

export const Exercise3DViewer: React.FC<Exercise3DViewerProps> = ({
  lang,
  onSpeakCue,
  externalProgramId,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [programId, setProgramId] = useState<ExerciseProgramId>('suryanamaskar');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<0.75 | 1 | 1.35>(1);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const activeProgram =
    EXERCISE_PROGRAMS.find((p) => p.id === programId) || EXERCISE_PROGRAMS[0];
  const safeStepIdx = Math.min(stepIdx, activeProgram.steps.length - 1);
  const activeStep = activeProgram.steps[safeStepIdx];

  // Sync external program trigger (e.g. clicking "View in 3D" on an exercise card)
  useEffect(() => {
    if (externalProgramId) {
      setProgramId(externalProgramId);
      setStepIdx(0);
      setPlaying(true);
    }
  }, [externalProgramId]);

  const cameraGoalRef = useRef<{
    pos: THREE.Vector3;
    target: THREE.Vector3;
    active: boolean;
  }>({
    pos: new THREE.Vector3(2.35, 1.32, 2.05),
    target: new THREE.Vector3(0, 0.72, 0),
    active: false,
  });

  const poseRef = useRef<ExercisePoseTarget>(activeStep.pose);
  poseRef.current = activeStep.pose;

  // Auto-advance guided exercise flow timer
  useEffect(() => {
    if (!playing) return;
    const ms = Math.round((activeStep.durationSec * 1000) / speed);
    const id = window.setTimeout(() => {
      setStepIdx((prev) => (prev + 1) % activeProgram.steps.length);
    }, ms);
    return () => clearTimeout(id);
  }, [playing, safeStepIdx, activeProgram, speed]);

  // Mount Three.js WebGL scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 680;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#091028');
    scene.fog = new THREE.FogExp2('#091028', 0.052);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 40);
    camera.position.set(2.35, 1.32, 2.05);

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

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Warm/cool 3-point studio lighting
    const hemiLight = new THREE.HemisphereLight('#dce7fa', '#1e1b2c', 0.92);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#fff5ec', 1.82);
    keyLight.position.set(2.8, 4.6, 3.8);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -2.2;
    keyLight.shadow.camera.right = 2.2;
    keyLight.shadow.camera.top = 2.4;
    keyLight.shadow.camera.bottom = -2.0;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#bfd6f5', 0.78);
    fillLight.position.set(-3.6, 2.2, 2.6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#dce9ff', 0.88);
    rimLight.position.set(-1.5, 3.0, -4.0);
    scene.add(rimLight);

    // Studio Yoga Mat (top surface at y = 0.024) + Contact Shadow Grounding
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const matTex = createYogaMatTextures(maxAniso);
    const matGeo = new THREE.BoxGeometry(0.92, 0.024, 2.15);
    const matMaterial = new THREE.MeshStandardMaterial({
      map: matTex,
      roughness: 0.82,
      metalness: 0.04,
    });
    const yogaMat = new THREE.Mesh(matGeo, matMaterial);
    yogaMat.position.set(0, 0.012, 0);
    yogaMat.receiveShadow = true;
    scene.add(yogaMat);

    const floorDisc = new THREE.Mesh(
      new THREE.CircleGeometry(2.2, 48).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: '#030612', transparent: true, opacity: 0.55, depthWrite: false })
    );
    floorDisc.position.y = -0.012;
    scene.add(floorDisc);

    // Rose-Clay Anatomical Écorché Materials
    const { map: skinMap, bumpMap: muscleBump } = createIrlSkinTextures(maxAniso);

    const muscleMat = new THREE.MeshPhysicalMaterial({
      color: '#da9587',
      map: skinMap,
      bumpMap: muscleBump,
      bumpScale: 0.0085,
      roughness: 0.56,
      metalness: 0.02,
      clearcoat: 0.04,
      clearcoatRoughness: 0.76,
      sheen: 0.28,
      sheenColor: new THREE.Color('#f7d8ce'),
    });

    const creviceMat = new THREE.MeshPhysicalMaterial({
      color: '#b6695d',
      map: skinMap,
      bumpMap: muscleBump,
      bumpScale: 0.008,
      roughness: 0.62,
      metalness: 0.02,
    });

    const fasciaMat = new THREE.MeshPhysicalMaterial({
      color: '#ecd1c8',
      map: skinMap,
      bumpMap: muscleBump,
      bumpScale: 0.004,
      roughness: 0.44,
      metalness: 0.02,
      clearcoat: 0.08,
    });

    const rig = buildArticulatedEcorcheRig(muscleMat, creviceMat, fasciaMat);
    scene.add(rig.character);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 1.4;
    controls.maxDistance = 6.2;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 0.72, 0);

    const onControlStart = () => {
      cameraGoalRef.current.active = false;
    };
    controls.addEventListener('start', onControlStart);

    const onResize = () => {
      const w = container.clientWidth || 680;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const _contactVec = new THREE.Vector3();
    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const dampEuler = (euler: THREE.Euler, target: [number, number, number], lambda: number, dt: number) => {
      euler.x = THREE.MathUtils.damp(euler.x, target[0], lambda, dt);
      euler.y = THREE.MathUtils.damp(euler.y, target[1], lambda, dt);
      euler.z = THREE.MathUtils.damp(euler.z, target[2], lambda, dt);
    };

    const MAT_TOP_Y = 0.024;

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

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();
      const targetPose = poseRef.current;
      const lambda = 5.2;

      // Subtle living breathing expansion on thorax
      rig.thorax.scale.set(1 + Math.sin(t * 1.4) * 0.010, 1, 1 + Math.sin(t * 1.4) * 0.018);

      // Smooth damped joint interpolation
      rig.pelvis.position.z = THREE.MathUtils.damp(rig.pelvis.position.z, targetPose.pelvisPosZ, lambda, dt);
      dampEuler(rig.pelvis.rotation, targetPose.pelvisRot, lambda, dt);
      dampEuler(rig.lumbar.rotation, targetPose.lumbarRot, lambda, dt);
      dampEuler(rig.thorax.rotation, targetPose.thoraxRot, lambda, dt);
      dampEuler(rig.neck.rotation, targetPose.neckRot, lambda, dt);
      dampEuler(rig.shoulderL.rotation, targetPose.shoulderL, lambda, dt);
      dampEuler(rig.elbowL.rotation, targetPose.elbowL, lambda, dt);
      dampEuler(rig.wristL.rotation, targetPose.wristL, lambda, dt);
      dampEuler(rig.shoulderR.rotation, targetPose.shoulderR, lambda, dt);
      dampEuler(rig.elbowR.rotation, targetPose.elbowR, lambda, dt);
      dampEuler(rig.wristR.rotation, targetPose.wristR, lambda, dt);
      dampEuler(rig.hipL.rotation, targetPose.hipL, lambda, dt);
      dampEuler(rig.kneeL.rotation, targetPose.kneeL, lambda, dt);
      dampEuler(rig.ankleL.rotation, targetPose.ankleL, lambda, dt);
      dampEuler(rig.hipR.rotation, targetPose.hipR, lambda, dt);
      dampEuler(rig.kneeR.rotation, targetPose.kneeR, lambda, dt);
      dampEuler(rig.ankleR.rotation, targetPose.ankleR, lambda, dt);

      // Auto-ground character flush onto yoga mat surface (zero floating, zero sinking!)
      rig.character.updateMatrixWorld(true);
      let minContactY = Infinity;
      for (let i = 0; i < rig.contacts.length; i++) {
        rig.contacts[i].getWorldPosition(_contactVec);
        if (_contactVec.y < minContactY) minContactY = _contactVec.y;
      }
      if (Number.isFinite(minContactY)) {
        rig.pelvis.position.y += MAT_TOP_Y - minContactY;
      }

      // Smooth camera transition
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

      controls.update();
      renderer.render(scene, camera);

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
      matTex.dispose();
      skinMap.dispose();
      muscleBump.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const setCameraView = (view: 'side' | 'iso' | 'front') => {
    if (view === 'side') {
      cameraGoalRef.current.pos.set(2.9, 1.05, 0.05);
      cameraGoalRef.current.target.set(0, 0.68, 0);
    } else if (view === 'front') {
      cameraGoalRef.current.pos.set(0.15, 1.25, 3.0);
      cameraGoalRef.current.target.set(0, 0.72, 0);
    } else {
      cameraGoalRef.current.pos.set(2.35, 1.32, 2.05);
      cameraGoalRef.current.target.set(0, 0.72, 0);
    }
    cameraGoalRef.current.active = true;
  };

  const breathColor =
    activeStep.breath === 'Inhale'
      ? 'text-sky-300'
      : activeStep.breath === 'Exhale'
      ? 'text-emerald-300'
      : 'text-amber-300';

  const breathLabel =
    lang === 'hi'
      ? activeStep.breath === 'Inhale'
        ? 'श्वास अंदर लें'
        : activeStep.breath === 'Exhale'
        ? 'श्वास बाहर छोड़ें'
        : 'श्वास रोकें'
      : lang === 'mr'
      ? activeStep.breath === 'Inhale'
        ? 'श्वास आत घ्या'
        : activeStep.breath === 'Exhale'
        ? 'श्वास बाहेर सोडा'
        : 'स्थिती स्थिर ठेवा'
      : activeStep.breath;

  return (
    <div className="glass-panel p-4 sm:p-5 space-y-3">
      {/* Program Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-300 shrink-0" />
          <div>
            <h2 className="text-base font-bold text-white leading-tight">
              {activeProgram.title[lang]}
            </h2>
            <p className="text-xs text-slate-300">{activeProgram.subtitle[lang]}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {EXERCISE_PROGRAMS.map((prog) => (
            <button
              key={prog.id}
              type="button"
              onClick={() => {
                setProgramId(prog.id);
                setStepIdx(0);
                setPlaying(true);
              }}
              className={`veda-chip whitespace-nowrap shrink-0 ${programId === prog.id ? 'on' : ''}`}
            >
              {prog.title[lang].split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Unobstructed 3D Viewport + Collapsible Bottom Dock */}
      <div className="relative h-[440px] sm:h-[490px] w-full rounded-2xl overflow-hidden border border-white/15 bg-[#091028]">
        <div ref={mountRef} className="w-full h-full" />

        {contextLost && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 text-sm text-slate-200 z-20">
            Restoring 3D exercise view…
          </div>
        )}

        {/* Minimal Top-Left Pose Spec Badge (never occludes center) */}
        <div className="pointer-events-none absolute top-3 left-3 z-10 max-w-sm rounded-xl bg-slate-950/80 border border-white/15 px-3.5 py-2.5 space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-white">{activeStep.sanskrit}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className={`font-semibold ${breathColor}`}>{breathLabel}</span>
          </div>
          <div className="text-sm font-semibold text-sky-100 leading-snug">
            {activeStep.name[lang]}
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {activeStep.cue[lang]}
          </p>
        </div>

        {/* Camera angle & Listen Cue top-right utility buttons */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {onSpeakCue && (
            <button
              type="button"
              onClick={() => onSpeakCue(`${activeStep.name[lang]}. ${activeStep.cue[lang]}`, lang)}
              className="veda-btn !py-1.5 !px-2.5 text-xs flex items-center gap-1.5 bg-slate-950/85"
            >
              <Volume2 className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline whitespace-nowrap">
                {lang === 'mr' ? 'ऐका' : lang === 'hi' ? 'सुनें' : 'Voice Cue'}
              </span>
            </button>
          )}
          <div className="flex items-center gap-1 rounded-xl bg-slate-950/85 border border-white/15 p-1">
            {(
              [
                ['iso', '3/4'],
                ['side', 'Side'],
                ['front', 'Front'],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setCameraView(k)}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-200 hover:bg-white/10 whitespace-nowrap"
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCameraView('iso')}
              title="Reset view"
              className="p-1 rounded-lg text-slate-300 hover:bg-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Collapse / Expand Dock Toggle */}
        <button
          type="button"
          onClick={() => setDockCollapsed((c) => !c)}
          className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-slate-950/85 border border-white/15 text-[11px] font-semibold text-slate-200 hover:bg-white/10 flex items-center gap-1 whitespace-nowrap"
        >
          {dockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {dockCollapsed ? 'Show Controls' : 'Hide Controls'}
        </button>

        {/* Unified Bottom Dock (Pose Steps + Play/Pause + Speed) */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-[min(92%,820px)] rounded-2xl bg-slate-950/88 border border-white/15 px-3 py-2.5 transition-transform duration-200 ${
            dockCollapsed ? 'translate-y-28 pointer-events-none opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          {/* Pose Step Selector Strip */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 border-b border-white/10">
            {activeProgram.steps.map((st, idx) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setStepIdx(idx);
                  setPlaying(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  idx === safeStepIdx
                    ? 'bg-sky-500 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {activeProgram.steps.length > 5 ? `${idx + 1}. ${st.sanskrit.replace(/^\d+\.\s*/, '')}` : st.sanskrit}
              </button>
            ))}
          </div>

          {/* Playback Row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setStepIdx((prev) => (prev - 1 + activeProgram.steps.length) % activeProgram.steps.length);
                }}
                aria-label="Previous Pose"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className={`veda-btn !py-1.5 !px-3.5 text-xs flex items-center gap-1.5 whitespace-nowrap ${
                  playing ? 'veda-btn-danger' : 'veda-btn-green'
                }`}
              >
                {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {playing ? 'Pause Flow' : 'Play Flow'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setStepIdx((prev) => (prev + 1) % activeProgram.steps.length);
                }}
                aria-label="Next Pose"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tabular-nums text-slate-300">
                Pose {safeStepIdx + 1} / {activeProgram.steps.length}
              </span>
              <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                {([0.75, 1, 1.35] as const).map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setSpeed(sp)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono tabular-nums ${
                      speed === sp ? 'bg-sky-500 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {sp}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
