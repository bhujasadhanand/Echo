import mongoose from 'mongoose';

const collectionHistorySchema = new mongoose.Schema(
  {
    binId: { type: String, required: true },
    worker: { type: String, required: true },
    status: { type: String, default: 'Completed' },
    collectedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

collectionHistorySchema.index({ collectedAt: -1 });

export const CollectionHistory = mongoose.model('CollectionHistory', collectionHistorySchema);
