import { Document } from 'mongoose';

export interface user extends Document {
  user_name: string;
  password: string;
  permission: 'admin' | 'common';
}
