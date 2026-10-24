import React from 'react';
import { UserRole } from '../types';
import { 
  Sprout, 
  ShoppingBag, 
  PlusCircle, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  BadgePercent, 
  CheckCircle2, 
  Menu, 
  X,
  Languages,
  PhoneCall
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: 'marketplace' | 'msp' | 'orders' | 'bids' | 'quality';
  setActiveTab: (tab: 'marketplace' | 'msp' | 'orders' | 'bids' | 'quality') => void;
  onOpenSellModal: () => void;
  onOpenAiAdvisor: () => void;
  orderCount: number;
  bidCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  onOpenSellModal,
  onOpenAiAdvisor,
  orderCount,
  bidCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [hindiSubtitles, setHindiSubtitles] = React.useState(true);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('marketplace')} 
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-2xl tracking-tight text-emerald-950 font-serif">
                    Krishi<span className="text-emerald-600">Sewak</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-900 border border-amber-300">
                    MSP Guaranteed
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">
                  {hindiSubtitles ? 'कृषि सेवक • किसान को सही दाम, खरीदार को शुद्ध फसल' : 'Fair Crop Price & Verified Quality Agro Marketplace'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Crops Market {hindiSubtitles && <span className="text-xs text-stone-400 font-normal">/ मंडी</span>}</span>
            </button>

            <button
              onClick={() => setActiveTab('msp')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'msp'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BadgePercent className="w-4 h-4 text-amber-600" />
              <span>MSP Rates {hindiSubtitles && <span className="text-xs text-stone-400 font-normal">/ समर्थन मूल्य</span>}</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'orders'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Escrow Orders {hindiSubtitles && <span className="text-xs text-stone-400 font-normal">/ ऑर्डर</span>}</span>
              {orderCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {orderCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('bids')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'bids'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Fair Bids {hindiSubtitles && <span className="text-xs text-stone-400 font-normal">/ बोली</span>}</span>
              {bidCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {bidCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('quality')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'quality'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Agmark Lab {hindiSubtitles && <span className="text-xs text-stone-400 font-normal">/ जांच</span>}</span>
            </button>
          </nav>

          {/* Right Action Section */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Language hint toggle */}
            <button 
              onClick={() => setHindiSubtitles(!hindiSubtitles)}
              title="Toggle Hindi/English labels"
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 hidden sm:flex items-center gap-1 text-xs font-medium border border-stone-200"
            >
              <Languages className="w-4 h-4 text-emerald-700" />
              <span>{hindiSubtitles ? 'हिंदी + Eng' : 'English Only'}</span>
            </button>

            {/* AI Advisor Button */}
            <button
              onClick={onOpenAiAdvisor}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
              <span className="hidden md:inline">Krishi AI Price Advisor</span>
              <span className="md:hidden">AI Advisor</span>
            </button>

            {/* Farmer Sell Action (always available) */}
            <button
              onClick={onOpenSellModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-emerald-700/25 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200" />
              <span>Sell Crop {hindiSubtitles && <span className="opacity-90 font-normal">/ बेचें</span>}</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                onClick={() => setCurrentRole('farmer')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  currentRole === 'farmer'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Switch to Farmer Dashboard"
              >
                <span>🌾 Kisan</span>
              </button>
              <button
                onClick={() => setCurrentRole('buyer')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  currentRole === 'buyer'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Switch to Wholesale Buyer Dashboard"
              >
                <span>🛒 Buyer</span>
              </button>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* User Persona Banner Header */}
        <div className="py-1 px-3 bg-stone-50 border-t border-stone-100 rounded-b-lg flex flex-wrap items-center justify-between text-[11px] text-stone-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-900">Current Profile:</span>
            {currentRole === 'farmer' ? (
              <span className="text-emerald-800 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Rameshwar Patidar (Kisan ID: KCC-MP-49219 • Sehore, MP)
              </span>
            ) : (
              <span className="text-amber-800 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Sunil Aggarwal (Aggarwal Flour Mills & Agro Traders • Sonipat)
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-stone-500">
            <span className="hidden sm:inline">Kisan Toll-Free: 1800-180-1551</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> Krishi Sewak Support Active
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => { setActiveTab('marketplace'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              activeTab === 'marketplace' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Crop Marketplace / फसल मंडी</span>
          </button>
          <button
            onClick={() => { setActiveTab('msp'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              activeTab === 'msp' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700'
            }`}
          >
            <BadgePercent className="w-4 h-4 text-amber-600" />
            <span>Official MSP Benchmarks / समर्थन मूल्य</span>
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              activeTab === 'orders' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700'
            }`}
          >
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Escrow Orders & Tracking ({orderCount})</span>
          </button>
          <button
            onClick={() => { setActiveTab('bids'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              activeTab === 'bids' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Fair Bids & Offers ({bidCount})</span>
          </button>
          <button
            onClick={() => { setActiveTab('quality'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              activeTab === 'quality' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span>Agmark Quality Inspection Lab</span>
          </button>
        </div>
      )}
    </header>
  );
};
