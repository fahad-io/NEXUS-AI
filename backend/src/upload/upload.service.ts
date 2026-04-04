import { Injectable } from '@nestjs/common';

export interface UploadedFileInfo {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
}

@Injectable()
export class UploadService {
  getFileInfo(file: Express.Multer.File): UploadedFileInfo {
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      type: file.mimetype,
    };
  }
}
