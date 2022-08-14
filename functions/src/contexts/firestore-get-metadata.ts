import { FileMetadata, GetFileMetadataCtx } from "../types/types";
import { doesFileExist } from "../services/cloud-storage";
import { getMetadata } from "../services/firestore";

export const firestoreGetMetadataCtx: GetFileMetadataCtx = {
  doesFileExist: (id: string): Promise<boolean> => doesFileExist(id),
  getMetadata: (id: string): Promise<FileMetadata> => getMetadata(id),
};
