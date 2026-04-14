import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const sc = await db.service.count();
  const bc = await db.bay.count();
  const uc = await db.user.count();
  console.log(`Services: ${sc}, Bays: ${bc}, Users: ${uc}`);

  if (sc === 0) {
    console.log("Seeding services...");
    await db.service.createMany({
      data: [
        { name: "Change Oil Package (PMS)", type: "OIL_CHANGE", description: "Complete oil and filter change with multi-point inspection", basePrice: 1500, estimatedDurationMinutes: 30 },
        { name: "Full Diagnostics", type: "DIAGNOSTICS", description: "Complete vehicle diagnostics with ECU scan", basePrice: 2500, estimatedDurationMinutes: 60 },
        { name: "Custom ECU Tuning", type: "CUSTOM_TUNING", description: "High-performance ECU tuning service", basePrice: 8000, estimatedDurationMinutes: 120 },
        { name: "Brake Service", type: "BRAKE_SERVICE", description: "Brake pad replacement and brake fluid check", basePrice: 3500, estimatedDurationMinutes: 45 },
        { name: "Tire Rotation & Balancing", type: "TIRE_SERVICE", description: "Tire rotation, balancing, and pressure check", basePrice: 800, estimatedDurationMinutes: 30 },
        { name: "Aircon Check & Clean", type: "INSPECTION", description: "AC system check, cleaning, and refrigerant top-up", basePrice: 2000, estimatedDurationMinutes: 60 },
      ],
    });
    console.log("Services seeded!");
  }

  if (bc === 0) {
    console.log("Seeding bays...");
    await db.bay.createMany({
      data: [
        { name: "Bay 1", location: "Main Service Floor" },
        { name: "Bay 2", location: "Main Service Floor" },
        { name: "Bay 3", location: "Secondary Floor" },
      ],
    });
    console.log("Bays seeded!");
  }

  const finalSc = await db.service.count();
  const finalBc = await db.bay.count();
  console.log(`Final - Services: ${finalSc}, Bays: ${finalBc}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
