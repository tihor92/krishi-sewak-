import React, { useState } from 'react';
import { OFFICIAL_MSP_BENCHMARKS } from '../data/mockData';
import { 
  ShieldCheck, 
  TrendingUp, 
  Scale, 
  Calculator, 
  ArrowUpRight, 
  CheckCircle2, 
  Search,
  Info,
  Award
} from 'lucide-react';

export const MspExplorerView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('ALL');

  // Calculator state
  const [calcCrop, setCalcCrop] = useState(OFFICIAL_MSP_BENCHMARKS[0].cropName);
  const [calcQuintals, setCalcQuintals] = useState<number>(100);
  const [calcMoisture, setCalcMoisture] = useState<number>(10.5);

  const filteredBenchmarks = OFFICIAL_MSP_BENCHMARKS.filter(item => {
    const matchesSearch = item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeason = selectedSeason === 'ALL' || item.season === selectedSeason;
    return matchesSearch && matchesSeason;
  });

  const activeBenchmark = OFFICIAL_MSP_BENCHMARKS.find(b => b.cropName === calcCrop) || OFFICIAL_MSP_BENCHMARKS[0];
  const baselineRevenue = activeBenchmark.mspPrice * calcQuintals;
  const qualityBonusMultiplier = calcMoisture <= 10.5 ? 1.08 : calcMoisture <= 12 ? 1.03 : 1.0;
  const recommendedFairRevenue = Math.round(baselineRevenue * qualityBonusMultiplier);
  const costOfProductionTotal = activeBenchmark.costOfProductionA2FL * calcQuintals;
  const estimatedNetProfit = recommendedFairRevenue - costOfProductionTotal;

  return (
    <div className="space-y-8">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800/60 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/50 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>GOVERNMENT OF INDIA STATUTORY MSP BENCHMARKS (CACP 2025-2026)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
            Fair Price Guarantee & Mandi Intelligence
          </h1>

          <p className="text-sm text-stone-300 leading-relaxed">
            Minimum Support Price (MSP) is the statutory floor price set by the Government of India below which agricultural crops cannot be procured. Krishi Sewak hard-codes these benchmarks directly into all marketplace contracts, preventing trader collusion and distress distress selling.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% CACP Formula Baseline (A2+FL + 50% Profit)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Real-time Mandi Rate Comparison
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Direct Agmark Quality Premium
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Fair Payout Calculator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Interactive Fair Crop Revenue Calculator (किसान आमदनी कैलकुलेटर)
            </h2>
            <p className="text-xs text-stone-500">Calculate guaranteed statutory minimum payout & quality-adjusted fair price</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Inputs Column */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Select Crop</label>
              <select
                value={calcCrop}
                onChange={(e) => setCalcCrop(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
              >
                {OFFICIAL_MSP_BENCHMARKS.map((item, idx) => (
                  <option key={idx} value={item.cropName}>
                    {item.cropName} (MSP: ₹{item.mspPrice})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Harvest Lot (Quintals)</label>
              <div className="relative">
                <input 
                  type="number"
                  min={1}
                  value={calcQuintals}
                  onChange={(e) => setCalcQuintals(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm font-bold"
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-400">Qtl</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Grain Moisture (%)</label>
              <div className="relative">
                <input 
                  type="number"
                  step="0.1"
                  min="5"
                  max="20"
                  value={calcMoisture}
                  onChange={(e) => setCalcMoisture(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm font-bold"
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-400">%</span>
              </div>
            </div>

            {/* Benchmark Details Pill */}
            <div className="sm:col-span-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
              <span>Statutory MSP Baseline: <strong className="text-stone-900">₹{activeBenchmark.mspPrice}/qtl</strong></span>
              <span>Cost of Production (A2+FL): <strong className="text-stone-900">₹{activeBenchmark.costOfProductionA2FL}/qtl</strong></span>
              <span>Govt Return over Cost: <strong className="text-emerald-700">+{activeBenchmark.marginPercent}%</strong></span>
              <span>Current Mandi Avg: <strong className="text-stone-900">₹{activeBenchmark.nationalMandiAverage}/qtl</strong></span>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl p-5 border border-emerald-700 shadow-inner space-y-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">Recommended Fair Payout</span>
              <div className="text-3xl font-black text-amber-300">
                ₹{recommendedFairRevenue.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                For {calcQuintals} Qtl of {activeBenchmark.cropName.split(' ')[0]}
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-emerald-700/60 text-xs">
              <div className="flex justify-between">
                <span className="text-emerald-300">Statutory MSP Floor:</span>
                <span className="font-bold">₹{baselineRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300">Quality & Moisture Bonus:</span>
                <span className="font-bold text-amber-300">+₹{(recommendedFairRevenue - baselineRevenue).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300">Estimated Net Farmer Profit:</span>
                <span className="font-bold text-emerald-400">+₹{estimatedNetProfit.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Benchmarks Explorer Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input 
              type="text"
              placeholder="Search crop, variety or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-stone-500 font-medium">Season:</span>
            {['ALL', 'Rabi', 'Kharif', 'Commercial'].map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedSeason === season
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {season}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 text-stone-600 uppercase text-[11px] font-bold border-b border-stone-200">
              <tr>
                <th className="py-4 px-6">Crop & Variety</th>
                <th className="py-4 px-4">Season</th>
                <th className="py-4 px-4">Govt MSP (2025-26)</th>
                <th className="py-4 px-4">Previous Year</th>
                <th className="py-4 px-4">Production Cost (A2+FL)</th>
                <th className="py-4 px-4">Farmer Margin</th>
                <th className="py-4 px-4">Mandi Average</th>
                <th className="py-4 px-6">Market Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
              {filteredBenchmarks.map((item, idx) => (
                <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-stone-900 text-sm">{item.cropName}</div>
                    <div className="text-xs text-stone-400">{item.variety}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold text-xs">
                      {item.season}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-base font-black text-emerald-900">
                      ₹{item.mspPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-stone-400 block">per quintal</span>
                  </td>
                  <td className="py-4 px-4 text-stone-500">
                    ₹{item.previousYearMsp.toLocaleString('en-IN')}
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      +{Math.round(((item.mspPrice - item.previousYearMsp) / item.previousYearMsp) * 100)}% hike
                    </span>
                  </td>
                  <td className="py-4 px-4 text-stone-600">
                    ₹{item.costOfProductionA2FL.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-extrabold text-emerald-700">
                      +{item.marginPercent}%
                    </span>
                    <span className="text-[10px] text-stone-400 block">over cost</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-stone-800">
                    ₹{item.nationalMandiAverage.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {item.marketTrend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
