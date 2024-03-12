import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { classData } from '../interface/class';
import { UserService } from './user';
@Injectable()
export class ClassService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
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

  async addUserInClass(data: { cid: string[]; uid: string; oldCid: string[] }) {
    const { oldCid, cid, uid } = data;
    if (!oldCid.length) {
      await this.classModel.updateMany(
        { _id: { $in: cid } },
        {
          $push: {
            users: uid,
          },
        },
      );
    } else {
      const extraIds = [];
      const lessIds = [];

      cid.forEach((item) => {
        if (!oldCid.includes(item)) {
          extraIds.push(item);
        }
      });

      oldCid.forEach((item) => {
        if (!cid.includes(item)) {
          lessIds.push(item);
        }
      });

      await this.classModel.updateMany(
        { _id: { $in: extraIds } },
        {
          $push: {
            users: uid,
          },
        },
      );

      await this.classModel.updateMany(
        { _id: { $in: lessIds } },
        {
          $pull: {
            users: uid,
          },
        },
      );
    }
  }

  async editClassName(data: { content: string; _id: string }) {
    const { content, _id } = data;
    await this.classModel.updateOne(
      { _id },
      {
        $set: {
          content,
        },
      },
    );
  }

  async findClassByIds(cid: string[]) {
    return this.classModel.find({ _id: { $in: cid } }, { content: 1 });
  }

  async deleteClass(data: { cid: string }) {
    const { cid } = data;
    const { users } = await this.classModel.findOne({ _id: cid }, { users: 1 });
    await this.classModel.deleteOne({ _id: cid });
    if (users.length) {
      await this.userService.deleteUserClass({ uids: users, cid });
    }
    const classData = await this.getAllClass();
    const newUserData = await this.userService.getAllUser();
    return { classData, userData: newUserData };
  }

  async getClassNameById(cid: string) {
    return this.classModel.findOne({ _id: cid }, { content: 1 });
  }

  async getUsersByClassId(cid: string) {
    const { users } = await this.classModel.findOne({ _id: cid }, { users: 1 });
    return users;
  }
}
