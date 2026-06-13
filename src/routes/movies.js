import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();

// Получить все фильмы
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Добавить фильм
router.post('/', async (req, res) => {
  try {
    console.log("📥 Получены данные фильма:", req.body);

    const { title, description, posterPath } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Название фильма обязательно" });
    }

    const newMovie = new Movie({
      title: title.trim(),
      description: description || "",
      posterPath: posterPath || "",
      tmdbId: Date.now()
    });

    const savedMovie = await newMovie.save();
    console.log("✅ Фильм сохранён:", savedMovie.title);

    res.status(201).json(savedMovie);
  } catch (error) {
    console.error("❌ Ошибка сохранения фильма:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;