import {
  AlignmentType,
  BorderStyle,
  ImageRun,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';

export function BuildExamHeader(children: any[]) {
  const noBorders = {
    top: { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
    insideHorizontal: { style: BorderStyle.NONE },
    insideVertical: { style: BorderStyle.NONE },
  };

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: noBorders,
      rows: [
        new TableRow({
          children: [
            // Cột trái
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'BỘ GIÁO DỤC VÀ ĐÀO TẠO',
                      underline: {},
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'ĐỀ THI CHÍNH THỨC', bold: true }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: '(Đề thi có 04 trang)',
                      italics: true,
                    }),
                  ],
                }),
              ],
            }),
            // Cột phải
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'KỲ THI TỐT NGHIỆP TRUNG HỌC PHỔ THÔNG NĂM 2025',
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'Môn thi: VẬT LÍ', bold: true }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'Thời gian ', italics: true }),
                    new TextRun({
                      text: 'làm bài 50 phút, không kể thời gian phát đề',
                      italics: true,
                      underline: {},
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Khoảng trắng giữa 2 phần
    new Paragraph({ text: '' }),
    new Paragraph({
      text: 'Họ, tên thí sinh: .............................',
    }),
    new Paragraph({
      text: 'xxx: .............................',
    }),

    // Khoảng trắng phân cách Header và Nội dung bài thi
    new Paragraph({ text: '' }),
    new Paragraph({ text: '' }),
  );
}
