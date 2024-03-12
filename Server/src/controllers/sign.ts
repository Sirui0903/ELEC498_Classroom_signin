import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SignService } from '../services/sign';
import { postSignData } from '../interface/sign';

@Controller('sign')
export class SignController {
  constructor(private readonly signService: SignService) {}

  @Post('postSign')
  postSign(@Body() data: postSignData) {
    return this.signService.createSign(data);
  }

  @Post('check-in')
  check(@Body() data: { qid: string; uid: string }) {
    return this.signService.check(data);
  }

  @Get('getNewSign')
  getNewSing(
    @Query() data: { cid: string; currentPage?: number; singleTotal?: number },
  ) {
    return this.signService.getNewSign(data);
  }

  @Get('getSignMessage')
  getSignMessage(@Query() data: { qid: string }) {
    return this.signService.getSignMessage(data.qid);
  }

  @Get('getClassSign')
  getClassSign(@Query() data: { cid: string; time: number | undefined }) {
    return this.signService.getClassSign(data);
  }
}
