import { Body, Controller, Get, Post } from '@nestjs/common';
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
    console.log(data, 'data');
    return this.classService.createClass(data);
  }
}
