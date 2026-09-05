import type { FastifyReply, FastifyRequest } from "fastify";
import argon2 from "argon2";
import type { Role } from "@t2t/shared";

// argon2id by default — the recommended password hash.
export const hashPassword = (pw: string) => argon2.hash(pw);
export const verifyPassword = (hash: string, pw: string) => argon2.verify(hash, pw);

// JWT payload shape (merges into @fastify/jwt's request.user typing).
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; role: Role };
    user: { sub: string; role: Role };
  }
}

export async function authenticate(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await req.jwtVerify();
  } catch {
    reply.code(401).send({ error: "unauthorized" });
  }
}

// Guard a route to specific roles. Admin is NOT implicitly allowed — pass it explicitly.
export const requireRole =
  (...roles: Role[]) =>
  async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    await authenticate(req, reply);
    if (reply.sent) return;
    // super_admin can access everything
    if (req.user.role !== "super_admin" && !roles.includes(req.user.role)) {
      reply.code(403).send({ error: "forbidden" });
    }
  };
