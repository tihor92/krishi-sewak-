import React from 'react';
import { CropListing } from '../types';
import { 
  ShieldCheck, 
  Award, 
  Droplet, 
  MapPin, 
  Truck, 
  CheckCircle, 
  Scale, 
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

interface CropCardProps {
  crop: CropListing;
  onSelect: (crop: CropListing) => void;
  onQuickBuy: (crop: CropListing) => void;
  onQuickBid: (crop: CropListing) => void;
  onViewCert: (crop: CropListing) => void;
}

export const CropCard: React.FC<CropCardProps> = ({
  crop,
  onSelect,
  onQuickBuy,
  onQuickBid,
  onViewCert
}) => {
  const mspPremium = Math.round(((crop.pricePerQuintal - crop.officialMsp) / crop.officialMsp) * 100);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col group">
      
      {/* Top Image Banner */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
        <img 
          src={crop.images[0]} 
          alt={crop.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* MSP Protected Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/90 text-emerald-200 text-xs font-bold backdrop-blur-md border border-emerald-500/40 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>MSP Protected</span>
          </div>

          {/* Quality Grade Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/80 text-amber-300 text-xs font-bold backdrop-blur-md border border-amber-400/30">
            <Award className="w-3.5 h-3.5" />
            <span>{crop.qualityGrade.split(' ')[0]}</span>
          </div>
        </div>

        {/* Bottom Image Stats */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] font-medium">
              <Droplet className="w-3 h-3 text-cyan-400" />
              {crop.qualityParameters.moisturePercent}% Moisture
            </span>
            {crop.qualityParameters.oilContentPercent && (
              <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-medium text-amber-300">
                🫒 {crop.qualityParameters.oilContentPercent}% Oil
              </span>
            )}
            {crop.qualityParameters.grainLengthMm && (
              <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-medium text-stone-200">
                📏 {crop.qualityParameters.grainLengthMm}mm Grain
              </span>
            )}
          </div>
          <span className="bg-emerald-600/90 px-2 py-0.5 rounded-md text-[11px] font-bold">
            {crop.category}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Variety */}
          <div className="mb-2">
            <h3 
              onClick={() => onSelect(crop)}
              className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1 cursor-pointer"
            >
              {crop.title}
            </h3>
            <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5 mt-0.5">
              <span>Variety: <strong className="text-stone-700">{crop.variety}</strong></span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">{crop.availableFrom}</span>
            </p>
          </div>

          {/* Farmer & Location Info */}
          <div className="flex items-center justify-between py-2 border-y border-stone-100 my-2 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                {crop.farmer.name.charAt(0)}
              </div>
              <div>
                <span className="font-semibold text-stone-800 flex items-center gap-1">
                  {crop.farmer.name}
                  {crop.farmer.isKycVerified && (
                    <span title="Kisan Card Verified">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 inline" />
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-stone-500 text-[11px]">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>{crop.location.district}, {crop.location.state}</span>
            </div>
          </div>

          {/* Price & MSP Baseline Box */}
          <div className="bg-stone-50 rounded-xl p-3 my-2 border border-stone-200/80">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-900">
                  ₹{crop.pricePerQuintal.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-stone-500 ml-1">/ quintal (100kg)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                  <span>Govt MSP: <strong className="text-stone-700">₹{crop.officialMsp.toLocaleString('en-IN')}</strong></span>
                  <span className="text-emerald-700 font-bold flex items-center">
                    <TrendingUp className="w-3 h-3 inline mr-0.5" />
                    +{mspPremium}% above baseline
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-stone-500 font-medium flex items-center justify-end gap-1">
                  <Scale className="w-3.5 h-3.5 text-stone-400" />
                  <span>Available Lot</span>
                </div>
                <div className="text-sm font-bold text-stone-800">
                  {crop.quantityQuintals} Quintals
                </div>
                <div className="text-[10px] text-stone-400">
                  Min order: {crop.minOrderQuintals} Qtl
                </div>
              </div>
            </div>
          </div>

          {/* Quality & Logistics Assurance */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 my-2 px-1">
            <button 
              onClick={() => onViewCert(crop)} 
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Agmark: {crop.qualityCertificate.certNumber}</span>
            </button>
            <div className="flex items-center gap-1 text-stone-600">
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              <span>{crop.estimatedDeliveryDays} Days Delivery</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-100">
          <button
            onClick={() => onQuickBid(crop)}
            className="w-full py-2 px-3 rounded-xl border border-emerald-300 text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <span>Fair Offer / बोली</span>
          </button>

          <button
            onClick={() => onQuickBuy(crop)}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm shadow-emerald-700/20 transition-all active:scale-95"
          >
            <span>Buy via Escrow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
