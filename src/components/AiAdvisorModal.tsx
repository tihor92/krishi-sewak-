import React, { useState } from 'react';
import { OFFICIAL_MSP_BENCHMARKS } from '../data/mockData';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle,
  Lightbulb,
  Award,
  ArrowRight
} from 'lucide-react';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [selectedCrop, setSelectedCrop] = useState(OFFICIAL_MSP_BENCHMARKS[0].cropName);
  const [variety, setVariety] = useState('Sharbati Premium C-306');
  const [qualityGrade, setQualityGrade] = useState('Grade A+ (Export Quality)');
  const [moisture, setMoisture] = useState<number>(10.2);
  const [state, setState] = useState('Madhya Pradesh');
  const [quantity, setQuantity] = useState<number>(50);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/ai/fair-price-adviser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: selectedCrop,
          variety,
          qualityGrade,
          moisturePercent: moisture,
          state,
          quantityQuintals: quantity
        })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error('Advisor query failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col my-auto relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Krishi AI Price & Quality Advisor</h2>
              <p className="text-xs text-stone-500">CACP statutory MSP formula + Gemini AI market intelligence</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Form Controls */}
          <div className="space-y-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Crop Type</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-900"
                >
                  {OFFICIAL_MSP_BENCHMARKS.map((item, idx) => (
                    <option key={idx} value={item.cropName}>
                      {item.cropName} (MSP: ₹{item.mspPrice}/qtl)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Variety Name</label>
                <input 
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Moisture Level (%)</label>
                <input 
                  type="number"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">State / Region</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900"
                >
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isLoading ? 'Consulting Gemini AI Market Engine...' : 'Calculate Fair Asking Price & Market Strategy'}</span>
            </button>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              {/* Highlight Price Box */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">AI Recommended Fair Selling Price</span>
                  <div className="text-3xl font-black text-emerald-950 mt-1">
                    ₹{result.recommendedPricePerQuintal.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-stone-500 ml-1">/ Quintal</span>
                  </div>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                    +{Math.round(((result.recommendedPricePerQuintal - result.officialMsp) / result.officialMsp) * 100)}% above statutory MSP (₹{result.officialMsp}/qtl)
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-500">Procurement Confidence:</span>
                  <div className="text-xl font-black text-amber-800">
                    {result.buyerConfidenceScore}% High
                  </div>
                  <span className="text-[10px] text-stone-400">Based on wholesale mill demand</span>
                </div>
              </div>

              {/* Premium Value Drivers */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Why Your Crop Commands This Premium:</span>
                </h4>
                <div className="space-y-1.5 text-xs text-stone-700">
                  {result.premiumFactors?.map((factor: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 bg-stone-50 p-2 rounded-lg border border-stone-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Quality Tip */}
              {result.qualityTip && (
                <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Agronomist Storage & Curing Advice:</strong>
                    <p className="text-amber-900 mt-0.5">{result.qualityTip}</p>
                  </div>
                </div>
              )}

              {/* Comparison Notice */}
              <div className="text-center text-[11px] text-stone-500 pt-1">
                {result.mandiComparisonText}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
