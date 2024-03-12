import { Schema } from 'mongoose';
export const userSchema = new Schema({
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  permission: { type: String, required: true },
  toc: { type: Date, required: true, default: Date.now() },
  class: { type: Array, default: [] },
});
