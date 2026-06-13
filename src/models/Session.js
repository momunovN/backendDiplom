import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true,
    index: true
  },
  movieTitle: {
    type: String,
    required: true
  },
  date: {
    type: String
  },
  time: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
    // index: true убрали, чтобы избежать дублирования
  },
  hall: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalSeats: {
    type: Number,
    default: 120
  },
  bookedSeats: {
    type: Number,
    default: 0
  },
  bookedSeatsList: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Составной индекс (movieId + startTime)
sessionSchema.index({ movieId: 1, startTime: 1 });

// Отдельный индекс по startTime (для фильтрации будущих сеансов)
sessionSchema.index({ startTime: 1 });

export default mongoose.model('Session', sessionSchema);