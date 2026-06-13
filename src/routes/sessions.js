import express from 'express';
import Session from '../models/Session.js';

const router = express.Router();

// Получить сеансы (только будущие)
router.get('/', async (req, res) => {
  try {
    const { movieId } = req.query;

    const filter = {
      startTime: { $gt: new Date() } // ← Только будущие сеансы
    };

    if (movieId) {
      filter.movieId = movieId;
    }

    const sessions = await Session.find(filter).sort({ startTime: 1 });
    res.json(sessions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Добавить сеанс (для админа)
router.post('/', async (req, res) => {
  try {
    const { movieId, movieTitle, date, time, hall, price, bookedSeatsList = [] } = req.body;

    // Формируем startTime
    const startTime = new Date(`${date}T${time}`);

    const bookedList = Array.isArray(bookedSeatsList) 
      ? bookedSeatsList 
      : (typeof bookedSeatsList === 'string' ? bookedSeatsList.split(',').map(s => s.trim()).filter(Boolean) : []);

    const newSession = new Session({
      movieId,
      movieTitle,
      date,
      time,
      startTime,                    // ← сохраняем как Date
      hall,
      price: Number(price),
      totalSeats: 120,
      bookedSeats: bookedList.length,
      bookedSeatsList: bookedList
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Редактировать сеанс
router.put('/:id', async (req, res) => {
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

    if (!updatedSession) return res.status(404).json({ message: "Сеанс не найден" });

    res.json(updatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Удалить сеанс
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Session.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Сеанс не найден" });
    res.json({ message: "Сеанс удалён" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;