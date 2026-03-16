import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 } from 'uuid';
import { PandocContents } from './dto/pandocOutput';

// Import utils
import ExtractHeader from './utils/extractHeader';
import ExtractPara from './utils/extractPara';
import ExtractOptions from './utils/extractOptions';
import ExtractTitle from './utils/extractTitle';

import { IFileParser } from '../../../application/ports/file-parser.port';

// Import DTO
import {
  OptionsDataImporterDTO,
  NewQuestionImporterDTO,
  LessonDataImporterDTO,
  NewCategoryImporterDTO,
  BankStatDTO,
} from 'src/importer/application/dtos/parse-docx.dto';
import { ParsedDataOutput } from 'src/importer/application/dtos/parse-docx.dto';
import { isArrayEqual } from './utils/isArrayEqual';

const pandoc = require('node-pandoc-promise');

@Injectable()
export class PandocParserService implements IFileParser {
  private readonly uploadDir: string;
  private readonly staticDir: string;
  constructor() {
    this.staticDir = path.join(process.cwd(), 'static');
    this.uploadDir = path.join(this.staticDir, 'uploads');

    fs.ensureDirSync(this.uploadDir);
  }

  async parse(buffer: Buffer): Promise<ParsedDataOutput> {
    const tempFileName = `temp_${v4()}.docx`;
    const tempFilePath = path.join(this.uploadDir, tempFileName);

    try {
      await fs.writeFile(tempFilePath, buffer);

      const args = [
        '-f',
        'docx',
        '-t',
        'json',
        '--mathjax',
        `--extract-media=${this.uploadDir}`,
      ];
      const result = await pandoc(tempFilePath, args);
      const AST = JSON.parse(result);
      const meta = AST.meta;
      const html: any[] = AST.blocks;
      const hasOptions = html.find((ele) => ele.t === 'BulletList');

      const initialOption = (): OptionsDataImporterDTO => ({
        template: '',
        variables: {
          math: {},
          image: {},
        },
      });

      let initialQuestionRes = (): NewQuestionImporterDTO => ({
        exerciseType: '',
        difficultyLevel: '',
        learningOutcomes: [],
        questionType: '',
        question: {
          template: '',
          variables: {
            math: {},
            image: {},
          },
        },
        options: [],
      });

      let initialBankStat = (): BankStatDTO => ({
        exerciseType: '',
        difficultyLevels: [],
        learningOutcomes: [],
        questionType: '',
        count: 1,
      });

      let initialLessonData = (name: string): LessonDataImporterDTO => ({
        name: name,
        bankStats: [],
      });

      let chapter: string = '';
      let lesson: string = '';

      const questionsRes: NewQuestionImporterDTO[] = [];
      const categoryRes: NewCategoryImporterDTO = {
        chapter: '',
        lessons: [],
      };
      Object.entries(meta).forEach(([key, value]: [string, any]) => {
        const content: any[] = value.c;
        // Chapter
        if (key === 'title') {
          chapter = ExtractTitle(content);
        }
        // Lesson
        else if (key === 'subtitle') {
          lesson = ExtractTitle(content);
        }
      });

      // Tạo cate cho chương và bài
      categoryRes.chapter = chapter;
      categoryRes.lessons.push(initialLessonData(lesson));

      let tempBankStat: BankStatDTO = initialBankStat();

      html.forEach((element) => {
        const title = element.t;
        const content = element.c;

        // Category & Level & LearningOutcomes
        if (title === 'Header') {
          const { level, text } = ExtractHeader(content);

          // Dạng bài
          if (level === 1) {
            questionsRes.push(initialQuestionRes());
            questionsRes[questionsRes.length - 1].exerciseType = text;

            tempBankStat.exerciseType = text;
          }
          // Độ khó
          else if (level === 2) {
            questionsRes[questionsRes.length - 1].difficultyLevel = text;

            tempBankStat.difficultyLevels.push(text);
          }
          // Yêu cầu cần đạt
          else if (level === 3) {
            questionsRes[questionsRes.length - 1].learningOutcomes.push(text);

            tempBankStat.learningOutcomes.push(text);
          } else if (level === 4) {
            questionsRes[questionsRes.length - 1].questionType = text;

            tempBankStat.questionType = text;
          }

          const isFillTemp =
            tempBankStat.exerciseType.trim().length > 0 &&
            tempBankStat.difficultyLevels.length > 0 &&
            tempBankStat.learningOutcomes.length > 0 &&
            tempBankStat.questionType.trim().length > 0;

          if (isFillTemp) {
            const curStatIndex = categoryRes.lessons[0].bankStats.findIndex(
              (stat) => {
                return (
                  stat.exerciseType === tempBankStat.exerciseType &&
                  isArrayEqual(
                    stat.difficultyLevels,
                    tempBankStat.difficultyLevels,
                  ) &&
                  isArrayEqual(
                    stat.learningOutcomes,
                    tempBankStat.learningOutcomes,
                  ) &&
                  stat.questionType === tempBankStat.questionType
                );
              },
            );

            if (curStatIndex < 0) {
              categoryRes.lessons[0].bankStats.push(tempBankStat);
            } else {
              categoryRes.lessons[0].bankStats[curStatIndex].count += 1;
            }
            tempBankStat = initialBankStat();
          }
        }

        // Question
        else if (title === 'Para') {
          ExtractPara(
            content,
            questionsRes[questionsRes.length - 1],
            this.uploadDir,
          );
        }
        // Options
        else if (hasOptions && title === 'BulletList') {
          content.forEach((raw: PandocContents) => {
            questionsRes[questionsRes.length - 1].options.push(initialOption());
            ExtractOptions(
              raw[0].c,
              questionsRes[questionsRes.length - 1],
              questionsRes[questionsRes.length - 1].options.length - 1,
              this.uploadDir,
            );
          });
        }
      });

      if (questionsRes.length > 0) {
        return { questions: questionsRes, category: categoryRes };
      } else {
        throw Error('File rỗng');
      }
    } catch (err) {
      console.error('Lỗi Pandoc:', err);
      throw new Error('Lỗi chuyển đổi file.');
    } finally {
      await fs.remove(tempFilePath).catch(() => {});
    }
  }
}
