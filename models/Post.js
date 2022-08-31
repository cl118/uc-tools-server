const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    bedNumber: {
      type: String,
      required: true,
    },
    forEdProvider: {
      type: String,
      required: true,
    },
    providerName: {
      type: String,
      required: true,
    },
    providerGroup: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Paged', 'Re-Paged', 'Completed'],
    },
    notes: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', PostSchema);