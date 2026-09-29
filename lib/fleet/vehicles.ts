/**
 * High-end vehicle data representing the platform's fleet.
 * Keep in sync with seeded database records defined in prisma/seed.ts.
 */

export interface FleetVehicle {
  slug: string;
  label: string;          // "Mercedes S-Class" or "Cadillac Escalade"
  vehicleClass: "SEDAN" | "SUV";
  capacity: number;       // Passenger capacity
  luggage: number;        // Luggage piece capacity
  comfort: string;        // "First Class" or "Premium"
  imageUrl?: string;
  testId: string;
}

export const FLEET: FleetVehicle[] = [
  {
    slug: "mercedes-s-class",
    label: "Mercedes S-Class",
    vehicleClass: "SEDAN",
    capacity: 3,
    luggage: 3,
    comfort: "First Class Luxury",
    testId: "fleet-mercedes-s-class",
  },
  {
    slug: "cadillac-escalade",
    label: "Cadillac Escalade",
    vehicleClass: "SUV",
    capacity: 6,
    luggage: 6,
    comfort: "Premium Utility Luxury",
    testId: "fleet-cadillac-escalade",
  },
];
