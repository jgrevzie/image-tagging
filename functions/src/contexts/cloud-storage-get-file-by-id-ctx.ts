import { FileMetadata, GetFileByIdCtx } from "../types/types";
import {
  doesFileExist,
  getReadableFileStream,
} from "../services/cloud-storage";
import { getMetadata } from "../services/firestore";

export const cloudStorageGetByIdCtx: GetFileByIdCtx = {
  doesFileExist: (id: string): Promise<boolean> => doesFileExist(id),
  getMetadata: (id: string): Promise<FileMetadata> => getMetadata(id),
  getReadableFileStream: (id: string) => getReadableFileStream(id),
};
