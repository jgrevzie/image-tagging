import { UploadFileCtx } from "../types/types";
import { Err, Ok } from "ts-results";
import { nanoid } from "nanoid";

const FILE_FIELD_NAME = "file";

export const dummyUploadCtx: UploadFileCtx = {
  isGoodFile: ({
    mimeType,
    fieldName,
  }: {
    mimeType: string;
    fieldName: string;
  }) => {
    const allowedMimeTypes = [
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/tiff",
      //  FIXME remove
      "application/json",
    ];

    if (fieldName !== FILE_FIELD_NAME) {
      return Err(
        `found file in request with field name '${fieldName}', expecting '${FILE_FIELD_NAME}'`
      );
    }

    if (!allowedMimeTypes.includes(mimeType)) {
      const allowedMimeTypesString = allowedMimeTypes.join(",");
      return Err(
        `Upload had invalid mime type '${mimeType}', expecting one of ${allowedMimeTypesString}`
      );
    }

    return Ok(null);
  },

  saveFile: async ({ filename, readable }) => {
    console.log("saving file");
    readable.resume();
    throw Error("file error");
    return nanoid();
  },
};
