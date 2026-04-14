/**
 * TypeScript type definitions for ADR Autoparts
 * Exported from Prisma schema for full type safety across the application
 */

// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export type UserRole = "CUSTOMER" | "MECHANIC" | "ADMIN";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
  profileImage: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  zipCode: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
  };
  expires: string;
}

// ============================================
// VEHICLE & ECU TYPES
// ============================================

export interface VehicleRecord {
  id: string;
  userId: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  vin: string | null;
  engineName: string;
  transmissionType: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ECUType =
  | "ENGINE_ECU"
  | "TRANSMISSION_TCU"
  | "BODY_BCM"
  | "ABS_MODULE"
  | "AIRBAG_MODULE";

export interface ECURecord {
  id: string;
  vehicleId: string;
  ecu_type: ECUType;
  manufacturer: string;
  model: string;
  partNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FirmwareStatus = "STOCK" | "TUNED" | "CUSTOM";

export interface FirmwareFileRecord {
  id: string;
  ecuId: string | null;
  fileName: string;
  fileHash: string;
  fileSizeBytes: bigint;
  fileUrl: string;
  status: FirmwareStatus;
  description: string | null;
  price: number;
  purchaseCount: number;
  version: string;
  uploadedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
}

// ============================================
// IMMO-OFF REQUEST TYPES
// ============================================

export type ImmoRequestStatus =
  | "PENDING_UPLOAD"
  | "PROCESSING"
  | "READY_FOR_DOWNLOAD"
  | "DOWNLOADED"
  | "COMPLETED"
  | "CANCELLED";

export interface ImmoRequestRecord {
  id: string;
  userId: string;
  vehicleId: string;
  status: ImmoRequestStatus;
  stockFileId: string | null;
  adminNotes: string | null;
  modifiedFileUrl: string | null;
  basePrice: number;
  discount: number;
  totalPrice: number;
  bundledPartIds: string[];
  downloadedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PARTS & INVENTORY TYPES
// ============================================

export type PartCategory =
  | "ENGINE_OILS"
  | "TRANSMISSION_FLUIDS"
  | "COOLANTS"
  | "BRAKE_PADS"
  | "FILTERS"
  | "SPARK_PLUGS"
  | "BELTS_HOSES"
  | "BATTERIES"
  | "ELECTRICAL"
  | "SUSPENSION"
  | "OTHER";

export interface PartRecord {
  id: string;
  sku: string;
  name: string;
  category: PartCategory;
  description: string | null;
  costPrice: number;
  retailPrice: number;
  totalStock: number;
  reservedStock: number;
  reorderLevel: number;
  manufacturer: string | null;
  oemNumber: string | null;
  weight: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartVariantRecord {
  id: string;
  partId: string;
  name: string;
  sku: string;
  priceAdjustment: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartCompatibilityRecord {
  id: string;
  partId: string;
  yearStart: number;
  yearEnd: number;
  make: string;
  model: string;
  engineType: string;
  notes: string | null;
  createdAt: Date;
}

export interface InventoryBatchRecord {
  id: string;
  partId: string;
  batchNumber: string;
  quantity: number;
  costPerUnit: number;
  warehouse: string;
  expiryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// ORDER & PAYMENT TYPES
// ============================================

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderRecord {
  id: string;
  userId: string;
  status: OrderStatus;
  orderNumber: string;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingProvince: string | null;
  shippingZip: string | null;
  trackingNumber: string | null;
  estimatedDelivery: Date | null;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt: Date | null;
}

export interface OrderItemRecord {
  id: string;
  orderId: string;
  partId: string | null;
  firmwareFileId: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
}

export type PaymentMethod = "STRIPE" | "GCASH" | "MAYA" | "BANK_TRANSFER";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface PaymentRecord {
  id: string;
  userId: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionId: string | null;
  stripePaymentIntentId: string | null;
  gcashReferenceId: string | null;
  mayaReferenceId: string | null;
  currency: string;
  webhookData: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SERVICE & APPOINTMENT TYPES
// ============================================

export type ServiceType =
  | "OIL_CHANGE"
  | "FILTER_REPLACEMENT"
  | "BRAKE_SERVICE"
  | "TIRE_SERVICE"
  | "TUNE_UP"
  | "DIAGNOSTICS"
  | "CUSTOM_TUNING"
  | "INSPECTION"
  | "OTHER";

export interface ServiceRecord {
  id: string;
  name: string;
  type: ServiceType;
  description: string | null;
  basePrice: number;
  estimatedDurationMinutes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BayRecord {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
  maxCapacity: number;
  operatingHoursStart: string;
  operatingHoursEnd: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface AppointmentRecord {
  id: string;
  userId: string;
  serviceId: string;
  bayId: string;
  status: AppointmentStatus;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart: Date | null;
  actualEnd: Date | null;
  mechanicNotes: string | null;
  customerNotes: string | null;
  photoUrls: string[];
  servicePrice: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// AUDIT LOGGING TYPES
// ============================================

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "DOWNLOAD"
  | "PAYMENT"
  | "IMMO_REQUEST_CREATED"
  | "IMMO_REQUEST_COMPLETED"
  | "INVENTORY_ADJUSTED"
  | "APPOINTMENT_CREATED"
  | "APPOINTMENT_COMPLETED";

export interface AuditLogRecord {
  id: string;
  action: AuditAction;
  userId: string | null;
  entityType: string;
  entityId: string;
  changes: string | null;
  createdAt: Date;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}

// ============================================
// REQUEST/FORM TYPES
// ============================================

export interface CreateVehicleInput {
  year: number;
  make: string;
  model: string;
  trim?: string;
  vin?: string;
  engineName: string;
  transmissionType: string;
}

export interface CreateImmoRequestInput {
  vehicleId: string;
  basePrice: number;
  discount?: number;
}

export interface UploadFirmwareInput {
  ecuId: string;
  file: File;
  status: FirmwareStatus;
  description?: string;
  version: string;
}

export interface CreatePartInput {
  sku: string;
  name: string;
  category: PartCategory;
  description?: string;
  costPrice: number;
  retailPrice: number;
  manufacturer?: string;
  oemNumber?: string;
}

export interface UpdateInventoryInput {
  partId: string;
  quantityChange: number; // Can be positive or negative
}

export interface CreateOrderInput {
  items: Array<{
    partId?: string;
    firmwareFileId?: string;
    quantity: number;
  }>;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingZip: string;
}

export interface CreateAppointmentInput {
  serviceId: string;
  bayId: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  customerNotes?: string;
  bookingMeta?: {
    identifierType?: "PLATE_NUMBER" | "CONDUCTION_STICKER";
    vehicleIdentifier?: string;
    serviceMode?: "SHOP_VISIT" | "HOME_SERVICE";
    paymentOption?: "GCASH" | "MAYA" | "CASH_AT_COUNTER" | "QR_PH";
    reservationFee?: number;
    branchCode?: string;
    preferredChannel?: "VIBER" | "MESSENGER" | "SMS";
    contactNumber?: string;
    photoReportingConsent?: boolean;
  };
}

// ============================================
// FILTER/QUERY TYPES
// ============================================

export interface PartFilterQuery {
  category?: PartCategory;
  year?: number;
  make?: string;
  model?: string;
  engineType?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "price" | "popularity" | "newest";
  sortOrder?: "asc" | "desc";
}

export interface AppointmentQueryParams {
  bayId?: string;
  serviceId?: string;
  status?: AppointmentStatus;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}
