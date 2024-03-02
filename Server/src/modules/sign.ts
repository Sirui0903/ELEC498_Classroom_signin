import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { signSchema } from '../schema/sign';
import { SignController } from '../controllers/sign';
import { SignService } from '../services/sign';
import { UserService } from '../services/user';
import { userSchema } from '../schema/user';
import { ClassSchema } from '../schema/class';
import { ClassService } from '../services/class';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'signs', schema: signSchema },
      { name: 'users', schema: userSchema },
      { name: 'class', schema: ClassSchema },
    ]),
  ],
  controllers: [SignController],
  providers: [SignService, UserService, ClassService],
})
export class SignModule {}
