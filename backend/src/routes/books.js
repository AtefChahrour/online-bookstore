import express from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/books  -> all books
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, title, author, image_key, price FROM books ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/books/featured -> 3 books
router.get("/featured", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, title, author, image_key, price FROM books ORDER BY id ASC LIMIT 3"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/books -> add book (requires login)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, author, image_key, price } = req.body ?? {};

    const t = typeof title === "string" ? title.trim() : "";
    const a = typeof author === "string" ? author.trim() : "";
    const img = typeof image_key === "string" ? image_key.trim() : "";
    const p = Number(price);

    if (!t) return res.status(400).json({ message: "Title is required." });
    if (!a) return res.status(400).json({ message: "Author is required." });
    if (!Number.isFinite(p) || p < 0) {
      return res.status(400).json({ message: "Price must be a valid number." });
    }

    const [result] = await pool.execute(
      "INSERT INTO books (title, author, image_key, price) VALUES (?, ?, ?, ?)",
      [t, a, img, p]
    );

    res.status(201).json({
      id: result.insertId,
      title: t,
      author: a,
      image_key: img,
      price: p
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
