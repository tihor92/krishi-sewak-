import React, { useState } from 'react';
import { QualityGrade } from '../types';
import { 
  BadgeCheck, 
  Droplet, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  User, 
  CheckCircle2, 
  FileText, 
  Clock,
  Sparkles,
  Phone
} from 'lucide-react';

export const QualityLabView: React.FC = () => {
  const [cropName, setCropName] = useState('Sharbati Golden Wheat');
  const [farmerName, setFarmerName] = useState('Rameshwar Patidar');
  const [preferredSlot, setPreferredSlot] = useState('Morning (09:00 AM - 12:00 PM)');
  const [locationAddress, setLocationAddress] = useState('Barkheda Hasan Farm Gate, Sehore, Madhya Pradesh');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [inspections, setInspections] = useState([
    {
      id: 'INSP-9011',
      cropName: 'Sehore Sharbati Golden Wheat',
      farmerName: 'Rameshwar Patidar',
      location: 'Sehore, MP',
      date: '21 Oct 2026',
      inspector: 'Dr. R.K. Verma (Sr. Quality Officer)',
      status: 'VERIFIED',
      moisture: '9.8%',
      grade: 'Grade A+ (Export Quality)',
      certId: 'AGMARK-MP-2026-8841'
    },
    {
      id: 'INSP-9018',
      cropName: 'Pusa 1121 Basmati Paddy',
      farmerName: 'Harpreet Singh Gill',
      location: 'Samrala, Ludhiana, Punjab',
      date: '23 Oct 2026',
      inspector: 'Sardar Manpreet Singh',
      status: 'VERIFIED',
      moisture: '11.2%',
      grade: 'Grade A+ (Export Quality)',
      certId: 'APEDA-PB-2026-7210'
    },
    {
      id: 'INSP-9024',
      cropName: 'Yellow Mustard High-Oil',
      farmerName: 'Baldev Ram Choudhary',
      location: 'Bharatpur, Rajasthan',
      date: 'Scheduled Tomorrow',
      inspector: 'Sanjay Meena (Govt Agmark Center)',
      status: 'SCHEDULED',
      moisture: 'Pending Test',
      grade: 'Inspection in Progress',
      certId: 'PENDING'
    }
  ]);

  const handleBookInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/quality-inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName,
          farmerName,
          preferredSlot,
          locationAddress
        })
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg('Government certified Agmark Inspector assigned! You will receive an SMS with inspector contact details.');
        setInspections([
          {
            id: data.data.id,
            cropName,
            farmerName,
            location: locationAddress,
            date: 'Scheduled Tomorrow',
            inspector: data.data.assignedInspector,
            status: 'SCHEDULED',
            moisture: 'Under Test',
            grade: 'Pending Field Visit',
            certId: 'AGMARK-IN-2026-NEW'
          },
          ...inspections
        ]);
      }
    } catch (err) {
      console.error('Inspection booking error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Quality Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-purple-800/40">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/80 border border-purple-500/40 text-purple-200 text-xs font-bold">
            <BadgeCheck className="w-4 h-4 text-purple-300" />
            <span>NABL & AGMARK ACCREDITED QUALITY ASSURANCE (शुद्धता एवं गुणवत्ता केंद्र)</span>
          </div>

          <h2 className="text-3xl font-black font-serif">
            Zero-Dispute Quality Certification for Farmers & Buyers
          </h2>

          <p className="text-sm text-purple-100 leading-relaxed">
            Krishi Sewak partners with Central & State Agmark testing laboratories. Crops are inspected directly at the farm gate before dispatch: testing moisture levels, broken grains, foreign matter, and chemical purity. Buyers receive certified lab reports with verified batch barcodes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <span className="font-bold text-amber-300 block mb-1">1. Moisture & Purity Check</span>
              <p className="text-purple-200">Electronic moisture meter ensures moisture &lt;12% to prevent rotting during transport.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <span className="font-bold text-emerald-300 block mb-1">2. 15-25% Price Premium</span>
              <p className="text-purple-200">Certified Grade A+ lots attract instant bids from large food processing corporations.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <span className="font-bold text-cyan-300 block mb-1">3. Escrow Backed Guarantee</span>
              <p className="text-purple-200">If delivered goods mismatch the certified test parameters, buyer receives immediate replacement.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Book Inspection Form + Recent Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Book Inspector Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Calendar className="w-5 h-5 text-purple-700" />
            <div>
              <h3 className="font-bold text-stone-900 text-base">Book Farm-Gate Inspector</h3>
              <p className="text-xs text-stone-500">Free service for all Krishi Sewak enrolled farmers</p>
            </div>
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-xl text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleBookInspection} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Crop Name & Variety</label>
              <input 
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Farmer / Owner Name</label>
              <input 
                type="text"
                required
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Preferred Time Slot</label>
              <select
                value={preferredSlot}
                onChange={(e) => setPreferredSlot(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800"
              >
                <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                <option value="Afternoon (01:00 PM - 04:00 PM)">Afternoon (01:00 PM - 04:00 PM)</option>
                <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Farm Gate Address / Mandi Hub</label>
              <textarea 
                rows={2}
                required
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <BadgeCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Scheduling Field Officer...' : 'Book Free Agmark Inspection'}</span>
            </button>
          </form>
        </div>

        {/* Live Certificates & Testing Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base">Verified Lab Certificates & Field Audit Queue</h3>
            <span className="text-xs text-stone-500 font-medium">Digital Verification Enabled</span>
          </div>

          <div className="space-y-3">
            {inspections.map((insp) => (
              <div 
                key={insp.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-purple-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-stone-900 text-sm">{insp.cropName}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      insp.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {insp.status === 'VERIFIED' ? 'Certified Verified' : 'Inspection Pending'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500">
                    Farmer: <strong className="text-stone-700">{insp.farmerName}</strong> • {insp.location}
                  </p>

                  <p className="text-xs text-purple-900 font-medium">
                    Inspector: {insp.inspector} • Date: {insp.date}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 block">Lab Parameters</span>
                    <span className="text-xs font-bold text-emerald-700">Moisture: {insp.moisture}</span>
                    <span className="text-[10px] text-stone-500 block">{insp.grade}</span>
                  </div>

                  <div className="bg-stone-50 p-2 rounded-xl border border-stone-200 text-center min-w-[90px]">
                    <span className="text-[10px] text-stone-400 block">Certificate</span>
                    <span className="font-mono text-xs font-bold text-stone-800">{insp.certId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
