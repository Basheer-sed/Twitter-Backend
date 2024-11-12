import { Token, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../routes/authRoutes.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type AuthenticateTokenResp = Response & { user?: User };

export const authenticateToken = async (
  req: Request,
  res: AuthenticateTokenResp,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const jwtToken = authHeader?.split(" ")[1];

  if (!jwtToken) {
    res.status(400).json({ error: "Missing Jwt Token" });
    return;
  }

  try {
    const payload = jwt.verify(jwtToken, JWT_SECRET) as {
      tokenId: number;
    };

    const { tokenId } = payload;

    const dbToken = await prisma.token.findUnique({
      where: { id: tokenId },
      include: { user: true },
    });

    const { valid, expiration } = dbToken as Token;

    if (!valid) {
      res.status(401).json({ error: "Token is Invalid" });
      return;
    }

    if (expiration < new Date()) {
      res.status(401).json({ error: "Token is expired" });
      return;
    }
    res.user = dbToken?.user;
  } catch (error) {
    res.status(401).json({ error: "Couldn't authenticate process" });
    return;
  }

  next();
};
