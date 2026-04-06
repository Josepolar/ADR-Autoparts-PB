/* @ts-nocheck */
/*
  Prisma Seed Script
  Usage: npm run db:seed
  
  This file populates database with initial data for development & testing.
  WARNING: This will clear and repopulate data in development only.
*/

import { db } from "../src/server/db";

async function main() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data (development only!)
    console.log("🗑️  Clearing existing data...");
    
    // Delete in order of foreign key constraints
    await db.appointment.deleteMany({});
    await db.service.deleteMany({});
    await db.bay.deleteMany({});
    await db.auditLog.deleteMany({});
    await db.payment.deleteMany({});
    await db.orderItem.deleteMany({});
    await db.order.deleteMany({});
    await db.immoRequest.deleteMany({});
    await db.inventoryBatch.deleteMany({});
    await db.partCompatibility.deleteMany({});
    await db.partVariant.deleteMany({});
    await db.part.deleteMany({});
    await db.firmwareFile.deleteMany({});
    await (db as any).eCU.deleteMany({});
    await db.vehicle.deleteMany({});
    await db.user.deleteMany({});

    // ============================================
    // SAMPLE USERS
    // ============================================
    console.log("👥 Creating sample users...");
    
    const adminUser = await db.user.create({
      data: {
        email: "admin@adr-autoparts.com",
        name: "Admin User",
        passwordHash: "admin123", // TODO: Hash in production
        role: "ADMIN",
        phone: "+639175551234",
      },
    });

    const mechanicUser = await db.user.create({
      data: {
        email: "mechanic@adr-autoparts.com",
        name: "John Mechanic",
        passwordHash: "mechanic123", // TODO: Hash in production
        role: "MECHANIC",
        phone: "+639175555678",
      },
    });

    const customer1 = await db.user.create({
      data: {
        email: "customer1@example.com",
        name: "Maria Santos",
        passwordHash: "customer123", // TODO: Hash in production
        role: "CUSTOMER",
        phone: "+639175559999",
        address: "123 Main St",
        city: "Manila",
        province: "Metro Manila",
        zipCode: "1000",
      },
    });

    const customer2 = await db.user.create({
      data: {
        email: "customer2@example.com",
        name: "Juan Cruz",
        passwordHash: "customer123",
        role: "CUSTOMER",
        phone: "+639175558888",
        address: "456 Oak Ave",
        city: "Quezon City",
        province: "Metro Manila",
        zipCode: "1100",
      },
    });

    console.log("✓ Created 4 users");

    // ============================================
    // SAMPLE VEHICLES & ECUS
    // ============================================
    console.log("🚗 Creating sample vehicles & ECUs...");

    const vehicle1 = await db.vehicle.create({
      data: {
        userId: customer1.id,
        year: 2020,
        make: "Toyota",
        model: "Hiace",
        engineName: "2.8L Diesel",
        transmissionType: "Manual",
        trim: "Commuter",
        vin: "TMBJF78LX12345678",
      },
    });

    const vehicle2 = await db.vehicle.create({
      data: {
        userId: customer2.id,
        year: 2019,
        make: "Mitsubishi",
        model: "Strada",
        engineName: "2.4L Diesel",
        transmissionType: "Automatic",
        trim: "GLS",
        vin: "MMBJF52MM87654321",
      },
    });

    const ecu1 = await db.ecu.create({
      data: {
        vehicleId: vehicle1.id,
        ecu_type: "ENGINE_ECU",
        manufacturer: "Bosch",
        model: "EDC17C64",
        partNumber: "89123-45678",
      },
    });

    const ecu2 = await db.ecu.create({
      data: {
        vehicleId: vehicle2.id,
        ecu_type: "TRANSMISSION_TCU",
        manufacturer: "Continental",
        model: "TCU-M3",
        partNumber: "SP542200",
      },
    });

    console.log("✓ Created 2 vehicles with ECUs");

    // ============================================
    // SAMPLE FIRMWARE FILES
    // ============================================
    console.log("📦 Creating sample firmware files...");

    const firmware1 = await db.firmwareFile.create({
      data: {
        ecuId: ecu1.id,
        fileName: "hiace_2.8d_stage1.bin",
        fileHash:
          "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        fileSizeBytes: BigInt(512000),
        fileUrl: "https://adr-autoparts.s3.amazonaws.com/firmware/hiace_stage1.bin.enc",
        status: "TUNED",
        description: "Stage 1 ECU tune for Toyota Hiace 2.8L Diesel",
        price: 8500,
        version: "v1.0",
        uploadedBy: "adr-admin",
      },
    });

    const firmware2 = await db.firmwareFile.create({
      data: {
        ecuId: ecu2.id,
        fileName: "mitsubishi_tcm_stock.bin",
        fileHash:
          "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        fileSizeBytes: BigInt(256000),
        fileUrl: "https://adr-autoparts.s3.amazonaws.com/firmware/mitsu_tcm.bin.enc",
        status: "STOCK",
        description: "Original Mitsubishi TCM firmware",
        price: 5000,
        version: "v2.1",
        uploadedBy: "adr-admin",
      },
    });

    console.log("✓ Created 2 firmware files");

    // ============================================
    // SAMPLE PARTS
    // ============================================
    console.log("🛠️  Creating sample parts...");

    const part1 = await db.part.create({
      data: {
        sku: "OIL-MOBIL-5W30-1L",
        name: "Mobil Ultra 5W-30 Engine Oil",
        category: "ENGINE_OILS",
        description: "Synthetic premium engine oil for modern vehicles",
        costPrice: 350,
        retailPrice: 550,
        totalStock: 50,
        manufacturer: "ExxonMobil",
        weight: 1.0,
      },
    });

    const part2 = await db.part.create({
      data: {
        sku: "FILT-BOSCH-OIL-2",
        name: "Bosch P3202 Oil Filter",
        category: "FILTERS",
        description: "Premium oil filter",
        costPrice: 250,
        retailPrice: 450,
        totalStock: 75,
        manufacturer: "Bosch",
      },
    });

    const part3 = await db.part.create({
      data: {
        sku: "SPARK-NGK-IRIDIUM",
        name: "NGK Iridium Spark Plugs (Set of 4)",
        category: "SPARK_PLUGS",
        description: "Long-life iridium spark plugs",
        costPrice: 800,
        retailPrice: 1400,
        totalStock: 30,
        manufacturer: "NGK",
      },
    });

    console.log("✓ Created 3 parts");

    // ============================================
    // SAMPLE PART VARIANTS
    // ============================================
    console.log("🔀 Creating part variants...");

    await db.partVariant.create({
      data: {
        partId: part1.id,
        name: "1L",
        sku: "OIL-MOBIL-5W30-1L",
      },
    });

    await db.partVariant.create({
      data: {
        partId: part1.id,
        name: "4L",
        sku: "OIL-MOBIL-5W30-4L",
        priceAdjustment: 800,
      },
    });

    console.log("✓ Created part variants");

    // ============================================
    // SAMPLE PART COMPATIBILITY
    // ============================================
    console.log("🔗 Setting up part compatibility...");

    await db.partCompatibility.create({
      data: {
        partId: part1.id,
        yearStart: 2015,
        yearEnd: 2023,
        make: "Toyota",
        model: "Hiace",
        engineType: "2.8L Diesel",
      },
    });

    console.log("✓ Set up part compatibility");

    // ============================================
    // SAMPLE SERVICES & BAYS
    // ============================================
    console.log("🔧 Creating services & bays...");

    const service1 = await db.service.create({
      data: {
        name: "Oil Change",
        type: "OIL_CHANGE",
        description: "Complete oil and filter change",
        basePrice: 1500,
        estimatedDurationMinutes: 30,
      },
    });

    const service2 = await db.service.create({
      data: {
        name: "Full Diagnostics",
        type: "DIAGNOSTICS",
        description: "Complete vehicle diagnostics with ECU scan",
        basePrice: 2500,
        estimatedDurationMinutes: 60,
      },
    });

    const service3 = await db.service.create({
      data: {
        name: "Custom ECU Tuning",
        type: "CUSTOM_TUNING",
        description: "High-performance ECU tuning service",
        basePrice: 8000,
        estimatedDurationMinutes: 120,
      },
    });

    const bay1 = await db.bay.create({
      data: {
        name: "Bay 1",
        location: "Service Floor - Main",
        maxCapacity: 1,
        operatingHoursStart: "08:00",
        operatingHoursEnd: "18:00",
      },
    });

    const bay2 = await db.bay.create({
      data: {
        name: "Bay 2",
        location: "Service Floor - Main",
        maxCapacity: 1,
        operatingHoursStart: "08:00",
        operatingHoursEnd: "18:00",
      },
    });

    console.log("✓ Created 3 services & 2 bays");

    // ============================================
    // SAMPLE APPOINTMENT
    // ============================================
    console.log("📅 Creating sample appointment...");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startTime = new Date(tomorrow);
    startTime.setHours(10, 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 30); // 30 min service

    await db.appointment.create({
      data: {
        userId: customer1.id,
        serviceId: service1.id,
        bayId: bay1.id,
        status: "SCHEDULED",
        scheduledStart: startTime,
        scheduledEnd: endTime,
        servicePrice: service1.basePrice,
        customerNotes: "Please check brakes as well",
      },
    });

    console.log("✓ Created sample appointment");

    // ============================================
    // SAMPLE AUDIT LOG
    // ============================================
    console.log("📝 Creating audit log entry...");

    await db.auditLog.create({
      data: {
        action: "CREATE",
        userId: adminUser.id,
        entityType: "Database Seeding",
        entityId: "seed-001",
        changes: "Populated database with sample data for development",
      },
    });

    console.log("✓ Created audit log entry");

    console.log("\n✅ Database seeding complete!");
    console.log("\n📊 Summary of created records:");
    console.log(`  - Users: 4 (1 Admin, 1 Mechanic, 2 Customers)`);
    console.log(`  - Vehicles: 2`);
    console.log(`  - ECUs: 2`);
    console.log(`  - Firmware Files: 2`);
    console.log(`  - Parts: 3`);
    console.log(`  - Services: 3`);
    console.log(`  - Bays: 2`);
    console.log(`  - Appointments: 1`);

    console.log("\n🔐 Test Credentials:");
    console.log(`  Admin:    admin@adr-autoparts.com / admin123`);
    console.log(`  Mechanic: mechanic@adr-autoparts.com / mechanic123`);
    console.log(`  Customer: customer1@example.com / customer123`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
