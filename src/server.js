import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Роуты
import authRoutes from './routes/auth.js';
import moviesRoutes from './routes/movies.js';
import sessionsRoutes from './routes/sessions.js';
import bookingsRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// Middleware
// ======================
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://kino-book.vercel.app',           // ← твой домен на Vercel
    /\.vercel\.app$/                          // ← разрешает все поддомены vercel
  ],
  credentials: true
}));
app.use(express.json());

// ======================
// Подключение к MongoDB
// ======================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kinobook');
    console.log('✅ MongoDB подключен успешно');
  } catch (error) {
    console.error('❌ Ошибка подключения к MongoDB:', error);
    process.exit(1);
  }
};

// ======================
// Роуты
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/admin', adminRoutes);

// Тестовый роут
app.get('/', (req, res) => {
  res.send('✅ KinoBook Backend работает!');
});

// ======================
// Обработка ошибок (404)
// ======================
app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

// ======================
// Запуск сервера
// ======================
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  });
};

startServer();