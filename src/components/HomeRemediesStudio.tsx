import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Coffee,
  Droplets,
  Flame,
  Gauge,
  HeartPulse,
  Leaf,
  Search,
  Sparkles,
  Volume2,
  Wind,
  Box,
} from 'lucide-react';
import {
  POINTS_3D,
  getPointPressSpec,
  type Lang,
  type Point3D,
  type Region3D,
} from '../data/acupoints';
import {
  REMEDY_CATEGORY_LABELS,
  getPointHomeRemedy,
  type RemedyCategory,
} from '../data/remedies';

interface HomeRemediesStudioProps {
  lang: Lang;
  onLangChange: (l: Lang) => void;
  selectedPoint: Point3D;
  onSelectPoint: (p: Point3D) => void;
  recommendedPointIds?: string[] | null;
  onSpeakCue?: (text: string, lang: Lang) => void;
  onShowIn3D: (p: Point3D) => void;
  onOpenYoga?: () => void;
}

const STUDIO_COPY: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCat: string;
    allRegions: string;
    featuredHeading: string;
    recommendedStrip: string;
    ingredientsLabel: string;
    stepsLabel: string;
    cautionLabel: string;
    pressDurationLabel: string;
    pressureUsedLabel: string;
    listenBtn: string;
    view3dBtn: string;
    yogaBtn: string;
    allGridHeading: string;
    emptyMsg: string;
  }
> = {
  en: {
    title: 'Instant Home Remedies & Acupressure Pairing',
    subtitle: 'Safe kitchen & household remedies paired with pressing duration and pressure for every acupoint',
    searchPlaceholder: 'Search point (ST36, LI4, UB11), symptom (knee, headache, cough), or ingredient (ginger, turmeric, sesame)…',
    allCat: 'All Remedies',
    allRegions: 'All Regions',
    featuredHeading: 'Featured Remedy + Acupressure Combo',
    recommendedStrip: 'Recommended for Your Current Concern:',
    ingredientsLabel: 'Kitchen Ingredients',
    stepsLabel: 'Instant Home Preparation & Pairing',
    cautionLabel: 'Safety Caution',
    pressDurationLabel: 'Press Duration',
    pressureUsedLabel: 'Pressure Used',
    listenBtn: 'Listen Remedy',
    view3dBtn: 'Show on 3D Body',
    yogaBtn: 'Pair Yoga',
    allGridHeading: 'All Acupressure Point Home Remedies',
    emptyMsg: 'No remedies match your filter. Try clearing the search or choosing All Remedies.',
  },
  hi: {
    title: 'तुरंत घरेलू उपचार और एक्यूप्रेशर जोड़ी',
    subtitle: 'सभी एक्यूप्रेशर बिंदुओं के साथ रसोई के सुरक्षित घरेलू उपाय, समय और दबाव मार्गदर्शन',
    searchPlaceholder: 'बिंदु (ST36, LI4), समस्या (घुटना, सिरदर्द, खांसी) या सामग्री (अदरक, हल्दी, तिल) खोजें…',
    allCat: 'सभी उपाय',
    allRegions: 'सभी अंग',
    featuredHeading: 'चयनित बिंदु का घरेलू उपचार और दबाव विधि',
    recommendedStrip: 'आपकी समस्या के लिए प्रमुख अनुशंसित बिंदु:',
    ingredientsLabel: 'आवश्यक घरेलू सामग्री',
    stepsLabel: 'तैयारी और एक्यूप्रेशर के साथ उपयोग',
    cautionLabel: 'सावधानी',
    pressDurationLabel: 'दबाने की अवधि',
    pressureUsedLabel: 'दबाव की मात्रा',
    listenBtn: 'उपाय सुनें',
    view3dBtn: '3D शरीर पर देखें',
    yogaBtn: 'योग करें',
    allGridHeading: 'सभी एक्यूप्रेशर बिंदुओं के घरेलू उपाय',
    emptyMsg: 'कोई उपाय नहीं मिला। कृपया खोज साफ करें या सभी उपाय चुनें।',
  },
  mr: {
    title: 'झटपट घरगुती उपाय आणि अ‍ॅक्युप्रेशर जोड',
    subtitle: 'प्रत्येक अ‍ॅक्युप्रेशर बिंदूसाठी सुरक्षित घरगुती उपाय, वेळ आणि दाबाची अचूक माहिती',
    searchPlaceholder: 'बिंदू (ST36, LI4), त्रास (गुडघा, डोकेदुखी, खोकला) किंवा साहित्य (आले, हळद, तीळ) शोधा…',
    allCat: 'सर्व उपाय',
    allRegions: 'सर्व भाग',
    featuredHeading: 'निवडलेल्या बिंदूचा घरगुती उपाय आणि दाब पद्धत',
    recommendedStrip: 'तुमच्या त्रासासाठी सुचवलेले प्रमुख बिंदू:',
    ingredientsLabel: 'घरगुती साहित्य',
    stepsLabel: 'कृती आणि अ‍ॅक्युप्रेशरसोबत वापर',
    cautionLabel: 'काळजी व सावधानता',
    pressDurationLabel: 'दाबण्याचा कालावधी',
    pressureUsedLabel: 'दाबाची तीव्रता',
    listenBtn: 'उपाय ऐका',
    view3dBtn: '3D शरीरावर पहा',
    yogaBtn: 'योग जोडा',
    allGridHeading: 'सर्व अ‍ॅक्युप्रेशर बिंदूंचे घरगुती उपाय',
    emptyMsg: 'कोणताही उपाय सापडला नाही. कृपया शोध बदला किंवा सर्व उपाय निवडा.',
  },
};

