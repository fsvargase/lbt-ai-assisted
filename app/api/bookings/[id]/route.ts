import { NextResponse } from "next/server";
import { route } from "@/lib/api/route";
import { forbidden } from "@/lib/api/errors";
import { requireClient } from "@/lib/auth/guard";
import { getBookingForCustomer } from "@/lib/bookings/service";

type Context = { params: Promise<{ id: string }> };

export const GET = route(async (_req: Request, ctx: Context) => {
  const user = await requireClient();
  if (!user.customerId) throw forbidden("No customer profile for this user");

  const { id } = await ctx.params;
  const booking = await getBookingForCustomer(user.customerId, id);
  return NextResponse.json(booking);
});
