import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { classData } from '../interface/class';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel('class') private readonly classModel: Model<classData>,
  ) {}

  async getAllClass() {
    return this.classModel.find();
  }
  async createClass(data: { content: string }) {
    const { content } = data;
    const have_existed = await this.classModel.findOne({ content });
    if (!have_existed) {
      const createdClass = new this.classModel(data);
      await createdClass.save();
      return this.classModel.find();
    }
    throw new HttpException('The user already exists', HttpStatus.BAD_REQUEST);
  }

  async addUserInClass(data: { cid: string; uid: string; oldCid?: string }) {
    const { cid, uid, oldCid } = data;
    const { users } = await this.classModel.findOne({ _id: cid }, { users: 1 });
    if (oldCid) {
      await this.classModel.updateOne(
        { _id: oldCid },
        {
          $pull: {
            users: uid,
          },
        },
      );
    }
    if (!users.includes(uid)) {
      await this.classModel.updateOne(
        { _id: cid },
        {
          $push: {
            users: uid,
          },
        },
      );
    } else {
      throw new HttpException(
        'The user already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
