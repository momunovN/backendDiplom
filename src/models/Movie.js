import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  tmdbId: { type: Number, unique: true },
  title: { type: String, required: true },
  description: String,
  posterPath: String,
  backdropPath: String,
  releaseDate: String,
  runtime: Number,
  genres: [String],
  voteAverage: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Movie', movieSchema);