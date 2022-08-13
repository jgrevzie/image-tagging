import { Context } from "koa";
import { processForm } from "../services/process-form";
import { UploadFileCtx } from "../types/types";

export const uploadPost =
  (uploadFileCtx: UploadFileCtx) => async (ctx: Context) =>
    processForm(ctx, uploadFileCtx)
      .then((fileId) => (ctx.body = fileId))
      .catch((err) => {
        ctx.status = 400;
        ctx.body = err.message;
      });
