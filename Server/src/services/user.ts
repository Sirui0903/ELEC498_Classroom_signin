import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from '../interface/user';
import { ClassService } from './class';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('users') private readonly userModel: Model<user>,
    private classService: ClassService,
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

  async getAllUser(data: { currentPage?: number; singleTotal?: number }) {
    const res = await this.userModel
      .find(
        { permission: 'common' },
        { user_name: 1, class: 1, _id: 1, toc: 1 },
      )
      .sort({ toc: -1 });
    if (!res) {
      return { data: [] };
    } else {
      return { data: res };
    }
  }

  async editUserClass(data: { uid: string; cid: string; oldCid?: string }) {
    const { uid, cid } = data;
    await this.userModel.updateOne(
      { _id: uid }, // 查询条件，可以根据你的实际情况修改
      { $set: { class: cid } }, // 更新操作，$set 用于设置字段值
    );
    await this.classService.addUserInClass(data);
  }
}
