import { CropListing, MspBenchmark, Order, FairBidOffer } from '../types';

export const OFFICIAL_MSP_BENCHMARKS: MspBenchmark[] = [
  {
    cropName: 'Wheat (गेहूं)',
    category: 'Cereals',
    variety: 'All Varieties (Sharbati, Lokwan, HD-2967)',
    season: 'Rabi',
    mspPrice: 2425,
    previousYearMsp: 2275,
    costOfProductionA2FL: 1128,
    marginPercent: 115,
    nationalMandiAverage: 2580,
    marketTrend: 'RISING',
    effectiveYear: '2025-2026'
  },
  {
    cropName: 'Paddy / Basmati (धान)',
    category: 'Cereals',
    variety: 'Grade A / 1121 / 1509 Basmati',
    season: 'Kharif',
    mspPrice: 2320,
    previousYearMsp: 2203,
    costOfProductionA2FL: 1455,
    marginPercent: 59,
    nationalMandiAverage: 3450,
    marketTrend: 'BULLISH',
    effectiveYear: '2025-2026'
  },
  {
    cropName: 'Mustard / Rapeseed (सरसों)',
    category: 'Oilseeds',
    variety: 'Yellow & Black Mustard (Pusa Bold)',
    season: 'Rabi',
    mspPrice: 5950,
    previousYearMsp: 5650,
    costOfProductionA2FL: 2858,
    marginPercent: 108,
    nationalMandiAverage: 6200,
    marketTrend: 'BULLISH',
    effectiveYear: '2025-2026'
  },
  {
    cropName: 'Gram / Desi Chana (चना)',
    category: 'Pulses',
    variety: 'Desi Kabuli & Chana Whole',
    season: 'Rabi',
    mspPrice: 5650,
    previousYearMsp: 5440,
    costOfProductionA2FL: 3344,
    marginPercent: 69,
    nationalMandiAverage: 5920,
    marketTrend: 'STABLE',
    effectiveYear: '2025-2026'
  },
  {
    cropName: 'Moong Dal (मूंग)',
    category: 'Pulses',
    variety: 'Shiny Green Pods (Samrat)',
    season: 'Kharif',
    mspPrice: 8682,
    previousYearMsp: 8558,
    costOfProductionA2FL: 5788,
    marginPercent: 50,
    nationalMandiAverage: 8950,
    marketTrend: 'RISING',
    effectiveYear: '2025-2026'
  },
  {
    cropName: 'Soybean Yellow (सोयाबीन)',
    category: 'Oilseeds',
    variety: 'JS-335 / JS-9560',
    season: 'Kharif',
    mspPrice: 4892,
    previousYearMsp: 4600,
    costOfProductionA2FL: 3261,
    marginPercent: 50,
    nationalMandiAverage: 5120,
    marketTrend: 'STABLE',
    effectiveYear: '2025-2026'
  },
  {
    cropName: 'Cotton (कपास)',
    category: 'Cash Crops',
    variety: 'Medium & Long Staple (Bt-Cotton)',
    season: 'Kharif',
    mspPrice: 7521,
    previousYearMsp: 7020,
    costOfProductionA2FL: 5014,
    marginPercent: 50,
    nationalMandiAverage: 7850,
    marketTrend: 'BULLISH',
    effectiveYear: '2025-2026'
  },
  {
    cropName: 'Maize / Corn (मक्का)',
    category: 'Cereals',
    variety: 'Yellow Hybrid Starch Grade',
    season: 'Kharif',
    mspPrice: 2225,
    previousYearMsp: 2090,
    costOfProductionA2FL: 1483,
    marginPercent: 50,
    nationalMandiAverage: 2380,
    marketTrend: 'STABLE',
    effectiveYear: '2025-2026'
  },
  {
    cropName: 'Salem Turmeric (हल्दी)',
    category: 'Spices',
    variety: 'Curcumin 4.5%+ Double Polished Finger',
    season: 'Commercial',
    mspPrice: 12500,
    previousYearMsp: 11000,
    costOfProductionA2FL: 7200,
    marginPercent: 74,
    nationalMandiAverage: 14200,
    marketTrend: 'BULLISH',
    effectiveYear: '2025-2026'
  }
];

