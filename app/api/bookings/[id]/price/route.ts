import { NextRequest, NextResponse } from "next/server";
import { route } from "@/lib/api/route";
import { requireOperator } from "@/lib/auth/guard";
import { setAgreedPriceSchema } from "@/lib/bookings/schemas";
import { setAgreedPrice } from "@/lib/bookings/service";

type Context = { params: Promise<{ id: string }> };

export const PATCH = route(async (req: NextRequest, ctx: Context) => {
  await requireOperator();
  const { id } = await ctx.params;
  const body = await req.json();
  const { agreedPrice } = setAgreedPriceSchema.parse(body);
  const booking = await setAgreedPrice(id, agreedPrice);
  return NextResponse.json(booking);
});
