import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user';
import { UserService } from '../services/user';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from '../schema/user';
import { ClassSchema } from '../schema/class';
import { ClassService } from '../services/class';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'users', schema: userSchema },
      { name: 'class', schema: ClassSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, ClassService],
})
export class UserModule {}
