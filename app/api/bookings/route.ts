import { NextRequest, NextResponse } from "next/server";
import { route } from "@/lib/api/route";
import { badRequest, forbidden } from "@/lib/api/errors";
import { requireClient } from "@/lib/auth/guard";
import { getSafeSession } from "@/lib/auth/session";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { createBookingSchema } from "@/lib/bookings/schemas";
import {
  createBooking,
  listBookingsForCustomer,
} from "@/lib/bookings/service";

export const POST = route(async (req: NextRequest) => {
  const body = await req.json();
  const input = createBookingSchema.parse(body);

  const human = await verifyRecaptcha(input.recaptchaToken, {
    action: "booking",
  });
  if (!human) throw badRequest("reCAPTCHA verification failed");

  const session = await getSafeSession();
  const customerId = session?.user?.customerId ?? null;

  const booking = await createBooking(customerId, input);
  return NextResponse.json(booking, { status: 201 });
});

export const GET = route(async () => {
  const user = await requireClient();
  if (!user.customerId) throw forbidden("No customer profile for this user");

  const bookings = await listBookingsForCustomer(user.customerId);
  return NextResponse.json(bookings);
});
