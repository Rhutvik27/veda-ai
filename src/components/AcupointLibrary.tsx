import React, { useState } from 'react';
import { BookOpen, Clock, Gauge, Search, X } from 'lucide-react';
import { ATLAS, MERIDIANS, MERIDIAN_ELEMENTS, MERIDIAN_NAMES, type AtlasPoint } from '../data/atlas';
import { POINTS_3D, getPointPressSpec, type Point3D } from '../data/acupoints';

interface AcupointLibraryProps {
  onShowIn3D: (p: Point3D) => void;
}

export const AcupointLibrary: React.FC<AcupointLibraryProps> = ({ onShowIn3D }) => {
  const [query, setQuery] = useState('');
  const [meridianFilter, setMeridianFilter] = useState('All');
  const [modalAtlas, setModalAtlas] = useState<AtlasPoint | null>(null);

  const normalizedQuery = query.toLowerCase().trim().replace(/\bub(\d+)/g, 'bl$1');

  const filtered = ATLAS.filter((a) => {
    if (meridianFilter !== 'All' && a.m !== meridianFilter) return false;
    if (!normalizedQuery) return true;
    const searchable = `${a.id} ${a.n} ${a.c || ''} ${a.t} ${MERIDIAN_NAMES[a.m] || ''}`.toLowerCase();
    return searchable.includes(normalizedQuery);
  });

  const matching3D = (id: string) => POINTS_3D.find((p) => p.id === id);

  return (
    <div className="glass-panel p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-300" />
          Acupoint Library (Complete Atlas)
        </h2>
        <span className="text-xs text-slate-300 font-mono">
          Showing {Math.min(filtered.length, 150)} of {filtered.length} points
        </span>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search point (e.g. ST36, SP10, UB11, PC6), meridian, or condition (diabetes, knee, bone, heart)…"
          className="veda-input w-full pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {['All', ...MERIDIANS].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMeridianFilter(m)}
            className={`veda-chip ${meridianFilter === m ? 'on' : ''}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[540px] overflow-y-auto pr-1">
        {filtered.slice(0, 150).map((a) => {
          const p3d = matching3D(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setModalAtlas(a)}
              className="text-left rounded-2xl p-4 bg-black/25 border border-white/15 hover:border-sky-400/50 hover:-translate-y-0.5 transition-all flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded-md text-xs font-bold text-slate-950"
                  style={{ background: p3d ? p3d.c : '#9fd0ff' }}
                >
                  {a.id}
                </span>
                <b className="text-sm text-white truncate">{a.n}</b>
                {p3d && <span className="ml-auto text-[11px] font-semibold text-emerald-300">3D ✓</span>}
              </div>
              <div className="text-xs text-slate-300">
                {MERIDIAN_NAMES[a.m]}
                {a.c ? ` · ${a.c}` : ''}
              </div>
              <p className="text-xs text-slate-200/90 line-clamp-3">{a.t}</p>
              {p3d && (() => {
                const spec = getPointPressSpec(p3d);
                return (
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-400/30 text-sky-200 font-medium">
                      <Clock className="w-2.5 h-2.5" />
                      {spec.duration.en}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-amber-200 font-medium">
                      <Gauge className="w-2.5 h-2.5" />
                      {spec.pressureLabel.en}
                    </span>
                  </div>
                );
              })()}
              {a.w && <div className="text-xs text-amber-300 mt-1">⚠ {a.w}</div>}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-sm text-slate-300 py-8 text-center">
            No acupoints match “{query}”. Try another point code or symptom.
          </div>
        )}
      </div>

      <div className="text-xs text-slate-400">
        Source: Atlas of Acupuncture Points, AcupunctureProducts.com © 2007. For education and wellness guidance only, not medical advice.
      </div>

      {modalAtlas && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalAtlas(null);
          }}
        >
          <div className="glass-panel max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold">
                {modalAtlas.id} · {modalAtlas.n}
              </h3>
              <button type="button" onClick={() => setModalAtlas(null)} className="veda-btn p-1.5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300">
              {MERIDIAN_NAMES[modalAtlas.m]} meridian
              {MERIDIAN_ELEMENTS[modalAtlas.m] ? ` · ${MERIDIAN_ELEMENTS[modalAtlas.m]} element` : ''}
            </div>
            <div>
              <div className="text-xs font-bold text-sky-300 mb-1">Anatomical Location</div>
              <div className="rounded-xl bg-black/30 p-3 text-sm text-slate-100">{modalAtlas.t}</div>
            </div>
            {modalAtlas.c && (
              <div>
                <div className="text-xs font-bold text-emerald-300 mb-1">Key Point For</div>
                <div className="rounded-xl bg-black/30 p-3 text-sm text-slate-100">{modalAtlas.c}</div>
              </div>
            )}
            {matching3D(modalAtlas.id) && (() => {
              const spec = getPointPressSpec(modalAtlas.id);
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-sky-500/10 border border-sky-400/25 p-3">
                    <div className="text-[11px] font-bold text-sky-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Pressing Duration
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">{spec.duration.en}</div>
                  </div>
                  <div className="rounded-xl bg-amber-500/10 border border-amber-400/25 p-3">
                    <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5" />
                      Pressure Used
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">{spec.pressureLabel.en}</div>
                    <div className="text-[11px] text-slate-300 mt-1">{spec.pressureDetail.en}</div>
                  </div>
                </div>
              );
            })()}
            {modalAtlas.w && (
              <div className="rounded-xl bg-amber-500/15 border border-amber-400/40 p-3 text-xs text-amber-200">
                <b>Safety Notice:</b> {modalAtlas.w}
              </div>
            )}
            {matching3D(modalAtlas.id) ? (
              <button
                type="button"
                onClick={() => {
                  const pt = matching3D(modalAtlas.id)!;
                  setModalAtlas(null);
                  onShowIn3D(pt);
                }}
                className="veda-btn veda-btn-primary w-full"
              >
                Show on 3D Muscular Model
              </button>
            ) : (
              <div className="text-xs text-slate-300">
                This point is documented in the Atlas reference library.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
