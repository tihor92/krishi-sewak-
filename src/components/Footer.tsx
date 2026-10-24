import React from 'react';
import { 
  Sprout, 
  ShieldCheck, 
  Award, 
  PhoneCall, 
  CheckCircle2, 
  HeartHandshake, 
  Lock,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-stone-300 pt-16 pb-12 border-t border-emerald-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4 Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-emerald-900/80 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Statutory MSP Floor</h4>
              <p className="text-stone-400 mt-1">Direct protection against distress pricing. Every bid must adhere to central MSP guidelines.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">NABL Agmark Testing</h4>
              <p className="text-stone-400 mt-1">Farm-gate moisture meters & purity grading ensure zero disputes on delivery.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Krishi Agro Escrow</h4>
              <p className="text-stone-400 mt-1">Buyer funds held securely. Farmer receives instant DBT release upon verified arrival.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">24x7 Kisan Helpline</h4>
              <p className="text-stone-400 mt-1">Toll Free: <strong>1800-180-1551</strong> with voice assistance in 12 regional languages.</p>
            </div>
          </div>
        </div>

        {/* Middle Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-stone-400">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-amber-300 font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white font-serif tracking-tight">
                Krishi<span className="text-emerald-400">Sewak</span>
              </span>
            </div>
            <p className="leading-relaxed">
              Empowering India's farmers with guaranteed fair market prices, digital quality certification, and transparent wholesale direct commerce.
            </p>
            <div className="flex items-center gap-2 pt-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Certified Kisan Welfare Platform</span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Crop Categories</h5>
            <ul className="space-y-2">
              <li><span className="hover:text-emerald-300 cursor-pointer">Wheat & Cereals (अनाज)</span></li>
              <li><span className="hover:text-emerald-300 cursor-pointer">Basmati & Non-Basmati Paddy (धान)</span></li>
              <li><span className="hover:text-emerald-300 cursor-pointer">Mustard & Oilseeds (सरसों / तिलहन)</span></li>
              <li><span className="hover:text-emerald-300 cursor-pointer">Pulses & Chana (दालें / चना)</span></li>
              <li><span className="hover:text-emerald-300 cursor-pointer">Spices & Turmeric (मसाले / हल्दी)</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">MSP & Policy Tools</h5>
            <ul className="space-y-2">
              <li><span className="hover:text-emerald-300 cursor-pointer">CACP Statutory MSP Formula</span></li>
              <li><span className="hover:text-emerald-300 cursor-pointer">Interactive Mandi Revenue Calculator</span></li>
              <li><span className="hover:text-emerald-300 cursor-pointer">NABL Moisture & Quality Thresholds</span></li>
              <li><span className="hover:text-emerald-300 cursor-pointer">Krishi Express Logistics Fleet</span></li>
              <li><span className="hover:text-emerald-300 cursor-pointer">Zero Brokerage Guarantee</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Government & Banking Partners</h5>
            <p className="leading-relaxed mb-2">
              Aligned with e-NAM Mandi digital standards, State Warehousing Corporations, and RBI regulated escrow desks.
            </p>
            <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-800 text-[11px] text-emerald-200">
              Direct Farmer DBT Payouts processed via SBI, PNB, and Bank of Baroda.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} Krishi Sewak (कृषि सेवक). Built for Indian Farmers & Transparent Agriculture.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-stone-300 cursor-pointer">MSP Guarantee Terms</span>
            <span>•</span>
            <span className="hover:text-stone-300 cursor-pointer">Escrow Safety Charter</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
