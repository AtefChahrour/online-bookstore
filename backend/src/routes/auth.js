import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";


const router = express.Router();

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    const safeName = (typeof name === "string" ? name.trim() : "").slice(0, 255);
    const safeEmail = (typeof email === "string" ? email.trim().toLowerCase() : "");

    if (!isValidEmail(safeEmail)) {
      return res.status(400).json({ message: "Invalid email." });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    // Check duplicate email
    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [safeEmail]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user (use NOW() for created_at so it works even if DB has no default)
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, NOW())",
      [safeName, safeEmail, passwordHash]
    );

    const user = {
      id: result.insertId,
      name: safeName,
      email: safeEmail,
    };

    // Optional: auto-login after signup
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    const safeEmail = (typeof email === "string" ? email.trim().toLowerCase() : "");

    if (!isValidEmail(safeEmail) || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const [rows] = await pool.execute(
      "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
      [safeEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const userRow = rows[0];
    const ok = await bcrypt.compare(password, userRow.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { sub: userRow.id, email: userRow.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      user: { id: userRow.id, name: userRow.name, email: userRow.email },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
});

export default router;
