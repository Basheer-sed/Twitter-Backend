import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

router.get("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

router.get("/:id", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

router.patch("/:id", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

router.delete("/:id", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

export default router;
