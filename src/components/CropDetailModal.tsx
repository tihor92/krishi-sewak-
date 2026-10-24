import React, { useState } from 'react';
import { CropListing } from '../types';
import { 
  X, 
  ShieldCheck, 
  Award, 
  Droplet, 
  MapPin, 
  Truck, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  BadgeCheck,
  TrendingUp,
  CreditCard,
  Building2,
  Lock
} from 'lucide-react';

interface CropDetailModalProps {
  crop: CropListing | null;
  onClose: () => void;
  onOrderSuccess: (orderData: any) => void;
  onBidSuccess: (bidData: any) => void;
}

export const CropDetailModal: React.FC<CropDetailModalProps> = ({
  crop,
  onClose,
  onOrderSuccess,
  onBidSuccess
}) => {
  if (!crop) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'buy' | 'bid'>('details');
  const [orderQuantity, setOrderQuantity] = useState<number>(crop.minOrderQuintals);
  const [buyerName, setBuyerName] = useState('Sunil Aggarwal');
  const [buyerCompany, setBuyerCompany] = useState('Aggarwal Agro Mills');
  const [buyerPhone, setBuyerPhone] = useState('+91 98110 33411');
  const [deliveryAddress, setDeliveryAddress] = useState('Plot 44, Food Processing Zone, Kundli Industrial Area, Sonipat');

  // Bid state
  const [bidPrice, setBidPrice] = useState<number>(crop.pricePerQuintal);
  const [bidQuantity, setBidQuantity] = useState<number>(crop.minOrderQuintals);
  const [bidNote, setBidNote] = useState('');
  const [bidError, setBidError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations for buy
  const subtotal = orderQuantity * crop.pricePerQuintal;
  const mandiCess = Math.round(subtotal * 0.005);
  const logisticsEstimate = Math.round(orderQuantity * 75);
  const totalAmount = subtotal + mandiCess + logisticsEstimate;

  const mspPremium = Math.round(((crop.pricePerQuintal - crop.officialMsp) / crop.officialMsp) * 100);

  // Handle direct Escrow Order placement
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropListingId: crop.id,
          quantityQuintals: orderQuantity,
          agreedPricePerQuintal: crop.pricePerQuintal,
          buyerInfo: {
            id: 'b-active',
            name: buyerName,
            companyName: buyerCompany,
            phone: buyerPhone,
            deliveryAddress: deliveryAddress,
            district: 'Sonipat',
            state: 'Haryana'
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        onOrderSuccess(data.data);
        onClose();
      }
    } catch (err) {
      console.error('Failed to place order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Fair Bid placement
  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setBidError(null);

    // Strict MSP check
    if (bidPrice < crop.officialMsp) {
      setBidError(`⚠️ MSP Protection Violation: Offered price (₹${bidPrice}) cannot be lower than the Government MSP benchmark of ₹${crop.officialMsp}/quintal. Krishi Sewak ensures fair living wages for farmers.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropListingId: crop.id,
          buyerName,
          buyerCompany,
          offeredPricePerQuintal: bidPrice,
          quantityRequestedQuintals: bidQuantity,
          proposedDeliveryDate: 'Within 5 Days',
          note: bidNote || 'Interested in this verified lot. Kindly accept for quick escrow deposit.'
        })
      });
      const data = await response.json();
      if (data.success) {
        onBidSuccess(data.data);
        onClose();
      } else {
        setBidError(data.message);
      }
    } catch (err) {
      setBidError('Could not submit bid. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col my-auto relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Statutory MSP Protected
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-xs text-stone-500 font-medium">Batch ID: {crop.id}</span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-3 bg-stone-50 border-b border-stone-200 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Crop & Quality Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('buy')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'buy'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Buy via Safe Escrow (तुरंत खरीदें)</span>
          </button>

          <button
            onClick={() => setActiveTab('bid')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'bid'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Make Fair Offer / बोली लगाएं</span>
          </button>
        </div>

        {/* Tab 1: Detailed Overview */}
        {activeTab === 'details' && (
          <div className="p-6 space-y-6">
            
            {/* Top Grid: Image + Main Pricing Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden h-64 bg-stone-100 border border-stone-200 shadow-inner relative">
                  <img 
                    src={crop.images[0]} 
                    alt={crop.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-semibold flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{crop.qualityGrade}</span>
                  </div>
                </div>

                {crop.images.length > 1 && (
                  <div className="flex gap-2">
                    {crop.images.map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="Crop thumbnail" 
                        className="w-20 h-16 object-cover rounded-lg border border-stone-200 cursor-pointer hover:border-emerald-500" 
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Guarantee Column */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-black text-stone-900">{crop.title}</h2>
                  <p className="text-sm text-stone-600 mt-1">{crop.description}</p>
                </div>

                {/* Price Matrix */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Farmer's Fair Price</span>
                      <div className="text-3xl font-extrabold text-emerald-950">
                        ₹{crop.pricePerQuintal.toLocaleString('en-IN')}
                        <span className="text-xs font-medium text-stone-500 ml-1">/ Quintal</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-stone-500">Government MSP</span>
                      <div className="text-lg font-bold text-stone-700">
                        ₹{crop.officialMsp.toLocaleString('en-IN')}/qtl
                      </div>
                      <span className="text-xs font-bold text-emerald-700">
                        +{mspPremium}% above baseline
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-900">
                    <span>Available Lot: <strong>{crop.quantityQuintals} Quintals</strong></span>
                    <span>Min Order: <strong>{crop.minOrderQuintals} Quintals</strong></span>
                  </div>
                </div>

                {/* Guaranteed Logistics Pill */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center gap-3 text-xs text-stone-700">
                  <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900">Guaranteed On-Time Delivery ({crop.estimatedDeliveryDays} Days):</span>
                    <p className="text-stone-500 mt-0.5">Dispatched in tamper-proof sealed vehicles via Krishi Express Fleet with live GPS tracking.</p>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('buy')}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Lock className="w-4 h-4 text-emerald-200" />
                    <span>Buy with Escrow</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('bid')}
                    className="py-3 px-4 rounded-xl border border-stone-300 text-stone-800 hover:bg-stone-100 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Make Fair Bid</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quality Metrics & NABL Certificate Card */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900">Official Agmark & Lab Quality Certificate</h3>
                    <p className="text-xs text-stone-500">Certificate No: <strong>{crop.qualityCertificate.certNumber}</strong></p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  NABL Quality Verified
                </span>
              </div>

              {/* Lab Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <Droplet className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Moisture Content</span>
                  </div>
                  <div className="text-lg font-black text-stone-900 mt-1">
                    {crop.qualityParameters.moisturePercent}%
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Standard Safe &lt;12%</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <div className="text-xs text-stone-500">Foreign Matter / Purity</div>
                  <div className="text-lg font-black text-stone-900 mt-1">
                    {crop.qualityParameters.foreignMatterPercent}%
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Ultra Clean Machine Cleaned</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <div className="text-xs text-stone-500">Damaged / Weeviled</div>
                  <div className="text-lg font-black text-stone-900 mt-1">
                    {crop.qualityParameters.damagedGrainsPercent}%
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Strict Export Standard</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <div className="text-xs text-stone-500">
                    {crop.qualityParameters.oilContentPercent ? 'Oil Recovery' : crop.qualityParameters.grainLengthMm ? 'Avg Grain Length' : 'Protein Value'}
                  </div>
                  <div className="text-lg font-black text-stone-900 mt-1">
                    {crop.qualityParameters.oilContentPercent ? `${crop.qualityParameters.oilContentPercent}%` : crop.qualityParameters.grainLengthMm ? `${crop.qualityParameters.grainLengthMm} mm` : `${crop.qualityParameters.proteinPercent || 12.5}%`}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Tested in Lab</span>
                </div>
              </div>

              {/* Verification Details */}
              <div className="text-xs text-stone-500 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200">
                <span>Testing Body: <strong>{crop.qualityCertificate.issuedBy}</strong></span>
                <span>Inspector: <strong>{crop.qualityCertificate.inspectorName}</strong></span>
                <span>Sample Date: <strong>{crop.qualityCertificate.verifiedDate}</strong></span>
              </div>
            </div>

            {/* Farmer Profile Card */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {crop.farmer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-stone-900">{crop.farmer.name}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Kisan Card Verified
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{crop.location.village}, {crop.location.district}, {crop.location.state}</span>
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    ⭐ {crop.farmer.rating} Rating • {crop.farmer.totalDealsCompleted} Successful Escrow Deals
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${crop.farmer.phone}`}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Call Farmer ({crop.farmer.phone})</span>
                </a>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Buy via Safe Escrow */}
        {activeTab === 'buy' && (
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-bold text-emerald-900 block">
                  How Krishi Sewak Escrow Works (सुरक्षित किसान एवं व्यापारी भुगतान):
                </strong>
                <p className="mt-1 leading-relaxed text-emerald-800">
                  1. Your payment of <strong>₹{totalAmount.toLocaleString('en-IN')}</strong> is safely locked in the RBI-supervised Agro Escrow vault.<br />
                  2. Farmer dispatches the crop with sealed tamper-proof transit lock & GPS tracker.<br />
                  3. You inspect the crop moisture & weight at your gate.<br />
                  4. Only after you approve receipt, the money is instantly credited directly to the farmer via Direct Bank Transfer (DBT).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Form: Order Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-stone-900 uppercase tracking-wider">Purchase Quantity</h4>
                
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Quantity (in Quintals / 100kg bags)
                  </label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number"
                      min={crop.minOrderQuintals}
                      max={crop.quantityQuintals}
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <span className="text-xs text-stone-500 whitespace-nowrap">
                      (Min: {crop.minOrderQuintals} Qtl, Max: {crop.quantityQuintals} Qtl)
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-stone-900 uppercase tracking-wider pt-2">Buyer & Delivery Details</h4>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Name</label>
                  <input 
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Company / Mill / Retailer Name</label>
                  <input 
                    type="text"
                    required
                    value={buyerCompany}
                    onChange={(e) => setBuyerCompany(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input 
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Delivery Destination / Warehouse Address</label>
                  <textarea 
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Right Summary: Escrow Invoice */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-base text-stone-900 border-b border-stone-200 pb-2 flex items-center justify-between">
                    <span>Escrow Order Summary</span>
                    <span className="text-xs font-bold text-emerald-700">0% Commission Brokerage</span>
                  </h4>

                  <div className="space-y-3 py-4 text-sm text-stone-600">
                    <div className="flex justify-between">
                      <span>Crop: <strong>{crop.cropName}</strong></span>
                      <span className="text-stone-900 font-semibold">{orderQuantity} Qtl @ ₹{crop.pricePerQuintal}/qtl</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Crop Subtotal:</span>
                      <span className="font-bold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span>Statutory Mandi Cess & Tax (0.5%):</span>
                      <span className="text-stone-700">₹{mandiCess.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span>Krishi Express Guaranteed Freight ({crop.estimatedDeliveryDays} days):</span>
                      <span className="text-stone-700">₹{logisticsEstimate.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                      <span>Agmark Quality Testing Fee:</span>
                      <span>FREE (Krishi Sewak Protected)</span>
                    </div>

                    <div className="pt-3 border-t border-stone-300 flex justify-between items-baseline">
                      <span className="font-bold text-base text-stone-900">Total Escrow Deposit:</span>
                      <span className="font-black text-2xl text-emerald-950">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-700/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{isSubmitting ? 'Locking in Escrow...' : `Deposit ₹${totalAmount.toLocaleString('en-IN')} to Escrow`}</span>
                  </button>
                  <p className="text-[11px] text-center text-stone-500">
                    Protected by Krishi Sewak Escrow Guarantee • Money released only upon verified crop receipt
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Tab 3: Make Fair Offer / Bid */}
        {activeTab === 'bid' && (
          <form onSubmit={handlePlaceBid} className="p-6 space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-bold text-amber-900 block">
                  Krishi Sewak Fair Negotiation Policy (न्यायपूर्ण भाव नीति):
                </strong>
                <p className="mt-1 leading-relaxed text-amber-800">
                  To eliminate exploitation and distress sales, <strong>no bid can be submitted lower than the Government MSP benchmark (₹{crop.officialMsp.toLocaleString('en-IN')}/quintal)</strong>.
                  Buyers can negotiate premium rates based on volume, long-term procurement, or harvest logistics.
                </p>
              </div>
            </div>

            {bidError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{bidError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Offer Price (₹ per Quintal)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-500 font-bold">₹</span>
                  <input 
                    type="number"
                    required
                    min={crop.officialMsp}
                    value={bidPrice}
                    onChange={(e) => setBidPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 mt-1">
                  <span>Farmer Asking: ₹{crop.pricePerQuintal}/qtl</span>
                  <span className="font-bold text-emerald-700">Official MSP Floor: ₹{crop.officialMsp}/qtl</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Requested Quantity (Quintals)
                </label>
                <input 
                  type="number"
                  required
                  min={crop.minOrderQuintals}
                  max={crop.quantityQuintals}
                  value={bidQuantity}
                  onChange={(e) => setBidQuantity(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Available lot size: {crop.quantityQuintals} Quintals
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                <input 
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Enterprise / Mill Name</label>
                <input 
                  type="text"
                  required
                  value={buyerCompany}
                  onChange={(e) => setBuyerCompany(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Message / Procurement Note for Farmer</label>
              <textarea 
                rows={2}
                placeholder="e.g. We require 80 quintals for high-protein flour production. Immediate escrow transfer guaranteed."
                value={bidNote}
                onChange={(e) => setBidNote(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500">Total Proposed Bid Value:</span>
                <div className="text-xl font-black text-stone-900">
                  ₹{(bidPrice * bidQuantity).toLocaleString('en-IN')}
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Fair Offer'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
