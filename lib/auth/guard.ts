import { Role } from "@prisma/client";
import { forbidden, unauthorized } from "@/lib/api/errors";
import { getSafeSession } from "@/lib/auth/session";

export interface SessionUser {
  id: string;
  email: string;
  role: Role;
  customerId: string | null;
  driverId: string | null;
}

export async function requireUser(): Promise<SessionUser> {
  const session = await getSafeSession();
  if (!session?.user) throw unauthorized();
  const u = session.user;
  return {
    id: u.id,
    email: u.email ?? "",
    role: u.role,
    customerId: u.customerId,
    driverId: u.driverId,
  };
}

export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw forbidden();
  return user;
}

export const requireClient = () => requireRole(Role.CLIENT);
export const requireOperator = () => requireRole(Role.OPERATOR, Role.ADMIN);
export const requireDriver = () => requireRole(Role.DRIVER);
