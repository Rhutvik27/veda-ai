import React from 'react';
import { History, Trash2, RotateCw } from 'lucide-react';

export interface HistoryEntry {
  t: number;
  text: string;
  pts: string[];
}

interface HistoryTabProps {
  entries: HistoryEntry[];
  onClear: () => void;
  onLoadEntry: (entry: HistoryEntry) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ entries, onClear, onLoadEntry }) => {
  return (
    <div className="glass-panel p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-bold flex items-center gap-2">
          <History className="w-5 h-5 text-sky-300" />
          Patient Consultation History ({entries.length})
        </h2>
        {entries.length > 0 && (
          <button type="button" onClick={onClear} className="veda-btn flex items-center gap-1.5 text-xs">
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-sm text-slate-300 py-8 text-center">
          No analyses yet. Speak or type a health concern in Smart Assistant to start.
        </div>
      ) : (
        <div className="space-y-2.5">
          {entries.map((e, idx) => (
            <div
              key={`${e.t}-${idx}`}
              className="rounded-2xl bg-black/25 border border-white/15 p-3.5 flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <div className="font-semibold text-sm text-white">“{e.text}”</div>
                <div className="text-xs text-slate-300 mt-0.5 font-mono">
                  {new Date(e.t).toLocaleString()} · Points: {e.pts.join(', ')}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onLoadEntry(e)}
                className="veda-btn veda-btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" /> Load Again
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
