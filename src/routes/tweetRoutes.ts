import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticateTokenResp } from "../middlewares/authMiddleWares.js";
const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req: Request, res: AuthenticateTokenResp) => {
  const { content, image } = req.body;

  const user = res.user;
  if (!user) throw new Error("User undefined");
  try {
    const resp = await prisma.tweet.create({
      data: {
        content,
        image,
        userId: user?.id,
      },
    });
    res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Username and email should be unique" });
  }
});

router.get("/", async (req, res) => {
  const getAllTweets = await prisma.tweet.findMany({
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
    },
  });
  res.status(200).json(getAllTweets);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const getTweet = await prisma.tweet.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });
  if (!getTweet) res.status(400).json({ error: "Tweet not found" });
  res.status(200).json(getTweet);
});

router.patch("/:id", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.tweet.delete({ where: { id: Number(id) } });
  res.status(200);
});

export default router;
