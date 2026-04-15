import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Delete old bays that have no appointments
  const bays = await db.bay.findMany({ include: { appointments: true } });
  console.log("Current bays:", bays.map(b => ({ id: b.id, name: b.name, location: b.location, appts: b.appointments.length })));

  // Update location for existing bays or delete and re-seed
  for (const bay of bays) {
    if (bay.appointments.length === 0) {
      await db.bay.delete({ where: { id: bay.id } });
      console.log(`Deleted bay: ${bay.name} (${bay.location})`);
    } else {
      // Update location to new branch name
      await db.bay.update({
        where: { id: bay.id },
        data: { location: "ADR Santa Maria Branch" },
      });
      console.log(`Updated bay: ${bay.name} -> ADR Santa Maria Branch`);
    }
  }

  // Create new bays
  await db.bay.createMany({
    data: [
      { name: "Bay 1", location: "ADR Santa Maria Branch" },
      { name: "Bay 2", location: "ADR Santa Maria Branch" },
      { name: "Bay 1", location: "ADR Antipolo Branch" },
      { name: "Bay 2", location: "ADR Antipolo Branch" },
    ],
  });
  console.log("Created 4 new bays (2 per branch)");

  const final = await db.bay.findMany();
  console.log("Final bays:", final.map(b => ({ name: b.name, location: b.location })));
}

main()
  .then(() => db.$disconnect())
  .catch((e) => { console.error(e); db.$disconnect(); process.exit(1); });
