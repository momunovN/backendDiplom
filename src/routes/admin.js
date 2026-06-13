import express from 'express';
import Session from '../models/Session.js';
import Booking from '../models/Booking.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Middleware для проверки прав администратора
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещён. Требуются права администратора.' });
  }
  next();
};

// Применяем защиту ко всем админским маршрутам
router.use(authMiddleware, adminOnly);

// ======================
// Получить все бронирования (для админа)
// ======================
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении бронирований' });
  }
});

// ======================
// Получить все сеансы (включая прошедшие — для админа)
// ======================
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ startTime: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// Создать новый сеанс
// ======================
router.post('/sessions', async (req, res) => {
  try {
    const { movieId, movieTitle, date, time, hall, price } = req.body;

    if (!movieId || !movieTitle || !date || !time || !hall || !price) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    const startTime = new Date(`${date}T${time}`);

    const newSession = await Session.create({
      movieId,
      movieTitle,
      date,
      time,
      startTime,
      hall,
      price: Number(price),
      totalSeats: 120,
      bookedSeats: 0,
      bookedSeatsList: []
    });

    res.status(201).json(newSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ======================
// Редактировать сеанс
// ======================
router.put('/sessions/:id', async (req, res) => {
  try {
    const { date, time, hall, price, bookedSeatsList = [] } = req.body;

    const bookedList = Array.isArray(bookedSeatsList)
      ? bookedSeatsList
      : (typeof bookedSeatsList === 'string' ? bookedSeatsList.split(',').map(s => s.trim()).filter(Boolean) : []);

    const startTime = new Date(`${date}T${time}`);

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      {
        date,
        time,
        startTime,
        hall,
        price: Number(price),
        bookedSeats: bookedList.length,
        bookedSeatsList: bookedList
      },
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ message: 'Сеанс не найден' });
    }

    res.json(updatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ======================
// Удалить сеанс
// ======================
router.delete('/sessions/:id', async (req, res) => {
  try {
    const deletedSession = await Session.findByIdAndDelete(req.params.id);

    if (!deletedSession) {
      return res.status(404).json({ message: 'Сеанс не найден' });
    }

    res.json({ message: 'Сеанс успешно удалён' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;