import React, { useState } from 'react';
import { FairBidOffer, UserRole } from '../types';
import { 
  ShieldCheck, 
  Check, 
  X, 
  RefreshCw, 
  TrendingUp, 
  Building2, 
  Calendar, 
  MessageSquare,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface FairBidsViewProps {
  bids: FairBidOffer[];
  currentRole: UserRole;
  onRefreshBids: () => void;
  onAcceptBidAsOrder: (bid: FairBidOffer) => void;
}

export const FairBidsView: React.FC<FairBidsViewProps> = ({
  bids,
  currentRole,
  onRefreshBids,
  onAcceptBidAsOrder
}) => {
  const [counterBidId, setCounterBidId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(3000);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleUpdateBidStatus = async (bidId: string, status: 'ACCEPTED' | 'REJECTED' | 'COUNTERED', counter?: number) => {
    setIsUpdating(bidId);
    try {
      const response = await fetch(`/api/bids/${bidId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          counterPrice: counter
        })
      });
      const data = await response.json();
      if (data.success) {
        onRefreshBids();
        setCounterBidId(null);
      }
    } catch (err) {
      console.error('Failed to update bid:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Fair Negotiation Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-950">
                Fair Price Negotiation Desk (न्यायपूर्ण भाव वार्ता)
              </h2>
              <p className="text-xs text-amber-800 mt-1 max-w-2xl leading-relaxed">
                Krishi Sewak automatically filters out distress, predatory, or below-MSP offers. All bids listed below strictly meet or exceed official statutory MSP rates, ensuring honest price discovery and direct farmer-buyer communication.
              </p>
            </div>
          </div>

          <div className="bg-white px-4 py-2 rounded-xl border border-amber-200 text-xs text-stone-700 shrink-0">
            <span>Pending Bids for Review: <strong className="text-amber-800 text-sm font-bold">{bids.filter(b => b.status === 'PENDING').length}</strong></span>
          </div>
        </div>
      </div>

      {/* Bids List */}
      <div className="space-y-4">
        {bids.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-500">
            <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-bold text-stone-800 text-lg">No active bids right now</h3>
            <p className="text-xs text-stone-500 mt-1">When buyers submit offers on your crop listings, they will appear here with MSP verification.</p>
          </div>
        ) : (
          bids.map((bid) => {
            const premiumOverMsp = Math.round(((bid.offeredPricePerQuintal - bid.officialMsp) / bid.officialMsp) * 100);

            return (
              <div 
                key={bid.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow p-5 sm:p-6"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  
                  {/* Left: Crop & Buyer Info */}
                  <div className="flex items-start gap-4">
                    <img 
                      src={bid.cropImage} 
                      alt={bid.cropTitle} 
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0" 
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-stone-900">{bid.cropTitle}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                          MSP Verified (₹{bid.officialMsp}/qtl)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-stone-600 mt-1 flex-wrap">
                        <span className="font-semibold text-stone-900 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-stone-500" />
                          {bid.buyerCompany} ({bid.buyerName})
                        </span>
                        <span>•</span>
                        <span className="text-stone-500">⭐ {bid.buyerRating} Buyer Rating</span>
                        <span>•</span>
                        <span className="text-stone-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          Proposed Delivery: {bid.proposedDeliveryDate}
                        </span>
                      </div>

                      {bid.note && (
                        <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200 mt-2 max-w-xl">
                          "{bid.note}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Offered Price & Action Buttons */}
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-end gap-4 w-full md:w-auto">
                    <div className="text-right">
                      <span className="text-xs text-stone-500">Offered Price</span>
                      <div className="text-2xl font-black text-emerald-900">
                        ₹{bid.offeredPricePerQuintal.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-stone-500">/qtl</span>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700">
                        +{premiumOverMsp}% above MSP • Total: ₹{(bid.offeredPricePerQuintal * bid.quantityRequestedQuintals).toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-stone-400">Qty: {bid.quantityRequestedQuintals} Quintals</span>
                    </div>

                    {/* Status Pill or Actions */}
                    <div className="flex items-center gap-2">
                      {bid.status === 'ACCEPTED' ? (
                        <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Bid Accepted
                        </span>
                      ) : bid.status === 'REJECTED' ? (
                        <span className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold border border-stone-200">
                          Declined
                        </span>
                      ) : bid.status === 'COUNTERED' ? (
                        <span className="px-4 py-2 rounded-xl bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                          Countered at ₹{bid.counterPrice}/qtl
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateBidStatus(bid.id, 'ACCEPTED')}
                            disabled={isUpdating === bid.id}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                            title="Accept buyer offer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>

                          <button
                            onClick={() => {
                              setCounterBidId(counterBidId === bid.id ? null : bid.id);
                              setCounterPrice(bid.offeredPricePerQuintal + 100);
                            }}
                            className="px-3 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-xs flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3 text-stone-500" />
                            <span>Counter</span>
                          </button>

                          <button
                            onClick={() => handleUpdateBidStatus(bid.id, 'REJECTED')}
                            disabled={isUpdating === bid.id}
                            className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Decline offer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Counter Price Sub-Drawer */}
                {counterBidId === bid.id && (
                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-end gap-3 bg-stone-50 p-3 rounded-xl animate-in fade-in">
                    <span className="text-xs font-semibold text-stone-700">Enter Your Counter Price:</span>
                    <div className="relative w-36">
                      <span className="absolute left-2.5 top-1.5 text-stone-500 text-xs font-bold">₹</span>
                      <input 
                        type="number"
                        min={bid.officialMsp}
                        value={counterPrice}
                        onChange={(e) => setCounterPrice(Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-900"
                      />
                    </div>
                    <button
                      onClick={() => handleUpdateBidStatus(bid.id, 'COUNTERED', counterPrice)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold"
                    >
                      Send Counter Offer
                    </button>
                    <button
                      onClick={() => setCounterBidId(null)}
                      className="text-xs text-stone-500 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
