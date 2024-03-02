import { Schema } from 'mongoose';

export const ClassSchema = new Schema({
  content: { type: String, required: true, default: 'Class-1' },
  toc: { type: Date, required: true, default: Date.now() },
  users: { type: [], default: [] },
});
