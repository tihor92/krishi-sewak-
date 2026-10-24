export type UserRole = 'farmer' | 'buyer';

export type CropCategory = 'Cereals' | 'Pulses' | 'Oilseeds' | 'Cash Crops' | 'Spices';

export type QualityGrade = 
  | 'Grade A+ (Export Quality)'
  | 'Grade A (Agmark Premium)'
  | 'Grade B (Standard Mandi)'
  | 'Certified Organic';

export interface QualityParameters {
  moisturePercent: number;
  foreignMatterPercent: number;
  damagedGrainsPercent: number;
  grainLengthMm?: number;
  oilContentPercent?: number;
  proteinPercent?: number;
  organicCertificationNumber?: string;
}

export interface QualityCertificate {
  certNumber: string;
  issuedBy: string;
  verifiedDate: string;
  inspectorName: string;
  status: 'VERIFIED' | 'PENDING_INSPECTION' | 'SELF_DECLARED';
  sealUrl?: string;
}

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  kisanCreditCardNo?: string;
  isKycVerified: boolean;
  rating: number;
  totalDealsCompleted: number;
  memberSince: string;
  avatarUrl?: string;
}

export interface CropListing {
  id: string;
  title: string;
  cropName: string;
  category: CropCategory;
  variety: string;
  quantityQuintals: number;
  minOrderQuintals: number;
  pricePerQuintal: number;
  officialMsp: number; // Statutory MSP baseline
  isMspProtected: boolean; // Flag verifying price is at or above MSP
  qualityGrade: QualityGrade;
  qualityParameters: QualityParameters;
  qualityCertificate: QualityCertificate;
  farmer: FarmerProfile;
  harvestDate: string;
  availableFrom: string;
  estimatedDeliveryDays: number;
  location: {
    village: string;
    district: string;
    state: string;
  };
  logisticsSupported: ('Krishi Express Fleet' | 'Farmer Arranged Truck' | 'Buyer Self-Pickup')[];
  images: string[];
  description: string;
  status: 'AVAILABLE' | 'UNDER_OFFER' | 'SOLD';
  featured?: boolean;
  createdAt: string;
}

export interface MspBenchmark {
  cropName: string;
  category: CropCategory;
  variety: string;
  season: 'Kharif' | 'Rabi' | 'Commercial';
  mspPrice: number; // ₹ per quintal
  previousYearMsp: number;
  costOfProductionA2FL: number; // Cost of production baseline
  marginPercent: number;
  nationalMandiAverage: number;
  marketTrend: 'BULLISH' | 'STABLE' | 'RISING';
  effectiveYear: string;
}

export type EscrowStatus = 
  | 'ESCROW_FUNDED'
  | 'QUALITY_INSPECTED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED_PAYMENT_RELEASED';

export interface TrackingCheckpoint {
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
  notes?: string;
}

export interface Order {
  id: string;
  cropListingId: string;
  cropTitle: string;
  cropName: string;
  cropImage: string;
  farmer: {
    id: string;
    name: string;
    phone: string;
    district: string;
    state: string;
  };
  buyer: {
    id: string;
    name: string;
    companyName: string;
    phone: string;
    deliveryAddress: string;
    district: string;
    state: string;
  };
  quantityQuintals: number;
  agreedPricePerQuintal: number;
  subtotal: number;
  mandiTaxesAndCess: number; // Nominal 0.5%
  qualityInspectionFee: number; // 0 for buyer (sponsored by Krishi Sewak)
  logisticsFee: number;
  totalAmount: number;
  escrowStatus: EscrowStatus;
  escrowId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  trackingCheckpoints: TrackingCheckpoint[];
  qualityVerifiedOnArrival: boolean;
  moistureAtArrival?: number;
  paymentReleaseTxnId?: string;
}

export interface FairBidOffer {
  id: string;
  cropListingId: string;
  cropTitle: string;
  cropImage: string;
  buyerName: string;
  buyerCompany: string;
  buyerRating: number;
  offeredPricePerQuintal: number;
  officialMsp: number;
  isAboveMsp: boolean;
  quantityRequestedQuintals: number;
  proposedDeliveryDate: string;
  note: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';
  counterPrice?: number;
  createdAt: string;
}

export interface QualityTestRequest {
  id: string;
  cropListingId: string;
  farmerName: string;
  cropName: string;
  requestedDate: string;
  preferredSlot: string;
  locationAddress: string;
  status: 'SCHEDULED' | 'SAMPLE_COLLECTED' | 'REPORT_GENERATED';
  assignedInspector: string;
}
