import { Context, Middleware } from "koa";
import { processForm } from "../services/process-form";
import { KoaState, UploadFileCtx } from "../types/types";

export const uploadFile =
  (uploadFileCtx: UploadFileCtx): Middleware<KoaState> =>
  async (ctx: Context) =>
    processForm(ctx, uploadFileCtx)
      .then((fileId) => (ctx.body = fileId))
      .catch((err) => {
        ctx.status = 400;
        ctx.body = err.message;
      });
