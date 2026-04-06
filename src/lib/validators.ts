/**
 * Zod validation schemas for forms and API requests
 */

import { z } from "zod";

// ============================================
// AUTH SCHEMAS
// ============================================

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  zipCode: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ============================================
// VEHICLE SCHEMAS
// ============================================

export const createVehicleSchema = z.object({
  year: z.number().min(1990).max(2050),
  make: z.string().min(1),
  model: z.string().min(1),
  trim: z.string().optional(),
  vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/).optional(),
  engineName: z.string().min(1),
  transmissionType: z.enum(["Manual", "Automatic", "CVT"]),
});

// ============================================
// PARTS SCHEMAS
// ============================================

export const createPartSchema = z.object({
  sku: z.string().min(1).max(50),
  name: z.string().min(1).max(255),
  category: z.enum([
    "ENGINE_OILS",
    "TRANSMISSION_FLUIDS",
    "COOLANTS",
    "BRAKE_PADS",
    "FILTERS",
    "SPARK_PLUGS",
    "BELTS_HOSES",
    "BATTERIES",
    "ELECTRICAL",
    "SUSPENSION",
    "OTHER",
  ]),
  description: z.string().optional(),
  costPrice: z.number().positive(),
  retailPrice: z.number().positive(),
  manufacturer: z.string().optional(),
  oemNumber: z.string().optional(),
});

export const updatePartSchema = createPartSchema.partial();

// ============================================
// ORDER SCHEMAS
// ============================================

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      partId: z.string().optional(),
      firmwareFileId: z.string().optional(),
      quantity: z.number().min(1),
    })
  ),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(1),
  shippingProvince: z.string().min(1),
  shippingZip: z.string().regex(/^\d{4}$/),
});

// ============================================
// SERVICE & APPOINTMENT SCHEMAS
// ============================================

export const createAppointmentSchema = z.object({
  serviceId: z.string(),
  bayId: z.string(),
  scheduledStart: z.date(),
  scheduledEnd: z.date(),
  customerNotes: z.string().optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum([
    "SCHEDULED",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
  ]),
  mechanicNotes: z.string().optional(),
});

// ============================================
// IMMO-OFF REQUEST SCHEMAS
// ============================================

export const createImmoRequestSchema = z.object({
  vehicleId: z.string(),
  basePrice: z.number().positive(),
  discount: z.number().nonnegative().optional(),
});

export const updateImmoRequestSchema = z.object({
  status: z.enum([
    "PENDING_UPLOAD",
    "PROCESSING",
    "READY_FOR_DOWNLOAD",
    "DOWNLOADED",
    "COMPLETED",
    "CANCELLED",
  ]),
  adminNotes: z.string().optional(),
});

// ============================================
// PAYMENT SCHEMAS
// ============================================

export const stripeWebhookSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.record(z.unknown()),
  }),
});

// ============================================
// INVENTORY SCHEMAS
// ============================================

export const updateInventorySchema = z.object({
  partId: z.string(),
  quantityChange: z.number(),
});

export const createInventoryBatchSchema = z.object({
  partId: z.string(),
  batchNumber: z.string(),
  quantity: z.number().positive(),
  costPerUnit: z.number().positive(),
  warehouse: z.string(),
  expiryDate: z.date().optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type CreatePartInput = z.infer<typeof createPartSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type CreateImmoRequestInput = z.infer<typeof createImmoRequestSchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
