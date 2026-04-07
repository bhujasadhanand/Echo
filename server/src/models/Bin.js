import mongoose from 'mongoose';

const binSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    fillLevel: { type: Number, required: true, min: 0, max: 100 },
    status: { type: String, enum: ['empty', 'half', 'full'], required: true },
    lastUpdated: { type: String, default: 'Just now' },
    coordinates: { type: [Number], required: true },
    priority: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Bin = mongoose.model('Bin', binSchema);
