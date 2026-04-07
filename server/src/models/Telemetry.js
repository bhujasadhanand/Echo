import mongoose from 'mongoose';

const telemetrySchema = new mongoose.Schema(
  {
    binId: { type: String, required: true },
    fillLevel: { type: Number, required: true, min: 0, max: 100 },
    node: { type: String, enum: ['A', 'B', 'C', null], default: null },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for fast recent-telemetry lookups
telemetrySchema.index({ binId: 1, timestamp: -1 });

export const Telemetry = mongoose.model('Telemetry', telemetrySchema);
