import express from "express";
import auth from "../middleware/auth.js";
import pool from "../db.js";

const router = express.Router();

router.post("/checkout", auth, async (req, res) => {
  const items = req.body?.items;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty." });
  }
  for (const it of items) {
    if (!it?.book_id || !Number.isFinite(Number(it.quantity)) || Number(it.quantity) <= 0) {
      return res.status(400).json({ message: "Invalid cart items." });
    }
  }

  const userId = req.user.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orderRes] = await conn.query(
      "INSERT INTO orders (user_id, total, created_at) VALUES (?, ?, NOW())",
      [userId, 0]
    );

    const orderId = orderRes.insertId;

    let total = 0;

    for (const it of items) {
      const bookId = Number(it.book_id);
      const qty = Number(it.quantity);

      const [rows] = await conn.query("SELECT price FROM books WHERE id = ?", [bookId]);
      if (!rows.length) {
        throw new Error(`Book not found: ${bookId}`);
      }

      const price = Number(rows[0].price);
      total += price * qty;

      await conn.query(
        "INSERT INTO order_items (order_id, book_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
        [orderId, bookId, qty, price]
      );
    }

    await conn.query("UPDATE orders SET total = ? WHERE id = ?", [total, orderId]);

    await conn.commit();
    return res.json({ orderId, total });
  } catch (e) {
    await conn.rollback();
    return res.status(500).json({ message: e.message || "Checkout failed." });
  } finally {
    conn.release();
  }
});

export default router;
