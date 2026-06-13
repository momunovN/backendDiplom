import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey12345changeinproduction';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Нет токена авторизации' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Приводим к единому формату
    req.user = {
      id: decoded.userId || decoded.id,   // поддерживаем оба варианта
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error("Ошибка authMiddleware:", error.message);
    return res.status(401).json({ message: 'Неверный или истёкший токен' });
  }
};