export const INITIAL_CROPS: CropListing[] = [
  {
    id: 'crop-101',
    title: 'Sehore Sharbati Golden Wheat (100% Organically Grown)',
    cropName: 'Wheat (गेहूं)',
    category: 'Cereals',
    variety: 'C-306 Pure Sharbati',
    quantityQuintals: 120,
    minOrderQuintals: 15,
    pricePerQuintal: 2850,
    officialMsp: 2425,
    isMspProtected: true,
    qualityGrade: 'Grade A+ (Export Quality)',
    qualityParameters: {
      moisturePercent: 9.8,
      foreignMatterPercent: 0.2,
      damagedGrainsPercent: 0.4,
      proteinPercent: 13.6,
      organicCertificationNumber: 'NPOP/NAB/0014/2026'
    },
    qualityCertificate: {
      certNumber: 'AGMARK-MP-2026-8841',
      issuedBy: 'Central Agmark Quality Laboratory, Bhopal',
      verifiedDate: '15 Oct 2026',
      inspectorName: 'Dr. R.K. Verma (Sr. Quality Officer)',
      status: 'VERIFIED'
    },
    farmer: {
      id: 'f-1',
      name: 'Rameshwar Patidar',
      phone: '+91 98261 44520',
      village: 'Barkheda Hasan',
      district: 'Sehore',
      state: 'Madhya Pradesh',
      pincode: '466114',
      kisanCreditCardNo: 'KCC-MP-49219',
      isKycVerified: true,
      rating: 4.9,
      totalDealsCompleted: 34,
      memberSince: 'Mar 2024',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
    },
    harvestDate: 'Oct 2026',
    availableFrom: 'Ready for Immediate Dispatch',
    estimatedDeliveryDays: 3,
    location: {
      village: 'Barkheda Hasan',
      district: 'Sehore',
      state: 'Madhya Pradesh'
    },
    logisticsSupported: ['Krishi Express Fleet', 'Farmer Arranged Truck', 'Buyer Self-Pickup'],
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Directly sourced from the black soil belt of Sehore. Extra heavy grains, golden hue, naturally sun-dried below 10% moisture to eliminate weevil risk. High protein 13.6% ideal for premium rotis and bakery exports. Zero chemical pesticides applied.',
    status: 'AVAILABLE',
    featured: true,
    createdAt: '2026-10-20T10:00:00Z'
  },
  {
    id: 'crop-102',
    title: 'Traditional 1121 Pusa Basmati Paddy (Aged Grains, High Aroma)',
    cropName: 'Paddy / Basmati (धान)',
    category: 'Cereals',
    variety: 'Pusa 1121 Raw Basmati',
    quantityQuintals: 250,
    minOrderQuintals: 30,
    pricePerQuintal: 3850,
    officialMsp: 2320,
    isMspProtected: true,
    qualityGrade: 'Grade A+ (Export Quality)',
    qualityParameters: {
      moisturePercent: 11.2,
      foreignMatterPercent: 0.3,
      damagedGrainsPercent: 0.6,
      grainLengthMm: 8.4,
      proteinPercent: 8.9
    },
    qualityCertificate: {
      certNumber: 'APEDA-PB-2026-7210',
      issuedBy: 'Punjab Agmark Grain Inspection Wing, Ludhiana',
      verifiedDate: '18 Oct 2026',
      inspectorName: 'Sardar Manpreet Singh (Chief Inspector)',
      status: 'VERIFIED'
    },
    farmer: {
      id: 'f-2',
      name: 'Harpreet Singh Gill',
      phone: '+91 94172 38910',
      village: 'Samrala Kalan',
      district: 'Ludhiana',
      state: 'Punjab',
      pincode: '141114',
      kisanCreditCardNo: 'KCC-PB-33104',
      isKycVerified: true,
      rating: 4.95,
      totalDealsCompleted: 58,
      memberSince: 'Jan 2024',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    harvestDate: 'Oct 2026',
    availableFrom: 'Warehouse Ready',
    estimatedDeliveryDays: 2,
    location: {
      village: 'Samrala Kalan',
      district: 'Ludhiana',
      state: 'Punjab'
    },
    logisticsSupported: ['Krishi Express Fleet', 'Buyer Self-Pickup'],
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Super-long raw Basmati grain measuring average 8.4mm with authentic floral aroma upon cooking. Elongates over 2.4x. Machine cleaned, de-stoned, and moisture controlled. Backed by APEDA export certification.',
    status: 'AVAILABLE',
    featured: true,
    createdAt: '2026-10-21T08:30:00Z'
  },
  {
    id: 'crop-103',
    title: 'High Oil-Content Pusa Bold Yellow Mustard (सरसों)',
    cropName: 'Mustard / Rapeseed (सरसों)',
    category: 'Oilseeds',
    variety: 'Pusa Bold Yellow',
    quantityQuintals: 95,
    minOrderQuintals: 10,
    pricePerQuintal: 6350,
    officialMsp: 5950,
    isMspProtected: true,
    qualityGrade: 'Grade A (Agmark Premium)',
    qualityParameters: {
      moisturePercent: 7.2,
      foreignMatterPercent: 0.4,
      damagedGrainsPercent: 0.5,
      oilContentPercent: 42.8
    },
    qualityCertificate: {
      certNumber: 'RAJ-AGMARK-2026-119',
      issuedBy: 'Rajasthan State Agriculture Marketing Board, Bharatpur',
      verifiedDate: '12 Oct 2026',
      inspectorName: 'Sanjay Meena',
      status: 'VERIFIED'
    },
    farmer: {
      id: 'f-3',
      name: 'Baldev Ram Choudhary',
      phone: '+91 97845 11922',
      village: 'Deeg Khera',
      district: 'Bharatpur',
      state: 'Rajasthan',
      pincode: '321203',
      kisanCreditCardNo: 'KCC-RJ-90145',
      isKycVerified: true,
      rating: 4.8,
      totalDealsCompleted: 21,
      memberSince: 'Aug 2024'
    },
    harvestDate: 'Oct 2026',
    availableFrom: 'Immediate Loading',
    estimatedDeliveryDays: 3,
    location: {
      village: 'Deeg Khera',
      district: 'Bharatpur',
      state: 'Rajasthan'
    },
    logisticsSupported: ['Krishi Express Fleet', 'Farmer Arranged Truck'],
    images: [
      'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'High pungency, exceptional 42.8% oil recovery test results. Dry moisture of only 7.2%, guaranteeing zero fungal decay during transit or storage. Best for mustard oil expellers and high-end culinary bottling.',
    status: 'AVAILABLE',
    featured: false,
    createdAt: '2026-10-19T14:15:00Z'
  },
  {
    id: 'crop-104',
    title: 'Desi Kabuli Chana / Chickpeas (Bold 12mm Grains)',
    cropName: 'Gram / Desi Chana (चना)',
    category: 'Pulses',
    variety: 'Dollar Kabuli Chana',
    quantityQuintals: 160,
    minOrderQuintals: 20,
    pricePerQuintal: 6150,
    officialMsp: 5650,
    isMspProtected: true,
    qualityGrade: 'Grade A+ (Export Quality)',
    qualityParameters: {
      moisturePercent: 8.9,
      foreignMatterPercent: 0.1,
      damagedGrainsPercent: 0.3,
      proteinPercent: 22.4
    },
    qualityCertificate: {
      certNumber: 'MH-AGMARK-2026-443',
      issuedBy: 'Maharashtra State Warehousing Corp, Latur',
      verifiedDate: '19 Oct 2026',
      inspectorName: 'Anand Kulkarni',
      status: 'VERIFIED'
    },
    farmer: {
      id: 'f-4',
      name: 'Santosh Baburao Shinde',
      phone: '+91 98224 87610',
      village: 'Ausa Khurd',
      district: 'Latur',
      state: 'Maharashtra',
      pincode: '413520',
      isKycVerified: true,
      rating: 4.88,
      totalDealsCompleted: 42,
      memberSince: 'Feb 2024'
    },
    harvestDate: 'Oct 2026',
    availableFrom: 'Latur Mandi Hub',
    estimatedDeliveryDays: 4,
    location: {
      village: 'Ausa Khurd',
      district: 'Latur',
      state: 'Maharashtra'
    },
    logisticsSupported: ['Krishi Express Fleet', 'Buyer Self-Pickup'],
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Double machine sorted 12mm bold Dollar Kabuli Chana. Natural light cream colour, zero artificial polishing or chemical chalking. Moisture content strictly within 8.9%. High protein 22.4%.',
    status: 'AVAILABLE',
    featured: true,
    createdAt: '2026-10-22T06:00:00Z'
  },
  {
    id: 'crop-105',
    title: 'Certified Organic Shiny Green Moong Whole (Samrat)',
    cropName: 'Moong Dal (मूंग)',
    category: 'Pulses',
    variety: 'Samrat PDM-139',
    quantityQuintals: 70,
    minOrderQuintals: 5,
    pricePerQuintal: 9200,
    officialMsp: 8682,
    isMspProtected: true,
    qualityGrade: 'Certified Organic',
    qualityParameters: {
      moisturePercent: 8.5,
      foreignMatterPercent: 0.1,
      damagedGrainsPercent: 0.2,
      proteinPercent: 24.1,
      organicCertificationNumber: 'ORGCERT-GJ-09281'
    },
    qualityCertificate: {
      certNumber: 'GUJ-AGMARK-2026-902',
      issuedBy: 'Gujarat Organic Products Certification Agency, Anand',
      verifiedDate: '16 Oct 2026',
      inspectorName: 'Dr. Ketan Patel',
      status: 'VERIFIED'
    },
    farmer: {
      id: 'f-5',
      name: 'Govindbhai Prajapati',
      phone: '+91 94280 65112',
      village: 'Petlad Road',
      district: 'Anand',
      state: 'Gujarat',
      pincode: '388450',
      isKycVerified: true,
      rating: 5.0,
      totalDealsCompleted: 19,
      memberSince: 'May 2024'
    },
    harvestDate: 'Oct 2026',
    availableFrom: 'Warehouse Ready',
    estimatedDeliveryDays: 3,
    location: {
      village: 'Petlad Road',
      district: 'Anand',
      state: 'Gujarat'
    },
    logisticsSupported: ['Krishi Express Fleet', 'Farmer Arranged Truck'],
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
    ],
    description: '100% NPOP Certified organic whole green gram. Uniform olive-green grains, outstanding sprouting rate of 98%. Packed in food-grade airtight 50kg jute bags with barcode traceability.',
    status: 'AVAILABLE',
    featured: false,
    createdAt: '2026-10-21T11:45:00Z'
  },
  {
    id: 'crop-106',
    title: 'High Curcumin Salem Turmeric Finger (Unpolished Pure)',
    cropName: 'Salem Turmeric (हल्दी)',
    category: 'Spices',
    variety: 'Salem Curcumin 4.8%',
    quantityQuintals: 45,
    minOrderQuintals: 5,
    pricePerQuintal: 14500,
    officialMsp: 12500,
    isMspProtected: true,
    qualityGrade: 'Grade A+ (Export Quality)',
    qualityParameters: {
      moisturePercent: 9.0,
      foreignMatterPercent: 0.1,
      damagedGrainsPercent: 0.1,
      oilContentPercent: 4.8
    },
    qualityCertificate: {
      certNumber: 'SPICES-TN-2026-302',
      issuedBy: 'Spices Board Quality Lab, Erode',
      verifiedDate: '17 Oct 2026',
      inspectorName: 'M. Selvaraj',
      status: 'VERIFIED'
    },
    farmer: {
      id: 'f-6',
      name: 'V. Sundaram',
      phone: '+91 94432 10874',
      village: 'Kodumudi',
      district: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638151',
      isKycVerified: true,
      rating: 4.92,
      totalDealsCompleted: 27,
      memberSince: 'Jan 2024'
    },
    harvestDate: 'Sep 2026',
    availableFrom: 'Erode Central Cold Storage',
    estimatedDeliveryDays: 4,
    location: {
      village: 'Kodumudi',
      district: 'Erode',
      state: 'Tamil Nadu'
    },
    logisticsSupported: ['Krishi Express Fleet', 'Farmer Arranged Truck'],
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Organically steam-cured Salem turmeric fingers. Lab tested Curcumin content 4.8% (well above commercial 2.5% norm). Deep saffron yellow core with intense aroma. No lead chromate or synthetic color polish.',
    status: 'AVAILABLE',
    featured: true,
    createdAt: '2026-10-18T16:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'KS-ORD-9082',
    cropListingId: 'crop-101',
    cropTitle: 'Sehore Sharbati Golden Wheat (Organically Grown)',
    cropName: 'Wheat (गेहूं)',
    cropImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
    farmer: {
      id: 'f-1',
      name: 'Rameshwar Patidar',
      phone: '+91 98261 44520',
      district: 'Sehore',
      state: 'Madhya Pradesh'
    },
    buyer: {
      id: 'b-1',
      name: 'Sunil Aggarwal',
      companyName: 'Aggarwal Flour Mills & Agro Traders',
      phone: '+91 98110 33411',
      deliveryAddress: 'Plot 44, Food Processing Zone, Kundli Industrial Area',
      district: 'Sonipat',
      state: 'Haryana'
    },
    quantityQuintals: 50,
    agreedPricePerQuintal: 2850,
    subtotal: 142500,
    mandiTaxesAndCess: 712,
    qualityInspectionFee: 0,
    logisticsFee: 4200,
    totalAmount: 147412,
    escrowStatus: 'IN_TRANSIT',
    escrowId: 'ESCROW-SBIN-2026-09281',
    orderDate: '21 Oct 2026, 09:30 AM',
    expectedDeliveryDate: '24 Oct 2026 (Tomorrow)',
    driverName: 'Gurjeet Singh',
    driverPhone: '+91 98765 22091',
    vehicleNumber: 'MP 04 GA 7819 (10-Tyre Eicher)',
    trackingCheckpoints: [
      {
        title: 'Krishi Escrow Lock Confirmed',
        location: 'State Bank of India Agro Escrow Desk',
        timestamp: '21 Oct 2026, 09:35 AM',
        completed: true,
        notes: 'Payment ₹1,47,412 securely deposited by buyer. Guaranteed payment to farmer upon verified delivery.'
      },
      {
        title: 'Agmark Pre-Dispatch Quality Check',
        location: 'Barkheda Hasan Farm Gate, Sehore',
        timestamp: '21 Oct 2026, 03:00 PM',
        completed: true,
        notes: 'Moisture verified at 9.8%. No pest damage detected. Weight slips sealed.'
      },
      {
        title: 'Dispatched via Krishi Express Fleet',
        location: 'Sehore Bypass Toll Gate (NH-46)',
        timestamp: '22 Oct 2026, 06:15 AM',
        completed: true,
        notes: 'GPS Tracker active. Consignment moving towards Gwalior - Agra corridor.'
      },
      {
        title: 'Transit Waypoint - Gwalior Checkpost',
        location: 'Morena Border, MP - UP',
        timestamp: '23 Oct 2026, 02:40 PM',
        completed: true,
        current: true,
        notes: 'Passed e-way bill verification smoothly. 280 km remaining to destination.'
      },
      {
        title: 'Delivery & Digital Weighbridge Handover',
        location: 'Kundli Food Zone, Sonipat',
        timestamp: 'Est. 24 Oct 2026, 11:00 AM',
        completed: false,
        notes: 'Instant automated DBT release of ₹1,42,500 to Farmer Rameshwar on buyer OTP approval.'
      }
    ],
    qualityVerifiedOnArrival: false,
    moistureAtArrival: undefined
  },
  {
    id: 'KS-ORD-9079',
    cropListingId: 'crop-103',
    cropTitle: 'High Oil-Content Pusa Bold Yellow Mustard',
    cropName: 'Mustard / Rapeseed (सरसों)',
    cropImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80',
    farmer: {
      id: 'f-3',
      name: 'Baldev Ram Choudhary',
      phone: '+91 97845 11922',
      district: 'Bharatpur',
      state: 'Rajasthan'
    },
    buyer: {
      id: 'b-2',
      name: 'Mukesh Khandelwal',
      companyName: 'Khandelwal Pure Mustard Oil Mills',
      phone: '+91 94140 88299',
      deliveryAddress: 'Agra Road, Industrial Area, Dausa',
      district: 'Dausa',
      state: 'Rajasthan'
    },
    quantityQuintals: 30,
    agreedPricePerQuintal: 6350,
    subtotal: 190500,
    mandiTaxesAndCess: 950,
    qualityInspectionFee: 0,
    logisticsFee: 2100,
    totalAmount: 193550,
    escrowStatus: 'COMPLETED_PAYMENT_RELEASED',
    escrowId: 'ESCROW-HDFC-2026-11029',
    orderDate: '18 Oct 2026, 11:20 AM',
    expectedDeliveryDate: '20 Oct 2026',
    driverName: 'Ramprasad Sharma',
    driverPhone: '+91 98290 77142',
    vehicleNumber: 'RJ 05 EA 4410',
    trackingCheckpoints: [
      {
        title: 'Escrow Payment Locked',
        location: 'Krishi Sewak Trust Node',
        timestamp: '18 Oct 2026, 11:25 AM',
        completed: true
      },
      {
        title: 'Quality Sample Tested',
        location: 'Deeg Khera Mandi',
        timestamp: '18 Oct 2026, 04:30 PM',
        completed: true,
        notes: 'Oil content verified at 42.8%.'
      },
      {
        title: 'Goods Delivered & Verified',
        location: 'Dausa Factory Gate',
        timestamp: '20 Oct 2026, 01:10 PM',
        completed: true
      },
      {
        title: 'Payment Credited to Farmer',
        location: 'Baldev Ram Bank Account (PNB)',
        timestamp: '20 Oct 2026, 01:45 PM',
        completed: true,
        notes: 'Direct DBT Txn: UTR-9028148902. Zero deduction.'
      }
    ],
    qualityVerifiedOnArrival: true,
    moistureAtArrival: 7.2,
    paymentReleaseTxnId: 'UTR-9028148902'
  }
];

export const INITIAL_BIDS: FairBidOffer[] = [
  {
    id: 'bid-501',
    cropListingId: 'crop-102',
    cropTitle: 'Traditional 1121 Pusa Basmati Paddy',
    cropImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    buyerName: 'Anand Singhania',
    buyerCompany: 'Royal Heritage Rice Exporters Ltd.',
    buyerRating: 4.9,
    offeredPricePerQuintal: 3750,
    officialMsp: 2320,
    isAboveMsp: true,
    quantityRequestedQuintals: 100,
    proposedDeliveryDate: '28 Oct 2026',
    note: 'We require 100 quintals for European packaging batch. Willing to execute immediate advance escrow deposit.',
    status: 'PENDING',
    createdAt: '2026-10-23T11:00:00Z'
  },
  {
    id: 'bid-502',
    cropListingId: 'crop-104',
    cropTitle: 'Desi Kabuli Chana / Chickpeas (Bold 12mm Grains)',
    cropImage: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80',
    buyerName: 'Pooja Venkatesh',
    buyerCompany: 'South India Pulses & Spices Corp',
    buyerRating: 4.85,
    offeredPricePerQuintal: 6000,
    officialMsp: 5650,
    isAboveMsp: true,
    quantityRequestedQuintals: 80,
    proposedDeliveryDate: '30 Oct 2026',
    note: 'Ready for bulk lift. Will arrange Krishi Express logistics directly to our Bangalore packing facility.',
    status: 'ACCEPTED',
    createdAt: '2026-10-22T15:20:00Z'
  }
];
