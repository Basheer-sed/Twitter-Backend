import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const primsa = new PrismaClient();

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, username } = req.body;
  try {
    const resp = await primsa.user.create({
      data: {
        name,
        email,
        username,
      },
    });
    res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Username and email should be unique" });
  }
});

router.get("/", async (req, res) => {
  const allUser = await primsa.user.findMany();
  res.status(200).json(allUser);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const getUser = await primsa.user.findUnique({ where: { id: Number(id) } });
  res.status(200).json(getUser);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { bio, name, image } = req.body;
  const resp = await primsa.user.update({
    where: { id: Number(id) },
    data: { bio, name, image },
  });
  res.status(200).json(resp);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await primsa.user.delete({ where: { id: Number(id) } });
  res.status(200);
});

export default router;
