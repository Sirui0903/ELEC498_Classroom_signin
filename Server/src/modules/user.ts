import { forwardRef, Module } from '@nestjs/common';
import { UserController } from '../controllers/user';
import { UserService } from '../services/user';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from '../schema/user';
import { ClassModule } from './class';

@Module({
  imports: [
    forwardRef(() => ClassModule),
    MongooseModule.forFeature([{ name: 'users', schema: userSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
