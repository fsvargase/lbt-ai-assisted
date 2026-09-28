import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: Role;
    customerId: string | null;
    driverId: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      customerId: string | null;
      driverId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    customerId?: string | null;
    driverId?: string | null;
  }
}
