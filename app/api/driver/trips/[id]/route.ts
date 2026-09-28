import { NextResponse } from "next/server";
import { route } from "@/lib/api/route";
import { forbidden } from "@/lib/api/errors";
import { requireDriver } from "@/lib/auth/guard";
import { getTripForDriver } from "@/lib/trips/service";

type Context = { params: Promise<{ id: string }> };

export const GET = route(async (_req: Request, ctx: Context) => {
  const user = await requireDriver();
  if (!user.driverId) throw forbidden("No driver profile for this user");

  const { id } = await ctx.params;
  const trip = await getTripForDriver(user.driverId, id);
  return NextResponse.json(trip);
});
