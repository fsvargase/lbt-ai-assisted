import { z } from "zod";

export const assignTripSchema = z.object({
  driverId: z.string().min(1),
  vehicleId: z.string().min(1),
});

export type AssignTripInput = z.infer<typeof assignTripSchema>;

export const updateTripStatusSchema = z.object({
  status: z.enum(["IN_PROGRESS", "COMPLETED"]),
});

export type UpdateTripStatusInput = z.infer<typeof updateTripStatusSchema>;
