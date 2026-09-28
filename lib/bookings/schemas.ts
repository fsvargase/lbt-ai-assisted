import { z } from "zod";

export const createBookingSchema = z
  .object({
    tripType: z.enum(["ONE_WAY", "ROUND_TRIP"]),
    originId: z.string().min(1),
    destinationId: z.string().min(1),
    outboundAt: z.string().datetime({ offset: true }),
    returnAt: z.string().datetime({ offset: true }).optional(),
  })
  .refine(
    (data) => data.originId !== data.destinationId,
    { message: "Origin and destination must differ", path: ["destinationId"] },
  )
  .refine(
    (data) => data.tripType === "ONE_WAY" || Boolean(data.returnAt),
    { message: "returnAt is required for a round trip", path: ["returnAt"] },
  )
  .refine(
    (data) =>
      data.tripType === "ONE_WAY" ||
      !data.returnAt ||
      new Date(data.returnAt) > new Date(data.outboundAt),
    { message: "returnAt must be after outboundAt", path: ["returnAt"] },
  );

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const setAgreedPriceSchema = z.object({
  agreedPrice: z.number().positive(),
});

export type SetAgreedPriceInput = z.infer<typeof setAgreedPriceSchema>;
