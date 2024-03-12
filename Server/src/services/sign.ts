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
import { ClassService } from './class';

@Injectable()
export class SignService {
  constructor(
    @InjectModel('signs') private readonly signModel: Model<postSignData>,
    private readonly userService: UserService,
    private readonly classService: ClassService,
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
    const res = await this.userService.getClassByUid(data.uid);
    const { limit, signs, classId } = await this.signModel.findOne(
      { _id: data.qid },
      { limit: 1, signs: 1, classId: 1 },
    );
    const currentTime = new Date();
    if (!res.class.includes(classId)) {
      throw new BadRequestException('The current student is not in the class');
    } else if (currentTime > limit) {
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
      .find(
        { creator: cid },
        { signs: 1, limit: 1, toc: 1, creator: 1, classId: 1 },
      )
      .sort({ toc: -1 })
      .skip(skip)
      .limit(singleTotal); // 按照 _id 字段降序排序，通常 _id 包含了插入时间戳

    const newRes = await Promise.all(
      res.map(async (item: any) => {
        const { classId } = item;
        const { content } = await this.classService.getClassNameById(classId);
        return {
          signs: item.signs,
          limit: item.limit,
          toc: item.toc,
          creator: item.creator,
          className: content,
          _id: item._id,
          classId: item.classId,
        };
      }),
    );
    if (!res) {
      return { data: [] };
    } else {
      return { data: newRes, totalCount, totalPages, currentPage };
    }
  }

  async getSignMessage(qid: string) {
    const { signs } = await this.signModel.findOne({ _id: qid }, { signs: 1 });
    return this.userService.findUserByIds(signs);
  }

  async getClassSign(data: { cid: string; time: number | undefined }) {
    const { cid, time = 7 } = data;
    const currentDate = new Date();
    const threeDaysAgo = new Date(currentDate);
    threeDaysAgo.setDate(currentDate.getDate() - time);
    const condition = {
      classId: cid,
      toc: {
        $gte: threeDaysAgo.getTime(),
        $lt: currentDate.getTime(),
      },
    };
    const users = await this.classService.getUsersByClassId(cid);
    const classTotal = users.length;
    const res = await this.signModel.find(condition, { signs: 1 });
    let totalSigns = 0;
    let totalSignCount = 0;
    res.forEach((item) => {
      totalSignCount += 1; // 签到次数加一
      totalSigns += item.signs.length; // 签到人数加上当前签到的人数
    });
    const averageSigns = totalSigns / totalSignCount;
    return { classTotal, averageSigns };
  }
}
