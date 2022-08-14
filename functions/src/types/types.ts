import { Readable } from "stream";
import { Result } from "ts-results";
import { DateTime } from "luxon";

export type FileMetadata = {
  id: string;
  name: string;
  dateUploaded: DateTime;
  tags?: string[];
  mimeType: string;
};

export type UploadFileCtx = {
  saveFile: ({
    fileName,
    readable,
    mimeType,
  }: {
    fileName: string;
    readable: Readable;
    mimeType: string;
  }) => Promise<string>;

  isGoodFile: ({
    mimeType,
    fieldName,
  }: {
    mimeType: string;
    fieldName: string;
  }) => Result<null, string>;
};

export type PatchFileCtx = {
  addTagToFilePointer: ({
    id,
    tag,
  }: {
    id: string;
    tag: string;
  }) => Promise<void>;
};

export type GetFileByIdCtx = {
  doesFileExist: (id: string) => Promise<boolean>;
  getMetadata: (id: string) => Promise<FileMetadata>;
  getReadableFileStream: (id: string) => Readable;
};

export type GetFileMetadataCtx = {
  doesFileExist: (id: string) => Promise<boolean>;
  getMetadata: (id: string) => Promise<FileMetadata>;
};

export type SearchParams = {
  tag?: string;
  startDate?: DateTime;
  endDate?: DateTime;
};

export type SearchCtx = {
  search: (searchParams: SearchParams) => Promise<string[]>;
};

export type AuthCtx = {
  getUserByToken: (token: string) => Promise<string | null>;
};

export type AddTokenCtx = {
  saveToken: ({
    token,
    user,
  }: {
    token: string;
    user: string;
  }) => Promise<void>;
};
