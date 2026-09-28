import { NextRequest, NextResponse } from "next/server";
import { route } from "@/lib/api/route";
import { requireOperator } from "@/lib/auth/guard";
import { assignTripSchema } from "@/lib/trips/schemas";
import { assignTrip } from "@/lib/trips/service";

type Context = { params: Promise<{ id: string }> };

export const PATCH = route(async (req: NextRequest, ctx: Context) => {
  await requireOperator();
  const { id } = await ctx.params;
  const body = await req.json();
  const input = assignTripSchema.parse(body);
  const trip = await assignTrip(id, input);
  return NextResponse.json(trip);
});
