import { NextRequest, NextResponse } from "next/server";
import { TripStatus } from "@prisma/client";
import { route } from "@/lib/api/route";
import { forbidden } from "@/lib/api/errors";
import { requireDriver } from "@/lib/auth/guard";
import { updateTripStatusSchema } from "@/lib/trips/schemas";
import { updateTripStatusForDriver } from "@/lib/trips/service";

type Context = { params: Promise<{ id: string }> };

export const PATCH = route(async (req: NextRequest, ctx: Context) => {
  const user = await requireDriver();
  if (!user.driverId) throw forbidden("No driver profile for this user");

  const { id } = await ctx.params;
  const body = await req.json();
  const { status } = updateTripStatusSchema.parse(body);
  const trip = await updateTripStatusForDriver(
    user.driverId,
    id,
    status as TripStatus,
  );
  return NextResponse.json(trip);
});
