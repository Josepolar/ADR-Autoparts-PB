"use server";

import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { Decimal } from "@prisma/client/runtime/library";

// Convert Prisma Decimal and BigInt objects to plain numbers so data can cross
// the Server→Client Component boundary in Next.js.
function serialize<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) => {
      if (value instanceof Decimal) return value.toNumber();
      if (typeof value === "bigint") return Number(value);
      return value;
    })
  ) as T;
}

// ============================================
// FIRMWARE / AUTO ECU ACTIONS
// ============================================

export async function getFirmwareFiles() {
  try {
    const files = await db.firmwareFile.findMany({
      include: {
        ecu: {
          include: {
            vehicle: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return {
      success: true,
      data: serialize(files),
    };
  } catch (error) {
    console.error("Error fetching firmware files:", error);
    return {
      success: false,
      error: "Failed to fetch firmware files",
    };
  }
}

export async function getImmoRequests() {
  try {
    const requests = await db.immoRequest.findMany({
      include: {
        user: true,
        vehicle: true,
        stockFile: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return {
      success: true,
      data: serialize(requests),
    };
  } catch (error) {
    console.error("Error fetching immo requests:", error);
    return {
      success: false,
      error: "Failed to fetch immo requests",
    };
  }
}

// ============================================
// PARTS / E-COMMERCE ACTIONS
// ============================================

export async function createPart(data: {
  name: string;
  sku: string;
  description?: string;
  category: string;
  costPrice: number;
  retailPrice: number;
  totalStock: number;
  manufacturer?: string;
  imageUrl?: string;
}) {
  try {
    const part = await db.part.create({
      data: {
        name: data.name,
        sku: data.sku,
        description: data.description || null,
        category: data.category as any,
        costPrice: data.costPrice,
        retailPrice: data.retailPrice,
        totalStock: data.totalStock,
        manufacturer: data.manufacturer || null,
        imageUrl: data.imageUrl || null,
      },
    });
    revalidatePath("/parts");
    revalidatePath("/admin");
    revalidatePath("/staff");
    return { success: true, data: serialize(part) };
  } catch (error) {
    console.error("Error creating part:", error);
    return { success: false, error: "Failed to create part" };
  }
}

export async function updatePart(
  id: string,
  data: {
    name?: string;
    sku?: string;
    description?: string;
    category?: string;
    costPrice?: number;
    retailPrice?: number;
    totalStock?: number;
    manufacturer?: string;
    imageUrl?: string | null;
  }
) {
  try {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.costPrice !== undefined) updateData.costPrice = data.costPrice;
    if (data.retailPrice !== undefined) updateData.retailPrice = data.retailPrice;
    if (data.totalStock !== undefined) updateData.totalStock = data.totalStock;
    if (data.manufacturer !== undefined) updateData.manufacturer = data.manufacturer || null;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    const part = await db.part.update({
      where: { id },
      data: updateData,
    });
    revalidatePath("/parts");
    revalidatePath("/admin");
    revalidatePath("/staff");
    return { success: true, data: serialize(part) };
  } catch (error) {
    console.error("Error updating part:", error);
    return { success: false, error: "Failed to update part" };
  }
}

export async function deletePart(id: string) {
  try {
    await db.part.delete({ where: { id } });
    revalidatePath("/parts");
    revalidatePath("/admin");
    revalidatePath("/staff");
    return { success: true };
  } catch (error) {
    console.error("Error deleting part:", error);
    return { success: false, error: "Failed to delete part" };
  }
}

export async function getParts(filters?: { category?: string; search?: string }) {
  try {
    const parts = await db.part.findMany({
      where: {
        ...(filters?.category && { category: filters.category as any }),
        ...(filters?.search && {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" } },
            { sku: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        variants: true,
      },
      orderBy: { name: "asc" },
    });
    return {
      success: true,
      data: serialize(parts),
    };
  } catch (error) {
    console.error("Error fetching parts:", error);
    return {
      success: false,
      error: "Failed to fetch parts",
    };
  }
}

export async function getPartById(id: string) {
  try {
    const part = await db.part.findUnique({
      where: { id },
      include: {
        variants: true,
        compatibility: true,
      },
    });
    if (!part) {
      return {
        success: false,
        error: "Part not found",
      };
    }
    return {
      success: true,
      data: serialize(part),
    };
  } catch (error) {
    console.error("Error fetching part:", error);
    return {
      success: false,
      error: "Failed to fetch part",
    };
  }
}

// ============================================
// APPOINTMENTS / RAPIDE ACTIONS
// ============================================

export async function getServices() {
  try {
    let services = await db.service.findMany({
      orderBy: { name: "asc" },
    });

    // Auto-seed default services when table is empty
    if (services.length === 0) {
      await db.service.createMany({
        data: [
          { name: "Change Oil Package (PMS)", type: "OIL_CHANGE" as any, description: "Complete oil and filter change with multi-point inspection", basePrice: 1500, estimatedDurationMinutes: 30 },
          { name: "Full Diagnostics", type: "DIAGNOSTICS" as any, description: "Complete vehicle diagnostics with ECU scan", basePrice: 2500, estimatedDurationMinutes: 60 },
          { name: "Custom ECU Tuning", type: "CUSTOM_TUNING" as any, description: "High-performance ECU tuning service", basePrice: 8000, estimatedDurationMinutes: 120 },
          { name: "Brake Service", type: "BRAKE_SERVICE" as any, description: "Brake pad replacement and brake fluid check", basePrice: 3500, estimatedDurationMinutes: 45 },
          { name: "Tire Rotation & Balancing", type: "TIRE_SERVICE" as any, description: "Tire rotation, balancing, and pressure check", basePrice: 800, estimatedDurationMinutes: 30 },
          { name: "Aircon Check & Clean", type: "INSPECTION" as any, description: "AC system check, cleaning, and refrigerant top-up", basePrice: 2000, estimatedDurationMinutes: 60 },
        ],
      });
      services = await db.service.findMany({ orderBy: { name: "asc" } });
    }

    return {
      success: true,
      data: serialize(services),
    };
  } catch (error) {
    console.error("Error fetching services:", error);
    return {
      success: false,
      error: "Failed to fetch services",
    };
  }
}

export async function getAvailableBays(_serviceId: string, date: Date | string) {
  try {
    // Safely reconstruct date to avoid serialization issues across server action boundary
    const dateObj = new Date(date);
    const startOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59, 999);

    let bays = await db.bay.findMany({
      include: {
        appointments: {
          where: {
            scheduledStart: {
              gte: startOfDay,
              lt: endOfDay,
            },
          },
        },
      },
    });

    // Auto-create default bays when table is empty
    if (bays.length === 0) {
      await db.bay.createMany({
        data: [
          { name: "Bay 1", location: "ADR Santa Maria Branch" },
          { name: "Bay 2", location: "ADR Santa Maria Branch" },
          { name: "Bay 1", location: "ADR Antipolo Branch" },
          { name: "Bay 2", location: "ADR Antipolo Branch" },
        ],
      });
      bays = await db.bay.findMany({
        include: {
          appointments: {
            where: {
              scheduledStart: { gte: startOfDay, lt: endOfDay },
            },
          },
        },
      });
    }

    const availableBays = bays.map((bay) => ({
      ...bay,
      isAvailable: bay.appointments.length === 0,
    }));

    return {
      success: true,
      data: serialize(availableBays),
    };
  } catch (error) {
    console.error("Error fetching available bays:", error);
    return {
      success: false,
      error: "Failed to fetch available bays",
    };
  }
}

export async function getAppointments(userId?: string) {
  try {
    const appointments = await db.appointment.findMany({
      where: {
        ...(userId && { userId }),
      },
      include: {
        user: true,
        service: true,
        bay: true,
      },
      orderBy: { scheduledStart: "desc" },
    });
    return {
      success: true,
      data: serialize(appointments),
    };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return {
      success: false,
      error: "Failed to fetch appointments",
    };
  }
}

export async function createAppointment(data: {
  userEmail: string;
  serviceId: string;
  bayId: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  customerNotes?: string;
  bookingMeta?: Record<string, unknown>;
}) {
  try {
    // Resolve user by email (never trust client-supplied IDs)
    const user = await db.user.findUnique({
      where: { email: data.userEmail },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Get service to get the price
    const service = await db.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      return {
        success: false,
        error: "Service not found",
      };
    }

    const appointment = await db.appointment.create({
      data: {
        userId: user.id,
        serviceId: data.serviceId,
        bayId: data.bayId,
        scheduledStart: data.scheduledStart,
        scheduledEnd: data.scheduledEnd,
        customerNotes: data.bookingMeta
          ? JSON.stringify({
              note: data.customerNotes || "",
              meta: data.bookingMeta,
            })
          : data.customerNotes,
        servicePrice: service.basePrice,
        status: "SCHEDULED",
      },
    });
    revalidatePath("/rapide");
    return {
      success: true,
      data: serialize(appointment),
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return {
      success: false,
      error: "Failed to create appointment",
    };
  }
}

// ============================================
// ADMIN DASHBOARD ACTIONS
// ============================================

export async function getAdminStats() {
  try {
    const [totalUsers, totalOrders, totalRevenue, pendingImmoRequests] = await Promise.all([
      db.user.count(),
      db.order.count(),
      db.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      db.immoRequest.count({
        where: { status: "PENDING_UPLOAD" },
      }),
    ]);

    return {
      success: true,
      data: serialize({
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingImmoRequests,
      }),
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      success: false,
      error: "Failed to fetch admin stats",
    };
  }
}

export async function getOrdersData() {
  try {
    const orders = await db.order.findMany({
      include: {
        user: true,
        items: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return {
      success: true,
      data: serialize(orders),
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error: "Failed to fetch orders",
    };
  }
}

export async function getInventoryData() {
  try {
    const inventory = await db.part.findMany({
      include: {
        variants: true,
        inventoryBatches: true,
      },
      orderBy: { name: "asc" },
    });
    return {
      success: true,
      data: serialize(inventory),
    };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return {
      success: false,
      error: "Failed to fetch inventory",
    };
  }
}

export async function updatePartStock(partId: string, quantity: number) {
  try {
    const part = await db.part.update({
      where: { id: partId },
      data: {
        totalStock: {
          increment: quantity,
        },
      },
    });
    revalidatePath("/admin/inventory");
    return {
      success: true,
      data: serialize(part),
    };
  } catch (error) {
    console.error("Error updating part stock:", error);
    return {
      success: false,
      error: "Failed to update part stock",
    };
  }
}

export async function getAuditLogs() {
  try {
    const logs = await db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return {
      success: true,
      data: serialize(logs),
    };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return {
      success: false,
      error: "Failed to fetch audit logs",
    };
  }
}

// ============================================
// STAFF MANAGEMENT ACTIONS (Admin Only)
// ============================================

export async function getStaffUsers() {
  try {
    const staff = await db.user.findMany({
      where: { role: "MECHANIC" },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
        verifiedAt: true,
        verifiedBy: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: serialize(staff) };
  } catch (error) {
    console.error("Error fetching staff users:", error);
    return { success: false, error: "Failed to fetch staff users" };
  }
}

export async function createStaffUser(data: {
  name: string;
  email: string;
  password: string;
  adminEmail: string;
}) {
  try {
    const bcrypt = await import("bcryptjs");

    // Check admin is valid
    const admin = await db.user.findUnique({ where: { email: data.adminEmail } });
    if (!admin || admin.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Check if email already taken
    const existing = await db.user.findUnique({ where: { email: data.email.toLowerCase().trim() } });
    if (existing) {
      return { success: false, error: "Email already in use" };
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const staff = await db.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase().trim(),
        passwordHash,
        role: "MECHANIC",
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: data.adminEmail,
      },
    });

    revalidatePath("/admin");
    return {
      success: true,
      data: serialize({ id: staff.id, name: staff.name, email: staff.email }),
    };
  } catch (error) {
    console.error("Error creating staff user:", error);
    return { success: false, error: "Failed to create staff user" };
  }
}

export async function verifyStaffUser(staffId: string, adminEmail: string) {
  try {
    const admin = await db.user.findUnique({ where: { email: adminEmail } });
    if (!admin || admin.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const staff = await db.user.update({
      where: { id: staffId },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: adminEmail,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: serialize({ id: staff.id, email: staff.email }) };
  } catch (error) {
    console.error("Error verifying staff user:", error);
    return { success: false, error: "Failed to verify staff user" };
  }
}

export async function revokeStaffUser(staffId: string, adminEmail: string) {
  try {
    const admin = await db.user.findUnique({ where: { email: adminEmail } });
    if (!admin || admin.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const staff = await db.user.update({
      where: { id: staffId },
      data: {
        isVerified: false,
        verifiedAt: null,
        verifiedBy: null,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: serialize({ id: staff.id, email: staff.email }) };
  } catch (error) {
    console.error("Error revoking staff user:", error);
    return { success: false, error: "Failed to revoke staff user" };
  }
}

export async function deleteStaffUser(staffId: string, adminEmail: string) {
  try {
    const admin = await db.user.findUnique({ where: { email: adminEmail } });
    if (!admin || admin.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Ensure the target is a staff/mechanic user
    const staff = await db.user.findUnique({ where: { id: staffId } });
    if (!staff || staff.role !== "MECHANIC") {
      return { success: false, error: "User is not a staff member" };
    }

    await db.user.delete({ where: { id: staffId } });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting staff user:", error);
    return { success: false, error: "Failed to delete staff user" };
  }
}

// ============================================
// QUOTATION ACTIONS
// ============================================

export async function getQuotations() {
  try {
    const quotations = await db.quotation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: serialize(quotations) };
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return { success: false, error: "Failed to fetch quotations", data: [] };
  }
}

export async function approveQuotation(quotationId: string, notes: string, reviewerId: string) {
  try {
    const quotation = await db.quotation.update({
      where: { id: quotationId },
      data: {
        status: "APPROVED",
        adminNotes: notes,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });

    revalidatePath("/admin");
    revalidatePath("/staff");
    return { success: true, data: serialize(quotation) };
  } catch (error) {
    console.error("Error approving quotation:", error);
    return { success: false, error: "Failed to approve quotation" };
  }
}

export async function rejectQuotation(quotationId: string, notes: string, reviewerId: string) {
  try {
    const quotation = await db.quotation.update({
      where: { id: quotationId },
      data: {
        status: "REJECTED",
        adminNotes: notes,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });

    revalidatePath("/admin");
    revalidatePath("/staff");
    return { success: true, data: serialize(quotation) };
  } catch (error) {
    console.error("Error rejecting quotation:", error);
    return { success: false, error: "Failed to reject quotation" };
  }
}

// ============================================
// BOOKING ACTIONS
// ============================================

export async function getBookings() {
  try {
    const bookings = await db.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: serialize(bookings) };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, error: "Failed to fetch bookings", data: [] };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED",
  notes: string,
  reviewerId: string
) {
  try {
    const booking = await db.booking.update({
      where: { id: bookingId },
      data: {
        status,
        adminNotes: notes,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });

    revalidatePath("/admin");
    revalidatePath("/staff");
    return { success: true, data: serialize(booking) };
  } catch (error) {
    console.error("Error updating booking:", error);
    return { success: false, error: "Failed to update booking" };
  }
}

// ============================================
// NOTIFICATION ACTIONS
// ============================================

export async function getNotifications(role: "ADMIN" | "MECHANIC") {
  try {
    const notifications = await db.notification.findMany({
      where: { forRole: role },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    return { success: true, data: serialize(notifications) };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: "Failed to fetch notifications", data: [] };
  }
}

export async function markNotificationRead(notificationId: string) {
  try {
    await db.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error) {
    console.error("Error marking notification read:", error);
    return { success: false, error: "Failed to update notification" };
  }
}

export async function markAllNotificationsRead(role: "ADMIN" | "MECHANIC") {
  try {
    await db.notification.updateMany({
      where: { forRole: role, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error) {
    console.error("Error marking notifications read:", error);
    return { success: false, error: "Failed to update notifications" };
  }
}
