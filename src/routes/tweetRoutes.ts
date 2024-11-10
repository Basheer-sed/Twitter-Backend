import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { content, image, userId } = req.body;
  try {
    const resp = await prisma.tweet.create({
      data: {
        content,
        image,
        userId,
      },
    });
    res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Username and email should be unique" });
  }
});

router.get("/", async (req, res) => {
  const getAllTweets = await prisma.tweet.findMany();
  res.status(200).json(getAllTweets);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const getTweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });
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
