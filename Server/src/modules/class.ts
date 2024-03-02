import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassSchema } from '../schema/class';
import { ClassController } from '../controllers/class';
import { ClassService } from '../services/class';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'class', schema: ClassSchema }]),
  ],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
