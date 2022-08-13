import { Readable } from "stream";
import { Result } from "ts-results";

export type FileMetadata = {
  id: string;
  name: string;
  dateUploaded: number;
  tags: string[];
};

export type UnknownParams = { [k: string]: unknown };

export type UploadFileCtx = {
  saveFile: ({
    filename,
    readable,
  }: {
    filename: string;
    readable: Readable;
  }) => Promise<string>;

  isGoodFile: ({
    mimeType,
    fieldName,
  }: {
    mimeType: string;
    fieldName: string;
  }) => Result<null, string>;
};
