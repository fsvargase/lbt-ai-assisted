import { LocationKind, PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  // --- NYC Locations ---
  const locations: Array<{
    name: string;
    kind: LocationKind;
    code?: string;
    borough?: string;
  }> = [
    { name: "John F. Kennedy International Airport", kind: LocationKind.AIRPORT, code: "JFK" },
    { name: "LaGuardia Airport", kind: LocationKind.AIRPORT, code: "LGA" },
    { name: "Newark Liberty International Airport", kind: LocationKind.AIRPORT, code: "EWR" },
    { name: "Manhattan", kind: LocationKind.BOROUGH, borough: "Manhattan" },
    { name: "Brooklyn", kind: LocationKind.BOROUGH, borough: "Brooklyn" },
    { name: "Queens", kind: LocationKind.BOROUGH, borough: "Queens" },
    { name: "The Bronx", kind: LocationKind.BOROUGH, borough: "The Bronx" },
    { name: "Staten Island", kind: LocationKind.BOROUGH, borough: "Staten Island" },
  ];

  for (const loc of locations) {
    if (loc.code) {
      await prisma.location.upsert({
        where: { code: loc.code },
        update: {},
        create: loc,
      });
    } else {
      const existing = await prisma.location.findFirst({ where: { name: loc.name } });
      if (!existing) await prisma.location.create({ data: loc });
    }
  }

  // --- Vehicles ---
  await prisma.vehicle.upsert({
    where: { plate: "LUX-001" },
    update: {},
    create: { label: "Mercedes S-Class", vehicleClass: "SEDAN", plate: "LUX-001", capacity: 3 },
  });
  await prisma.vehicle.upsert({
    where: { plate: "LUX-002" },
    update: {},
    create: { label: "Cadillac Escalade", vehicleClass: "SUV", plate: "LUX-002", capacity: 6 },
  });

  // --- Users (dev credentials; password is "password123") ---
  const pw = hashPassword("password123");

  await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      email: "client@example.com",
      name: "Casey Client",
      role: Role.CLIENT,
      passwordHash: pw,
      customer: { create: { phone: "+1-212-555-0100" } },
    },
  });

  await prisma.user.upsert({
    where: { email: "operator@example.com" },
    update: {},
    create: {
      email: "operator@example.com",
      name: "Olivia Operator",
      role: Role.OPERATOR,
      passwordHash: pw,
    },
  });

  await prisma.user.upsert({
    where: { email: "driver.a@example.com" },
    update: {},
    create: {
      email: "driver.a@example.com",
      name: "Dana Driver",
      role: Role.DRIVER,
      passwordHash: pw,
      driver: { create: { phone: "+1-212-555-0201", licenseNumber: "NY-DRV-A" } },
    },
  });

  await prisma.user.upsert({
    where: { email: "driver.b@example.com" },
    update: {},
    create: {
      email: "driver.b@example.com",
      name: "Blake Driver",
      role: Role.DRIVER,
      passwordHash: pw,
      driver: { create: { phone: "+1-212-555-0202", licenseNumber: "NY-DRV-B" } },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
