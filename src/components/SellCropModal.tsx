import React, { useState } from 'react';
import { OFFICIAL_MSP_BENCHMARKS } from '../data/mockData';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Droplet, 
  MapPin, 
  Scale, 
  Upload, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  Truck,
  Award
} from 'lucide-react';

interface SellCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCrop: any) => void;
}

export const SellCropModal: React.FC<SellCropModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const [cropName, setCropName] = useState('Wheat (गेहूं)');
  const [variety, setVariety] = useState('Sharbati Golden C-306');
  const [category, setCategory] = useState<'Cereals' | 'Pulses' | 'Oilseeds' | 'Cash Crops' | 'Spices'>('Cereals');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(50);
  const [minOrderQuintals, setMinOrderQuintals] = useState<number>(10);
  const [pricePerQuintal, setPricePerQuintal] = useState<number>(2850);
  const [qualityGrade, setQualityGrade] = useState('Grade A+ (Export Quality)');

  // Quality parameters
  const [moisturePercent, setMoisturePercent] = useState<number>(10.2);
  const [foreignMatterPercent, setForeignMatterPercent] = useState<number>(0.3);
  const [damagedGrainsPercent, setDamagedGrainsPercent] = useState<number>(0.4);
  const [specialMetric, setSpecialMetric] = useState<string>('Protein: 13.2%');

  // Location & logistics
  const [farmerName, setFarmerName] = useState('Rameshwar Patidar');
  const [farmerPhone, setFarmerPhone] = useState('+91 98261 44520');
  const [village, setVillage] = useState('Barkheda Hasan');
  const [district, setDistrict] = useState('Sehore');
  const [state, setState] = useState('Madhya Pradesh');
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState<number>(3);
  const [description, setDescription] = useState('Fresh harvested, machine graded, moisture strictly below 11%. Ready for immediate dispatch.');

  // AI Advisor state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find official MSP for selected crop
  const matchedMsp = OFFICIAL_MSP_BENCHMARKS.find(b => 
    b.cropName.toLowerCase().includes(cropName.split(' ')[0].toLowerCase())
  ) || OFFICIAL_MSP_BENCHMARKS[0];

  const officialMsp = matchedMsp.mspPrice;
  const isBelowMsp = pricePerQuintal < officialMsp;
  const premiumOverMsp = Math.round(((pricePerQuintal - officialMsp) / officialMsp) * 100);

  // Handle Crop Selection change
  const handleCropChange = (selectedCrop: string) => {
    setCropName(selectedCrop);
    const benchmark = OFFICIAL_MSP_BENCHMARKS.find(b => b.cropName === selectedCrop);
    if (benchmark) {
      setCategory(benchmark.category);
      // Auto-set asking price with healthy 15% fair margin above MSP
      setPricePerQuintal(Math.round(benchmark.mspPrice * 1.15));
      if (selectedCrop.includes('Mustard')) {
        setVariety('Pusa Bold Yellow');
        setSpecialMetric('Oil Recovery: 42.5%');
      } else if (selectedCrop.includes('Basmati')) {
        setVariety('1121 Pusa Basmati');
        setSpecialMetric('Grain Length: 8.4mm');
      } else if (selectedCrop.includes('Chana')) {
        setVariety('Dollar Kabuli Bold');
        setSpecialMetric('Protein: 22.0%');
      } else {
        setVariety('Standard Pure Variety');
        setSpecialMetric('Moisture Controlled');
      }
    }
  };

  // Call Gemini AI for fair price advice
  const fetchAiPriceAdvice = async () => {
    setIsAiLoading(true);
    setAiAdvice(null);
    try {
      const response = await fetch('/api/ai/fair-price-adviser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName,
          variety,
          qualityGrade,
          moisturePercent,
          state,
          quantityQuintals
        })
      });
      const data = await response.json();
      if (data.success) {
        setAiAdvice(data.data);
      }
    } catch (err) {
      console.error('Failed to get AI price recommendation:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyAiPrice = () => {
    if (aiAdvice?.recommendedPricePerQuintal) {
      setPricePerQuintal(aiAdvice.recommendedPricePerQuintal);
    }
  };

  // Submit Listing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${district} ${variety} ${cropName.split(' ')[0]}`,
          cropName,
          category,
          variety,
          quantityQuintals,
          minOrderQuintals,
          pricePerQuintal,
          officialMsp,
          qualityGrade,
          qualityParameters: {
            moisturePercent,
            foreignMatterPercent,
            damagedGrainsPercent,
            proteinPercent: 13.0
          },
          farmer: {
            name: farmerName,
            phone: farmerPhone,
            village,
            district,
            state
          },
          location: {
            village,
            district,
            state
          },
          estimatedDeliveryDays,
          description,
          images: [
            cropName.includes('Mustard') 
              ? 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80'
              : cropName.includes('Basmati')
              ? 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
              : cropName.includes('Chana')
              ? 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80'
          ]
        })
      });
      const data = await response.json();
      if (data.success) {
        onSuccess(data.data);
        onClose();
      }
    } catch (err) {
      console.error('Failed to submit crop:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col my-auto relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              🌾
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">List Your Crop for Fair Price / फसल बेचें</h2>
              <p className="text-xs text-stone-500">Zero middleman commission • Guaranteed MSP benchmark protection</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Section 1: Crop Selection & Variety */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">1. Crop Details & Category</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Select Crop (फसल)</label>
                <select
                  value={cropName}
                  onChange={(e) => handleCropChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {OFFICIAL_MSP_BENCHMARKS.map((item, idx) => (
                    <option key={idx} value={item.cropName}>
                      {item.cropName} (MSP: ₹{item.mspPrice}/qtl)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Variety (किस्म)</label>
                <input 
                  type="text"
                  required
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Sharbati C-306, Pusa 1121, JS-335"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Statutory MSP Benchmark Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <div>
                  <span className="text-xs font-semibold text-emerald-800">Govt Statutory MSP for {cropName.split(' ')[0]}:</span>
                  <div className="text-xl font-black text-emerald-950">
                    ₹{officialMsp.toLocaleString('en-IN')} <span className="text-xs font-normal text-stone-500">/ quintal</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-500">Season / Category:</span>
                <div className="text-sm font-bold text-stone-800">{matchedMsp.season} • {category}</div>
                <span className="text-[11px] text-emerald-700 font-semibold">CACP Fair Baseline Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Section 2: Fair Price & Quantity with AI Advisor */}
          <div className="space-y-4 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">2. Pricing & Quantity</h3>
              
              <button
                type="button"
                onClick={fetchAiPriceAdvice}
                disabled={isAiLoading}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>{isAiLoading ? 'Analyzing Mandi Rates...' : 'Get Krishi AI Price Advisory'}</span>
              </button>
            </div>

            {/* AI Advisor Recommendation Panel (when fetched) */}
            {aiAdvice && (
              <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-amber-950">Krishi AI Price Recommendation</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyAiPrice}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold"
                  >
                    Apply ₹{aiAdvice.recommendedPricePerQuintal}/qtl
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-stone-500">Recommended Fair Asking Price:</span>
                    <div className="text-xl font-black text-emerald-800">
                      ₹{aiAdvice.recommendedPricePerQuintal}/quintal
                    </div>
                    <span className="text-[11px] text-stone-500">
                      Minimum recommended: ₹{aiAdvice.minAcceptablePrice}/qtl
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col justify-center">
                    <span className="text-stone-500">Buyer Confidence Score:</span>
                    <div className="text-xl font-black text-amber-700">
                      {aiAdvice.buyerConfidenceScore}% High Demand
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium">{aiAdvice.mandiComparisonText}</span>
                  </div>
                </div>

                {aiAdvice.qualityTip && (
                  <div className="text-xs text-amber-900 bg-amber-100/60 p-2.5 rounded-xl flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong>Farmer Advisory Tip:</strong> {aiAdvice.qualityTip}</span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Asking Price (₹ per Quintal)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-500 font-bold">₹</span>
                  <input 
                    type="number"
                    required
                    value={pricePerQuintal}
                    onChange={(e) => setPricePerQuintal(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                {isBelowMsp ? (
                  <div className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 inline" />
                    Below MSP (₹{officialMsp})! Please raise price.
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 inline" />
                    +{premiumOverMsp}% over MSP (Fair Price Protected)
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Total Available Quantity (Quintals)
                </label>
                <input 
                  type="number"
                  required
                  min={1}
                  value={quantityQuintals}
                  onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Lot Value: <strong>₹{(pricePerQuintal * quantityQuintals).toLocaleString('en-IN')}</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Minimum Order Quantity (Quintals)
                </label>
                <input 
                  type="number"
                  required
                  min={1}
                  max={quantityQuintals}
                  value={minOrderQuintals}
                  onChange={(e) => setMinOrderQuintals(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">Min lot buyers can order</span>
              </div>
            </div>
          </div>

          {/* Section 3: Quality Parameters & Moisture */}
          <div className="space-y-4 pt-2 border-t border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">3. Quality Parameters & Grading</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Quality Grade
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-800"
                >
                  <option value="Grade A+ (Export Quality)">Grade A+ (Export Quality)</option>
                  <option value="Grade A (Agmark Premium)">Grade A (Agmark Premium)</option>
                  <option value="Certified Organic">Certified Organic</option>
                  <option value="Grade B (Standard Mandi)">Grade B (Standard Mandi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Moisture % (नमी)
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    step="0.1"
                    min="5"
                    max="20"
                    value={moisturePercent}
                    onChange={(e) => setMoisturePercent(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-stone-900"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-stone-500">%</span>
                </div>
                <span className="text-[10px] text-stone-500">Recommended: &lt;12% for safe transit</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Foreign Matter %
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={foreignMatterPercent}
                    onChange={(e) => setForeignMatterPercent(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-stone-900"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-stone-500">%</span>
                </div>
                <span className="text-[10px] text-stone-500">Dust & Chaff</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Damaged Grains %
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={damagedGrainsPercent}
                    onChange={(e) => setDamagedGrainsPercent(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-stone-900"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-stone-500">%</span>
                </div>
                <span className="text-[10px] text-stone-500">Broken / Discolored</span>
              </div>
            </div>
          </div>

          {/* Section 4: Farm Location & Logistics */}
          <div className="space-y-4 pt-2 border-t border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">4. Farm Gate Location & Delivery</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Village / Gram</label>
                <input 
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">District (जिला)</label>
                <input 
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">State (राज्य)</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 font-semibold"
                >
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Crop Lot Description & Storage Notes</label>
              <textarea 
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-sm hover:bg-stone-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-700/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Crop Lot to Krishi Sewak'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
