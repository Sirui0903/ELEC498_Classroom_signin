import { Document } from 'mongoose';

export interface postSignData extends Document {
  creator: string;
  limit: Date;
  content: string;
  signs: string[];
  toc: Date;
  classId: string;
}
