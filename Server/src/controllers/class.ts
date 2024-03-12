import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ClassService } from '../services/class';
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('getAllClass')
  getAllClass() {
    return this.classService.getAllClass();
  }

  @Post('createClass')
  createClass(@Body() data: { content: string }) {
    return this.classService.createClass(data);
  }

  @Post('editClassName')
  editClassName(@Body() data: { content: string; _id: string }) {
    return this.classService.editClassName(data);
  }

  @Delete('deleteClass')
  deleteClass(@Body() data: { cid: string }) {
    return this.classService.deleteClass(data);
  }

  @Get('getUsersByClassId')
  getUsersByClassId(@Query() data: { cid: string }) {
    return this.classService.getUsersByClassId(data.cid);
  }
}
