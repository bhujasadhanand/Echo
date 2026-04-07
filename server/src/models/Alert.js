import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    binId: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ['warning', 'critical'], required: true },
    timestamp: { type: String, default: 'Just now' },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Alert = mongoose.model('Alert', alertSchema);
