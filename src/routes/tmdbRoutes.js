// src/routes/tmdbRoutes.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Общий обработчик ошибок
const handleTmdbError = (error, res) => {
  console.error('TMDB Error:', error.response?.data || error.message);
  res.status(500).json({ 
    message: 'Ошибка при обращении к TMDB', 
    error: error.response?.data || error.message 
  });
};

// Популярные фильмы
router.get('/popular', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'ru-RU',
        page: req.query.page || 1,
      },
    });
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res);
  }
});

// Сейчас в кино
router.get('/now_playing', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'ru-RU',
        page: req.query.page || 1,
      },
    });
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res);
  }
});

// Высокий рейтинг
router.get('/top_rated', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'ru-RU',
        page: req.query.page || 1,
      },
    });
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res);
  }
});

// Детали фильма
router.get('/movie/:id', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${req.params.id}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'ru-RU',
        append_to_response: 'credits,videos',
      },
    });
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res);
  }
});




// === Прокси для картинок TMDB ===
router.get('/image/:size/:path', async (req, res) => {
  try {
    const { size, path } = req.params;
    const imageUrl = `https://image.tmdb.org/t/p/${size}/${path}`;

    const response = await axios.get(imageUrl, {
      responseType: 'stream',
    });

    // Передаём заголовки
    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // кэш на сутки

    response.data.pipe(res);
  } catch (error) {
    console.error('Image proxy error:', error.message);
    res.status(404).send('Image not found');
  }
});


export default router;