import React, { useState, useEffect } from 'react';
import { CropListing, Order, FairBidOffer, UserRole, CropCategory } from './types';
import { INITIAL_CROPS, INITIAL_ORDERS, INITIAL_BIDS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { MspTicker } from './components/MspTicker';
import { CropCard } from './components/CropCard';
import { CropDetailModal } from './components/CropDetailModal';
import { SellCropModal } from './components/SellCropModal';
import { EscrowOrdersView } from './components/EscrowOrdersView';
import { FairBidsView } from './components/FairBidsView';
import { MspExplorerView } from './components/MspExplorerView';
import { QualityLabView } from './components/QualityLabView';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { Footer } from './components/Footer';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  TrendingUp, 
  Sprout, 
  Award, 
  Truck, 
  CheckCircle2, 
  PlusCircle, 
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  BadgeAlert
} from 'lucide-react';

export default function App() {
  // Global User Role & Tab state
  const [currentRole, setCurrentRole] = useState<UserRole>('farmer');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'msp' | 'orders' | 'bids' | 'quality'>('marketplace');

  // Data states
  const [crops, setCrops] = useState<CropListing[]>(INITIAL_CROPS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [bids, setBids] = useState<FairBidOffer[]>(INITIAL_BIDS);
  const [isLoadingCrops, setIsLoadingCrops] = useState(false);

  // Marketplace filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [sortOption, setSortOption] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'mspMargin'>('featured');
  const [showOnlyOrganic, setShowOnlyOrganic] = useState(false);

  // Modals state
  const [selectedCropForDetail, setSelectedCropForDetail] = useState<CropListing | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  // Notification Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Fetch crops from backend
  const fetchCrops = async () => {
    setIsLoadingCrops(true);
    try {
      const response = await fetch('/api/crops');
      const data = await response.json();
      if (data.success && data.data) {
        setCrops(data.data);
      }
    } catch (err) {
      console.warn('Backend fetch failed, using local mock data:', err);
    } finally {
      setIsLoadingCrops(false);
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success && data.data) {
        setOrders(data.data);
      }
    } catch (err) {
      console.warn('Orders fetch failed:', err);
    }
  };

  // Fetch bids from backend
  const fetchBids = async () => {
    try {
      const response = await fetch('/api/bids');
      const data = await response.json();
      if (data.success && data.data) {
        setBids(data.data);
      }
    } catch (err) {
      console.warn('Bids fetch failed:', err);
    }
  };

  useEffect(() => {
    fetchCrops();
    fetchOrders();
    fetchBids();
  }, []);

  // Filter & Sort Logic
  const filteredCrops = crops.filter((crop) => {
    // Search query matches crop title, name, variety, district, state, or farmer
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      !query ||
      crop.title.toLowerCase().includes(query) ||
      crop.cropName.toLowerCase().includes(query) ||
      crop.variety.toLowerCase().includes(query) ||
      crop.location.district.toLowerCase().includes(query) ||
      crop.location.state.toLowerCase().includes(query) ||
      crop.farmer.name.toLowerCase().includes(query);

    // Category filter
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;

    // State filter
    const matchesState = selectedState === 'All' || crop.location.state === selectedState;

    // Quality Grade filter
    const matchesGrade = selectedGrade === 'All' || crop.qualityGrade === selectedGrade;

    // Organic filter
    const matchesOrganic = !showOnlyOrganic || crop.qualityGrade.includes('Organic');

    return matchesSearch && matchesCategory && matchesState && matchesGrade && matchesOrganic;
  }).sort((a, b) => {
    if (sortOption === 'priceAsc') return a.pricePerQuintal - b.pricePerQuintal;
    if (sortOption === 'priceDesc') return b.pricePerQuintal - a.pricePerQuintal;
    if (sortOption === 'mspMargin') {
      const marginA = (a.pricePerQuintal - a.officialMsp) / a.officialMsp;
      const marginB = (b.pricePerQuintal - b.officialMsp) / b.officialMsp;
      return marginB - marginA;
    }
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      
      {/* Real-time statutory MSP Ticker */}
      <MspTicker />

      {/* Main Responsive Header */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={(role) => {
          setCurrentRole(role);
          showToast(`Switched to ${role === 'farmer' ? '🌾 Kisan (Farmer)' : '🛒 Wholesale Buyer'} Mode`, 'info');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        orderCount={orders.filter(o => o.escrowStatus !== 'COMPLETED_PAYMENT_RELEASED').length}
        bidCount={bids.filter(b => b.status === 'PENDING').length}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-emerald-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-700 flex items-center gap-3 text-xs sm:text-sm font-semibold max-w-md">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Dynamic View Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {/* TAB 1: CROP MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-8">
            
            {/* Hero Marketplace Banner */}
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-transparent pointer-events-none"></div>

              <div className="max-w-2xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-amber-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>100% FAIR PRICE • STATUTORY MSP ENFORCED</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight leading-tight">
                  {currentRole === 'farmer' ? (
                    <>अपनी फसल बेचें <span className="text-amber-300">सही और न्यायपूर्ण</span> दाम पर</>
                  ) : (
                    <>Procure Quality Crops with <span className="text-amber-300">Escrow & On-Time</span> Delivery</>
                  )}
                </h1>

                <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
                  {currentRole === 'farmer'
                    ? 'Connect directly with wholesale buyers and food mills. No distress sales, zero middleman cuts, and guaranteed payment directly into your bank account under Krishi Escrow.'
                    : 'Direct farm-gate sourcing backed by NABL Agmark quality testing, moisture verification, and sealed logistics fleet delivered on time to your processing mill.'}
                </p>

                {/* Quick CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsSellModalOpen(true)}
                    className="py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Sell Your Crop (फसल बेचें)</span>
                  </button>

                  <button
                    onClick={() => setIsAiAdvisorOpen(true)}
                    className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md flex items-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>AI Fair Price Advisor</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('msp')}
                    className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md flex items-center gap-2 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-300" />
                    <span>View MSP Rates Table</span>
                  </button>
                </div>
              </div>

              {/* Stat Counters Footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 mt-6 border-t border-emerald-700/50 text-xs">
                <div>
                  <span className="text-amber-300 text-lg sm:text-xl font-black block">₹34.8 Cr+</span>
                  <span className="text-emerald-200">Farmer DBT Payouts</span>
                </div>
                <div>
                  <span className="text-amber-300 text-lg sm:text-xl font-black block">100%</span>
                  <span className="text-emerald-200">Statutory MSP Floor Guard</span>
                </div>
                <div>
                  <span className="text-amber-300 text-lg sm:text-xl font-black block">99.6%</span>
                  <span className="text-emerald-200">On-Time Transit Rate</span>
                </div>
                <div>
                  <span className="text-amber-300 text-lg sm:text-xl font-black block">0%</span>
                  <span className="text-emerald-200">Brokerage or Deductions</span>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {['All', 'Cereals', 'Pulses', 'Oilseeds', 'Cash Crops', 'Spices'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat === 'All' ? '🌾 All Crops (सभी फसलें)' :
                   cat === 'Cereals' ? '🌾 Wheat & Rice (अनाज)' :
                   cat === 'Pulses' ? '🫘 Pulses & Dal (दालें)' :
                   cat === 'Oilseeds' ? '🌻 Mustard & Seeds (तिलहन)' :
                   cat === 'Cash Crops' ? '🧵 Cotton & Cash (नकदी)' : '🌶️ Spices (मसाले)'}
                </button>
              ))}

              {/* Organic toggle pill */}
              <button
                onClick={() => setShowOnlyOrganic(!showOnlyOrganic)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                  showOnlyOrganic
                    ? 'bg-amber-100 text-amber-900 border-amber-400'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                🌱 {showOnlyOrganic ? 'Certified Organic Only ✓' : 'Organic Only'}
              </button>
            </div>

            {/* Search & Advanced Filter Toolbar */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input 
                  type="text"
                  placeholder="Search by crop, variety, district (e.g. Sharbati, Sehore, Mustard)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Filters & Sorting */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end text-xs">
                {/* State selector */}
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="p-2 rounded-xl border border-stone-300 font-semibold text-stone-700 bg-stone-50"
                >
                  <option value="All">All States / Mandis</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </select>

                {/* Quality Grade */}
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="p-2 rounded-xl border border-stone-300 font-semibold text-stone-700 bg-stone-50"
                >
                  <option value="All">All Quality Grades</option>
                  <option value="Grade A+ (Export Quality)">Grade A+ (Export)</option>
                  <option value="Grade A (Agmark Premium)">Grade A (Agmark)</option>
                  <option value="Certified Organic">Certified Organic</option>
                  <option value="Grade B (Standard Mandi)">Grade B (Standard)</option>
                </select>

                {/* Sort Option */}
                <select
                  value={sortOption}
                  onChange={(e: any) => setSortOption(e.target.value)}
                  className="p-2 rounded-xl border border-stone-300 font-bold text-stone-800 bg-stone-50"
                >
                  <option value="featured">Featured Verified</option>
                  <option value="mspMargin">Highest MSP Premium</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </select>

                {(searchQuery || selectedCategory !== 'All' || selectedState !== 'All' || selectedGrade !== 'All' || showOnlyOrganic) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedState('All');
                      setSelectedGrade('All');
                      setShowOnlyOrganic(false);
                    }}
                    className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 flex items-center gap-1 font-semibold"
                    title="Reset Filters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Crops Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-bold text-stone-800">
                  Showing <strong>{filteredCrops.length}</strong> Verified MSP Crop Lots
                </span>
                <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  All lots guaranteed at or above official MSP
                </span>
              </div>

              {filteredCrops.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-500 space-y-3">
                  <Sprout className="w-12 h-12 text-stone-300 mx-auto" />
                  <h3 className="text-lg font-bold text-stone-800">No crop listings match your criteria</h3>
                  <p className="text-xs text-stone-500">Try adjusting your filters or search terms.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedState('All');
                      setSelectedGrade('All');
                      setShowOnlyOrganic(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCrops.map((crop) => (
                    <CropCard
                      key={crop.id}
                      crop={crop}
                      onSelect={(c) => setSelectedCropForDetail(c)}
                      onQuickBuy={(c) => setSelectedCropForDetail(c)}
                      onQuickBid={(c) => setSelectedCropForDetail(c)}
                      onViewCert={(c) => setSelectedCropForDetail(c)}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: MSP RATES EXPLORER */}
        {activeTab === 'msp' && (
          <MspExplorerView />
        )}

        {/* TAB 3: ORDERS & ESCROW */}
        {activeTab === 'orders' && (
          <EscrowOrdersView 
            orders={orders}
            currentRole={currentRole}
            onRefreshOrders={fetchOrders}
          />
        )}

        {/* TAB 4: FAIR BIDS */}
        {activeTab === 'bids' && (
          <FairBidsView
            bids={bids}
            currentRole={currentRole}
            onRefreshBids={fetchBids}
            onAcceptBidAsOrder={(bid) => {
              showToast(`Bid of ₹${bid.offeredPricePerQuintal}/qtl accepted! Order generated.`, 'success');
              fetchOrders();
              fetchBids();
            }}
          />
        )}

        {/* TAB 5: AGMARK QUALITY TESTING */}
        {activeTab === 'quality' && (
          <QualityLabView />
        )}

      </main>

      {/* Modals */}
      
      {/* 1. Crop Detail Modal */}
      {selectedCropForDetail && (
        <CropDetailModal
          crop={selectedCropForDetail}
          onClose={() => setSelectedCropForDetail(null)}
          onOrderSuccess={(orderData) => {
            fetchOrders();
            fetchCrops();
            showToast(`Order #${orderData.id} placed! Payment ₹${orderData.totalAmount.toLocaleString('en-IN')} locked in Escrow.`, 'success');
            setActiveTab('orders');
          }}
          onBidSuccess={(bidData) => {
            fetchBids();
            showToast(`Fair offer of ₹${bidData.offeredPricePerQuintal}/qtl submitted for farmer review.`, 'success');
            setActiveTab('bids');
          }}
        />
      )}

      {/* 2. Farmer Sell Modal */}
      <SellCropModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSuccess={(newCrop) => {
          fetchCrops();
          showToast(`Crop lot '${newCrop.title}' listed successfully at fair price ₹${newCrop.pricePerQuintal}/qtl!`, 'success');
          setActiveTab('marketplace');
        }}
      />

      {/* 3. AI Fair Price Advisor Modal */}
      <AiAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
