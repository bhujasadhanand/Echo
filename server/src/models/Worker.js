import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ['available', 'assigned', 'in-progress'],
      default: 'available',
    },
    assignedBins: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Worker = mongoose.model('Worker', workerSchema);
