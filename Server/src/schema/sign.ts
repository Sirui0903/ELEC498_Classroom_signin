import { Schema } from 'mongoose';

export const signSchema = new Schema({
  signs: {
    type: Array,
    default: [],
  },
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  limit: {
    type: Date,
    required: true,
  },
  toc: { type: Date, required: true, default: Date.now() },
  classId: {
    required: true,
    type: String,
  },
});