function CategoryIcon({ category, className }: { category: RemedyCategory; className?: string }) {
  switch (category) {
    case 'drink':
      return <Coffee className={className} />;
    case 'compress':
      return <Flame className={className} />;
    case 'steam':
      return <Wind className={className} />;
    case 'balm':
      return <Droplets className={className} />;
    case 'diet':
      return <Leaf className={className} />;
    case 'emergency':
      return <HeartPulse className={className} />;
  }
}

export const HomeRemediesStudio: React.FC<HomeRemediesStudioProps> = ({
  lang,
  onLangChange,
  selectedPoint,
  onSelectPoint,
  recommendedPointIds,
  onSpeakCue,
  onShowIn3D,
  onOpenYoga,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<RemedyCategory | 'all'>('all');
  const [regionFilter, setRegionFilter] = useState<Region3D | 'all'>('all');

  const copy = STUDIO_COPY[lang];
  const activeRemedy = getPointHomeRemedy(selectedPoint);
  const activeSpec = getPointPressSpec(selectedPoint);

  const recommendedPoints = useMemo(() => {
    if (!recommendedPointIds || recommendedPointIds.length === 0) return [];
    return recommendedPointIds
      .map((id) => POINTS_3D.find((p) => p.id === id))
      .filter((p): p is Point3D => Boolean(p));
  }, [recommendedPointIds]);

  const filteredPoints = useMemo(() => {
    const q = search.trim().toLowerCase().replace(/\bub(\d+)/g, 'bl$1');
    return POINTS_3D.filter((pt) => {
      const rem = getPointHomeRemedy(pt);
      if (categoryFilter !== 'all' && rem.category !== categoryFilter) return false;
      if (regionFilter !== 'all' && !pt.regions.includes(regionFilter)) return false;
      if (!q) return true;
      const haystack = [
        pt.id,
        ...(pt.aliases || []),
        pt.n,
        pt.m,
        pt.use[lang],
        pt.use.en,
        ...pt.keywords,
        rem.title[lang],
        rem.title.en,
        rem.steps[lang],
        rem.steps.en,
        ...rem.ingredients[lang],
        ...rem.ingredients.en,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [search, categoryFilter, regionFilter, lang]);

  const buildRemedySpeechText = (pt: Point3D) => {
    const rem = getPointHomeRemedy(pt);
    const spec = getPointPressSpec(pt);
    if (lang === 'mr') {
      return `${pt.id} बिंदूसाठी झटपट घरगुती उपाय: ${rem.title.mr}. ${rem.steps.mr} अ‍ॅक्युप्रेशर कालावधी ${spec.duration.mr}, दाब ${spec.pressureLabel.mr}. काळजी: ${rem.caution.mr}`;
    }
    if (lang === 'hi') {
      return `${pt.id} बिंदु के लिए तुरंत घरेलू उपाय: ${rem.title.hi}। ${rem.steps.hi} दबाने का समय ${spec.duration.hi} और दबाव ${spec.pressureLabel.hi}। सावधानी: ${rem.caution.hi}`;
    }
    return `Instant home remedy for ${pt.id}, ${pt.n}: ${rem.title.en}. ${rem.steps.en} Pair with pressing for ${spec.duration.en} using ${spec.pressureLabel.en}. Safety: ${rem.caution.en}`;
  };

  const categories: RemedyCategory[] = ['drink', 'compress', 'steam', 'balm', 'diet', 'emergency'];

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-300" />
              {copy.title}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">{copy.subtitle}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/10">
            {(['en', 'hi', 'mr'] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onLangChange(l)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  lang === l ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Points Quick Strip (when active diagnosis exists) */}
        {recommendedPoints.length > 0 && (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/30 p-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5 mr-1">
              <Sparkles className="w-3.5 h-3.5" />
              {copy.recommendedStrip}
            </span>
            {recommendedPoints.slice(0, 8).map((pt) => (
              <button
                key={pt.id}
                type="button"
                onClick={() => onSelectPoint(pt)}
                className={`veda-chip ${selectedPoint.id === pt.id ? 'on' : ''}`}
              >
                {pt.id} · {pt.n.split('(')[0].trim()}
              </button>
            ))}
          </div>
        )}

        {/* Featured Active Point Remedy + Pressing Spec Card */}
        <div className="rounded-2xl bg-black/35 border border-white/15 p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                {copy.featuredHeading}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-lg font-bold text-xs text-slate-950"
                  style={{ background: selectedPoint.c }}
                >
                  {selectedPoint.id}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">{activeRemedy.title[lang]}</h3>
              </div>
              <p className="text-xs text-slate-300">
                {selectedPoint.n} · {selectedPoint.use[lang]}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {onSpeakCue && (
                <button
                  type="button"
                  onClick={() => onSpeakCue(buildRemedySpeechText(selectedPoint), lang)}
                  className="veda-btn veda-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {copy.listenBtn}
                </button>
              )}
              <button
                type="button"
                onClick={() => onShowIn3D(selectedPoint)}
                className="veda-btn veda-btn-green text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Box className="w-3.5 h-3.5" />
                {copy.view3dBtn}
              </button>
              {onOpenYoga && (
                <button
                  type="button"
                  onClick={onOpenYoga}
                  className="veda-btn text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Wind className="w-3.5 h-3.5" />
                  {copy.yogaBtn}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Kitchen Ingredients & Prep Time */}
            <div className="lg:col-span-4 rounded-xl bg-white/5 border border-white/10 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CategoryIcon category={activeRemedy.category} className="w-3.5 h-3.5" />
                  {copy.ingredientsLabel}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  {REMEDY_CATEGORY_LABELS[activeRemedy.category][lang]} · {activeRemedy.prepTime[lang]}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-100">
                {activeRemedy.ingredients[lang].map((ing, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation + Acupressure Pairing Steps */}
            <div className="lg:col-span-5 rounded-xl bg-white/5 border border-white/10 p-3.5 space-y-2">
              <div className="text-xs font-bold text-sky-300">{copy.stepsLabel}</div>
              <p className="text-sm leading-relaxed text-slate-100">{activeRemedy.steps[lang]}</p>
              <div className="rounded-lg bg-amber-500/15 border border-amber-400/35 px-2.5 py-2 text-xs text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>
                  <b>{copy.cautionLabel}:</b> {activeRemedy.caution[lang]}
                </span>
              </div>
            </div>

            {/* Paired Acupoint Duration & Pressure */}
            <div className="lg:col-span-3 rounded-xl bg-white/5 border border-white/10 p-3.5 space-y-2.5">
              <div>
                <div className="text-[11px] font-bold text-sky-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {copy.pressDurationLabel}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">{activeSpec.duration[lang]}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5" />
                  {copy.pressureUsedLabel}
                </div>
                <div className="text-xs font-semibold text-white mt-0.5">{activeSpec.pressureLabel[lang]}</div>
                <div className="flex gap-1 mt-1" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <span
                      key={lvl}
                      className={`h-1.5 flex-1 rounded-full ${
                        lvl <= activeSpec.pressureLevel ? 'bg-amber-400' : 'bg-white/15'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">{selectedPoint.how[lang]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters + All 51 Remedies Grid */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-white">
            {copy.allGridHeading} ({filteredPoints.length}/{POINTS_3D.length})
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'body', 'hand', 'leg', 'shoulder'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegionFilter(r)}
                className={`veda-chip capitalize ${regionFilter === r ? 'on' : ''}`}
              >
                {r === 'all' ? copy.allRegions : r}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={copy.searchPlaceholder}
            className="veda-input w-full pl-10 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`veda-chip ${categoryFilter === 'all' ? 'on' : ''}`}
          >
            {copy.allCat} ({POINTS_3D.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`veda-chip flex items-center gap-1.5 ${categoryFilter === cat ? 'on' : ''}`}
            >
              <CategoryIcon category={cat} className="w-3 h-3" />
              {REMEDY_CATEGORY_LABELS[cat][lang]}
            </button>
          ))}
        </div>

        {filteredPoints.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-300">{copy.emptyMsg}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredPoints.map((pt) => {
              const rem = getPointHomeRemedy(pt);
              const spec = getPointPressSpec(pt);
              const isSelected = pt.id === selectedPoint.id;
              return (
                <div
                  key={pt.id}
                  onClick={() => onSelectPoint(pt)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPoint(pt);
                    }
                  }}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col gap-2.5 ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-400/60 shadow-lg'
                      : 'bg-black/25 border-white/15 hover:border-sky-400/40 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-md text-xs font-bold text-slate-950 shrink-0"
                      style={{ background: pt.c }}
                    >
                      {pt.id}
                    </span>
                    <b className="text-xs text-slate-200 truncate">{pt.n}</b>
                    <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-emerald-200 whitespace-nowrap">
                      {rem.prepTime[lang]}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white leading-snug flex items-start gap-1.5">
                    <CategoryIcon category={rem.category} className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                    <span>{rem.title[lang]}</span>
                  </div>

                  <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{rem.steps[lang]}</div>

                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {rem.ingredients[lang].slice(0, 3).map((ing, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-400/25 text-emerald-200"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="text-sky-200">⏱ {spec.duration[lang]}</span>
                    <span className="text-amber-200">✋ {spec.pressureLabel[lang]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
