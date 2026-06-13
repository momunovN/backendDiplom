import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "supersecretkey12345changeinproduction";

// Регистрация (обычный пользователь)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user", // По умолчанию всегда user
    });

    await user.save();

    res.status(201).json({
      message: "Регистрация прошла успешно. Теперь войдите в аккаунт.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Логин
// Логин (временно упрощённый для отладки)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Попытка входа:", { email, password }); // для отладки

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный пароль" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role }, // ← используем id вместо userId
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Ошибка логина:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
