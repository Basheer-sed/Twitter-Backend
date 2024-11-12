import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const router = Router();
const prisma = new PrismaClient();

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
export const JWT_SECRET = "SUPER SECRET"; //

// Generate a random 8 digit number as the email token
export const generateEmailToken = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

export const generateAuthToken = (tokenId: number): string => {
  const jwtPayload = { tokenId };

  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: "HS256",
    noTimestamp: true,
  });
};

router.post("/login", async (req, res) => {
  const { email } = req.body;

  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );

  try {
    const createToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        expiration,
        emailToken,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
      },
    });

    res.status(200).json({ emailToken });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "Couldn't start the authentication process" });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, emailToken } = req.body;

  const dbEmailToken = await prisma.token.findUnique({
    where: {
      emailToken,
    },
    include: {
      user: true,
    },
  });

  if (!dbEmailToken) throw new Error("Email Token not found");

  const { valid, expiration, user } = dbEmailToken;

  if (!valid) {
    res.status(401).json({ error: "Email Token is Invalid" });
  }

  if (expiration < new Date()) {
    res.status(401).json({ error: "Token expired!" });
  }

  if (email !== user.email) {
    res.status(401).json({ error: "The user does not belongs to you" });
  }

  const authEmailexpiration = new Date(
    new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
  );

  const apiToken = await prisma.token.create({
    data: {
      type: "API",
      expiration: authEmailexpiration,
      user: {
        connect: {
          email,
        },
      },
    },
  });

  await prisma.token.update({
    where: { id: dbEmailToken.id },
    data: { valid: false },
  });

  const authToken = generateAuthToken(apiToken.id);

  res.json(authToken);
});

export default router;
