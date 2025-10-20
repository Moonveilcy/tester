export interface ExtractedFile {
  path: string;
  content: string;
  isBinary: boolean;
}

export interface UploadProgress {
  current: number;
  total: number;
  status: string;
}