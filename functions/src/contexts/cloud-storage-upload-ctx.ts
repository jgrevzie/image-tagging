import { UploadFileCtx } from "../types/types";
import { Err, Ok } from "ts-results";
import { nanoid } from "nanoid";
import {
  deleteFromCloudStorage,
  saveToCloudStorage,
} from "../services/cloud-storage";
import { newDbFilePointer } from "../services/firestore";
import { ALLOWED_MIME_TYPES, FILE_FIELD_NAME } from "../constants";
import { log } from "firebase-functions/lib/logger";

export const cloudStorageUploadCtx: UploadFileCtx = {
  isGoodFile: ({
    mimeType,
    fieldName,
  }: {
    mimeType: string;
    fieldName: string;
  }) => {
    if (fieldName !== FILE_FIELD_NAME) {
      return Err(
        `found file in request with field name '${fieldName}', expecting '${FILE_FIELD_NAME}'`
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      const allowedMimeTypesString = ALLOWED_MIME_TYPES.join(",");
      return Err(
        `Upload had invalid mime type '${mimeType}', expecting one of ${allowedMimeTypesString}`
      );
    }

    return Ok(null);
  },

  saveFile: async ({ fileName, readable, mimeType, user }) => {
    // FIXME remove
    log("saving file!!");
    const id = nanoid();

    await saveToCloudStorage({ id, mimeType, readable });
    await newDbFilePointer({ id, mimeType, fileName, user }).catch(
      async (err) => {
        await deleteFromCloudStorage(id);
        throw err;
      }
    );

    return id;
  },
};
