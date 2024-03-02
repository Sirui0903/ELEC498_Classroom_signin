import { Document } from 'mongoose';

export interface classData extends Document {
  _id: string;
  content: string;
  users: string[];
  toc: Date;
}
