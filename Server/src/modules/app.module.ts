import { Module } from '@nestjs/common';
import { UserModule } from './user';
import { MongooseModule } from '@nestjs/mongoose';
import { SignModule } from './sign';
import { ClassModule } from './class';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/local'),
    UserModule,
    SignModule,
    ClassModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
