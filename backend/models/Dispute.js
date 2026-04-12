import mongoose from 'mongoose';

const disputeSchema = mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order' },
    buyer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    vendor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    reason: { type: String, required: true },
    status: { type: String, enum: ['open', 'resolved_buyer', 'resolved_vendor'], default: 'open' },
    resolutionNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

const Dispute = mongoose.model('Dispute', disputeSchema);
export default Dispute;
