import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { postSignData } from '../interface/sign';
import { UserService } from './user';

@Injectable()
export class SignService {
  constructor(
    @InjectModel('signs') private readonly signModel: Model<postSignData>,
    private readonly userService: UserService, // 注入 UserService 实例
  ) {}

  async createSign(data: postSignData) {
    const { creator } = data;
    const isAdmin = await this.userService.isAdmin(creator);
    if (!isAdmin) {
      throw new HttpException('Do not have permission', HttpStatus.BAD_REQUEST);
    }
    const createdSign = new this.signModel(data);
    const { content, _id } = await createdSign.save();
    return { content, _id };
  }

  async check(data: { qid: string; uid: string }) {
    const { limit, signs } = await this.signModel.findOne(
      { _id: data.qid },
      { limit: 1, signs: 1 },
    );
    const currentTime = new Date();
    if (currentTime > limit) {
      throw new BadRequestException('Qr code is no longer valid');
    }
    if (signs.includes(data.uid)) {
      throw new BadRequestException('The user has checked in');
    }
    await this.signModel.updateOne(
      { _id: data.qid },
      {
        $push: {
          signs: data.uid,
        },
      },
    );
    return 'success';
  }

  async getNewSign(data: {
    cid: string;
    currentPage?: number;
    singleTotal?: number;
  }) {
    const { cid, currentPage = 1, singleTotal = 12 } = data;
    const totalCount = await this.signModel.countDocuments({ creator: cid });
    const totalPages = Math.ceil(totalCount / singleTotal);
    const skip = (currentPage - 1) * 10;
    const res = await this.signModel
      .find({ creator: cid }, { signs: 1, limit: 1, toc: 1, creator: 1 })
      .sort({ toc: -1 })
      .skip(skip)
      .limit(singleTotal); // 按照 _id 字段降序排序，通常 _id 包含了插入时间戳
    if (!res) {
      return { data: [] };
    } else {
      return { data: res, totalCount, totalPages, currentPage };
    }
  }

  async getSignMessage(qid: string) {
    const { signs } = await this.signModel.findOne({ _id: qid }, { signs: 1 });
    return this.userService.findUserByIds(signs);
  }
}
