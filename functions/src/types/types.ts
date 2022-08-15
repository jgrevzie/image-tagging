import { Readable } from "stream";
import { Result } from "ts-results";
import { DateTime } from "luxon";

export type FileMetadata = {
  id: string;
  fileName: string;
  dateUploaded: DateTime;
  tags?: string[];
  mimeType: string;
  user: User;
};

export type User = {
  token: string;
  userName: string;
};

export type KoaState = {
  user: User;
};

export type UploadFileCtx = {
  saveFile: ({
    fileName,
    readable,
    mimeType,
    user,
  }: {
    fileName: string;
    readable: Readable;
    mimeType: string;
    user: User;
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
  getUserByToken: (token: string) => Promise<User | null>;
};

export type AddTokenCtx = {
  saveToken: ({
    token,
    userName,
  }: {
    token: string;
    userName: string;
  }) => Promise<void>;
};
