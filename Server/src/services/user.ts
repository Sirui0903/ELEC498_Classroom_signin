import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from '../interface/user';
import { ClassService } from './class';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => ClassService)) private classService: ClassService,
    @InjectModel('users') private readonly userModel: Model<user>,
  ) {}
  async createUser(
    userData: user,
  ): Promise<{ user_name: string; _id: string; permission: string }> {
    const { user_name } = userData;
    const have_existed = await this.userModel.findOne({ user_name });
    if (!have_existed) {
      const createdUser = new this.userModel(userData);
      const { user_name, _id, permission } = await createdUser.save();
      return { user_name, _id, permission };
    }
    throw new HttpException('The user already exists', HttpStatus.BAD_REQUEST);
  }

  async login(userData: { user_name: string; password: string }) {
    const { user_name, password } = userData;
    const res = await this.userModel.findOne(
      { user_name, password },
      { _id: 1, user_name: 1, permission: 1 },
    );
    if (!res) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return res;
  }

  async isAdmin(uid: string) {
    const { permission } = await this.userModel.findOne(
      { _id: uid },
      { permission: 1 },
    );
    return permission === 'admin';
  }

  async findUserByIds(uids: string[]) {
    return await this.userModel.find({ _id: { $in: uids } }, { user_name: 1 });
  }

  async getAllUser() {
    const res = await this.userModel
      .find(
        { permission: 'common' },
        { user_name: 1, class: 1, _id: 1, toc: 1 },
      )
      .sort({ toc: -1 });

    // 等待所有的 Promise 完成
    const resolvedNewRes = await Promise.all(
      res.map(async (item: any) => {
        const classData = await this.classService.findClassByIds(item.class);
        const newClass = classData.map((classItem) => {
          return classItem.content;
        });
        return {
          user_name: item.user_name,
          class: newClass,
          _id: item._id,
          toc: item.toc,
        };
      }),
    );

    if (!res) {
      return { data: [] };
    } else {
      return { data: resolvedNewRes };
    }
  }

  async editUserClass(data: { uid: string; cid: string[] }) {
    const { uid, cid } = data;
    const userData = await this.getClassByUid(uid);
    await this.userModel.updateOne(
      { _id: uid },
      {
        $set: {
          class: cid,
        },
      },
    );
    await this.classService.addUserInClass({ ...data, oldCid: userData.class });
    const classData = await this.classService.getAllClass();
    const newUserData = await this.getAllUser();
    return { classData, userData: newUserData };
  }

  async getClassByUid(uid: string) {
    return this.userModel.findOne({ _id: uid }, { class: 1 });
  }

  async deleteUserClass(data: { uids: string[]; cid: string }) {
    const { uids, cid } = data;
    await this.userModel.updateMany(
      {
        _id: { $in: uids },
      },
      {
        $pull: {
          class: cid,
        },
      },
    );
  }
}
