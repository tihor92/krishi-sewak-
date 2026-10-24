import React from 'react';
import { OFFICIAL_MSP_BENCHMARKS } from '../data/mockData';
import { ShieldCheck, TrendingUp, Award } from 'lucide-react';

export const MspTicker: React.FC = () => {
  return (
    <div className="bg-emerald-950 text-white border-b border-emerald-800 text-xs sm:text-sm py-2 px-4 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Badge */}
        <div className="flex items-center gap-2 shrink-0 bg-emerald-800/80 px-2.5 py-1 rounded-full text-emerald-100 font-semibold text-xs border border-emerald-700">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>MSP GUARANTEED / न्यूनतम समर्थन मूल्य सुरक्षित</span>
        </div>

        {/* Scrolling Ticker Items */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5 text-stone-200 text-xs">
          {OFFICIAL_MSP_BENCHMARKS.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0 bg-emerald-900/40 px-3 py-1 rounded-md border border-emerald-800/60">
              <span className="font-semibold text-white">{item.cropName.split(' ')[0]}</span>
              <span className="text-amber-400 font-bold">₹{item.mspPrice.toLocaleString('en-IN')}/qtl</span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3 inline" />
                +{Math.round(((item.mspPrice - item.previousYearMsp) / item.previousYearMsp) * 100)}% YoY
              </span>
            </div>
          ))}
        </div>

        {/* Right Info */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 text-stone-300 text-xs">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Zero Below-MSP Exploitation Guarantee</span>
        </div>
      </div>
    </div>
  );
};
