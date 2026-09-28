import { Role } from "@prisma/client";

jest.mock("@/auth", () => ({ auth: jest.fn() }));

import { auth } from "@/auth";
import { requireClient, requireOperator, requireDriver } from "@/lib/auth/guard";

const mockAuth = auth as unknown as jest.Mock;

function session(role: Role, extra: Record<string, unknown> = {}) {
  return {
    user: {
      id: "u1",
      email: "u@example.com",
      role,
      customerId: null,
      driverId: null,
      ...extra,
    },
  };
}

beforeEach(() => jest.clearAllMocks());

describe("role guards", () => {
  it("rejects an unauthenticated request with 401", async () => {
    mockAuth.mockResolvedValue(null);
    await expect(requireClient()).rejects.toMatchObject({ status: 401 });
  });

  it("rejects a client calling an operator-only guard with 403", async () => {
    mockAuth.mockResolvedValue(session(Role.CLIENT));
    await expect(requireOperator()).rejects.toMatchObject({ status: 403 });
  });

  it("rejects a driver calling a client-only guard with 403", async () => {
    mockAuth.mockResolvedValue(session(Role.DRIVER));
    await expect(requireClient()).rejects.toMatchObject({ status: 403 });
  });

  it("allows an operator through the operator guard", async () => {
    mockAuth.mockResolvedValue(session(Role.OPERATOR));
    await expect(requireOperator()).resolves.toMatchObject({
      role: Role.OPERATOR,
    });
  });

  it("allows a driver through the driver guard", async () => {
    mockAuth.mockResolvedValue(session(Role.DRIVER, { driverId: "drv-1" }));
    await expect(requireDriver()).resolves.toMatchObject({
      driverId: "drv-1",
    });
  });
});
