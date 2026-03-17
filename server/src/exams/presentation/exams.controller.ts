import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ExamsUseCase } from '../application/exams.usecase';
import { ExamExportPayload } from './schemas/exams.schema';
import { ExamExportPayloadDTO } from '../application/dto/exams.dto';
import type { Response } from 'express';

@Controller('exam')
export class ExamsController {
  constructor(private readonly examsUseCase: ExamsUseCase) {}

  @Post('generate')
  async generateExam(@Body('draftId') draftId: string) {
    return await this.examsUseCase.generateExam(draftId);
  }

  @Get(':examId')
  async getExamById(@Param('examId') examId: string) {
    return await this.examsUseCase.getExamById(examId);
  }

  @Post('/export')
  async exportWordFile(
    @Body() payload: ExamExportPayload[],
    @Res() res: Response,
  ) {
    const dto: ExamExportPayloadDTO[] = payload.map((p) => ({
      questionType: p.questionType,
      questionIds: p.questionIds,
    }));

    const buffer = await this.examsUseCase.exportWordFile(dto);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=De_Thi.docx');

    return res.send(buffer);
  }
}
