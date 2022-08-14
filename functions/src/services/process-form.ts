import * as busboyFactory from "busboy";
import { Context } from "koa";
import { UploadFileCtx } from "../types/types";

export const processForm = async (
  ctx: Context,
  uploadFileCtx: UploadFileCtx
): Promise<string> =>
  new Promise((resolve, reject) => {
    const busboy = busboyFactory({ headers: ctx.headers });

    let savePromise: Promise<string>;

    busboy.on("file", async (fieldName, readable, { mimeType, filename }) => {
      const isGoodFile = uploadFileCtx.isGoodFile({ mimeType, fieldName });
      if (isGoodFile.ok) {
        savePromise = uploadFileCtx.saveFile({
          fileName: filename,
          readable,
          mimeType,
        });
      } else {
        // skip over the file
        readable.resume();
        reject(Error(isGoodFile.val));
      }
    });

    busboy.on("finish", async () => {
      if (!savePromise) reject(Error("No file was provided"));
      else savePromise.then(resolve).catch(reject);
    });

    busboy.on("error", (err) => {
      reject(err);
    });

    busboy.end(ctx.req.rawBody);
  });
