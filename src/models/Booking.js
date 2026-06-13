import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  movieId: {
    type: String,
    required: true
  },
  movieTitle: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
    // index убрали, чтобы не было дублирования
  },
  sessionTime: {
    type: String,
    required: true
  },
  hall: {
    type: String,
    required: true
  },
  seats: {
    type: [String],
    required: true,
    validate: {
      validator: function (seats) {
        return seats.length > 0;
      },
      message: 'Необходимо выбрать хотя бы одно место'
    }
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Составной индекс (рекомендуется)
bookingSchema.index({ userId: 1, createdAt: -1 });

// Индекс по sessionId (без дублирования)
bookingSchema.index({ sessionId: 1 });

export default mongoose.model('Booking', bookingSchema);