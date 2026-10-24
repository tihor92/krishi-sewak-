import React, { useState } from 'react';
import { Order, UserRole } from '../types';
import { 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  ArrowUpRight,
  Droplet,
  Banknote,
  Navigation,
  Phone
} from 'lucide-react';

interface EscrowOrdersViewProps {
  orders: Order[];
  currentRole: UserRole;
  onRefreshOrders: () => void;
}

export const EscrowOrdersView: React.FC<EscrowOrdersViewProps> = ({
  orders,
  currentRole,
  onRefreshOrders
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'ACTIVE') return order.escrowStatus !== 'COMPLETED_PAYMENT_RELEASED';
    if (filterStatus === 'COMPLETED') return order.escrowStatus === 'COMPLETED_PAYMENT_RELEASED';
    return true;
  });

  const handleReleasePayment = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED_PAYMENT_RELEASED',
          moistureAtArrival: 10.1,
          paymentTxnId: `DBT-KRISHI-${Math.floor(100000 + Math.random() * 900000)}`
        })
      });
      const data = await response.json();
      if (data.success) {
        onRefreshOrders();
      }
    } catch (err) {
      console.error('Failed to release escrow payment:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Escrow Guarantee Hero Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none"></div>
        
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>KRISHI SEWAK ESCROW & LOGISTICS PROTECTION (सुरक्षित किसान एस्क्रो)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-serif">
            Fair Price Escrow & Guaranteed On-Time Delivery
          </h2>

          <p className="text-sm text-emerald-100 leading-relaxed">
            Every transaction is safeguarded by the Krishi Sewak Agro Escrow. The buyer's payment is held securely in an RBI-compliant escrow account. The farmer is guaranteed 100% full payout via Direct Bank Transfer (DBT) with 0% middleman commission once the crop arrives and quality is confirmed.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
              <span className="text-amber-300 font-bold block mb-1">1. Buyer Security</span>
              <span>100% money protected if moisture or quality diverges from Agmark standard.</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
              <span className="text-emerald-300 font-bold block mb-1">2. Farmer Assurance</span>
              <span>No distress sales. Guaranteed statutory MSP or above directly to bank account.</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
              <span className="text-cyan-300 font-bold block mb-1">3. On-Time Transit</span>
              <span>Krishi Express dedicated logistics with GPS sealed containers & weighbridge slips.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === 'ALL'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus('ACTIVE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === 'ACTIVE'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            In-Transit & Escrow Locked ({orders.filter(o => o.escrowStatus !== 'COMPLETED_PAYMENT_RELEASED').length})
          </button>
          <button
            onClick={() => setFilterStatus('COMPLETED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === 'COMPLETED'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Completed & Farmer Paid ({orders.filter(o => o.escrowStatus === 'COMPLETED_PAYMENT_RELEASED').length})
          </button>
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Showing orders for: <strong className="text-stone-800">{currentRole === 'farmer' ? 'Kisan Rameshwar Ji (Seller)' : 'Aggarwal Agro Mills (Buyer)'}</strong>
        </span>
      </div>

      {/* Orders List */}
      <div className="space-y-5">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500">
            <Truck className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-bold text-stone-800 text-lg">No orders found in this category</h3>
            <p className="text-xs text-stone-500 mt-1">Browse the marketplace to place a new escrow-protected order.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Order Header Bar */}
              <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-stone-200 shrink-0">
                    <img src={order.cropImage} alt={order.cropName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-stone-900 text-base">{order.id}</span>
                      <span className="text-stone-400">•</span>
                      <span className="text-xs font-bold text-emerald-800">{order.cropTitle}</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Order Date: {order.orderDate} • Expected Delivery: <strong className="text-stone-700">{order.expectedDeliveryDate}</strong>
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {order.escrowStatus === 'COMPLETED_PAYMENT_RELEASED' ? (
                    <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Delivered & Payment Credited to Farmer
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                      In Transit • Escrow Locked ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {/* Order Content Body */}
              <div className="p-6 space-y-6">
                
                {/* 3-Column Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600">
                  {/* Farmer Details */}
                  <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/80 space-y-1">
                    <span className="font-bold text-stone-900 uppercase text-[11px] tracking-wider block mb-1">
                      🌾 Seller (Farmer)
                    </span>
                    <p className="text-sm font-bold text-stone-900">{order.farmer.name}</p>
                    <p className="text-stone-500">{order.farmer.district}, {order.farmer.state}</p>
                    <a href={`tel:${order.farmer.phone}`} className="text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                      <Phone className="w-3 h-3" /> {order.farmer.phone}
                    </a>
                  </div>

                  {/* Buyer Details */}
                  <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/80 space-y-1">
                    <span className="font-bold text-stone-900 uppercase text-[11px] tracking-wider block mb-1">
                      🛒 Buyer (Wholesaler / Processor)
                    </span>
                    <p className="text-sm font-bold text-stone-900">{order.buyer.companyName}</p>
                    <p className="text-stone-500 line-clamp-2">{order.buyer.deliveryAddress}</p>
                    <p className="text-stone-700 pt-1">Contact: {order.buyer.name} ({order.buyer.phone})</p>
                  </div>

                  {/* Payment & Escrow Box */}
                  <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-900 uppercase text-[11px] tracking-wider block mb-1">
                      💰 Escrow Financials
                    </span>
                    <div className="text-lg font-black text-emerald-950">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <p className="text-emerald-800 text-[11px]">
                      {order.quantityQuintals} Quintals @ ₹{order.agreedPricePerQuintal}/qtl
                    </p>
                    <p className="text-stone-500 text-[10px] pt-1">
                      Escrow Vault ID: <span className="font-mono">{order.escrowId}</span>
                    </p>
                  </div>
                </div>

                {/* Fleet & Logistics Tracker */}
                <div className="border border-stone-200 rounded-2xl p-5 space-y-4 bg-stone-50/40">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      <h4 className="font-bold text-sm text-stone-900">
                        Krishi Express Transit Tracker & Quality Checkpoints
                      </h4>
                    </div>
                    {order.vehicleNumber && (
                      <span className="text-xs text-stone-600 bg-white px-3 py-1 rounded-lg border border-stone-200 font-mono">
                        Vehicle: <strong>{order.vehicleNumber}</strong> • Driver: {order.driverName}
                      </span>
                    )}
                  </div>

                  {/* Checkpoints Timeline */}
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                    {order.trackingCheckpoints.map((cp, idx) => (
                      <div key={idx} className="relative flex items-start gap-3">
                        <div className={`absolute -left-6 mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          cp.completed
                            ? 'bg-emerald-600 border-white text-white'
                            : 'bg-white border-stone-300'
                        }`}>
                          {cp.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="flex items-baseline justify-between">
                            <span className={`font-bold ${cp.completed ? 'text-stone-900' : 'text-stone-500'}`}>
                              {cp.title}
                            </span>
                            <span className="text-[11px] text-stone-400">{cp.timestamp}</span>
                          </div>
                          <p className="text-stone-500 text-[11px] mt-0.5">Location: {cp.location}</p>
                          {cp.notes && (
                            <p className="text-emerald-800 text-[11px] bg-emerald-50/70 p-2 rounded-lg mt-1 border border-emerald-200/50">
                              {cp.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions: Release Escrow Handover */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200">
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>NABL Moisture verified: <strong>{order.moistureAtArrival || 10.2}%</strong></span>
                    {order.paymentReleaseTxnId && (
                      <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        DBT Txn: {order.paymentReleaseTxnId}
                      </span>
                    )}
                  </div>

                  {/* If not completed yet, allow buyer to verify arrival and release funds to farmer */}
                  {order.escrowStatus !== 'COMPLETED_PAYMENT_RELEASED' && (
                    <button
                      onClick={() => handleReleasePayment(order.id)}
                      disabled={updatingId === order.id}
                      className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{updatingId === order.id ? 'Releasing DBT Funds...' : 'Confirm Delivery & Release Escrow to Farmer'}</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
