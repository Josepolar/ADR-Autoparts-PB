import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🌱 Starting database seed...");
    console.log("🗑️  Clearing existing data...");

    // Delete in order of foreign key constraints
    await prisma.appointment.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.bay.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.immoRequest.deleteMany({});
    await prisma.inventoryBatch.deleteMany({});
    await prisma.partCompatibility.deleteMany({});
    await prisma.partVariant.deleteMany({});
    await prisma.part.deleteMany({});
    await prisma.firmwareFile.deleteMany({});
    await (prisma as any).eCU.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("✅ Data cleared successfully!");
    console.log("📊 Database is ready for use");
    console.log("\n✨ Seed completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
