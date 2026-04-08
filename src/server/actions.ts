"use server";

import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

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
      data: files,
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
      data: requests,
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
      data: parts,
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
      data: part,
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
    const services = await db.service.findMany({
      orderBy: { name: "asc" },
    });
    return {
      success: true,
      data: services,
    };
  } catch (error) {
    console.error("Error fetching services:", error);
    return {
      success: false,
      error: "Failed to fetch services",
    };
  }
}

export async function getAvailableBays(_serviceId: string, date: Date) {
  try {
    const bays = await db.bay.findMany({
      include: {
        appointments: {
          where: {
            scheduledStart: {
              gte: new Date(date.setHours(0, 0, 0, 0)),
              lt: new Date(date.setHours(23, 59, 59, 999)),
            },
          },
        },
      },
    });

    const availableBays = bays.map((bay) => ({
      ...bay,
      isAvailable: bay.appointments.length === 0,
    }));

    return {
      success: true,
      data: availableBays,
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
      data: appointments,
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
  userId: string;
  serviceId: string;
  bayId: string;
  scheduledStart: Date;
  scheduledEnd: Date;
}) {
  try {
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
        userId: data.userId,
        serviceId: data.serviceId,
        bayId: data.bayId,
        scheduledStart: data.scheduledStart,
        scheduledEnd: data.scheduledEnd,
        servicePrice: service.basePrice,
        status: "SCHEDULED",
      },
    });
    revalidatePath("/rapide");
    return {
      success: true,
      data: appointment,
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
      data: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingImmoRequests,
      },
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
      data: orders,
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
      data: inventory,
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
      data: part,
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
      data: logs,
    };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return {
      success: false,
      error: "Failed to fetch audit logs",
    };
  }
}
