import { NextResponse } from "next/server";
import { route } from "@/lib/api/route";
import { forbidden } from "@/lib/api/errors";
import { requireDriver } from "@/lib/auth/guard";
import { listTripsForDriver } from "@/lib/trips/service";

export const GET = route(async () => {
  const user = await requireDriver();
  if (!user.driverId) throw forbidden("No driver profile for this user");

  const trips = await listTripsForDriver(user.driverId);
  return NextResponse.json(trips);
});
