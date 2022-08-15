import { Context, Middleware } from "koa";
import { BadRequest } from "http-errors";
import { GetFileByIdCtx, KoaState } from "../types/types";

export const getFileById =
  (getFileByIdCtx: GetFileByIdCtx): Middleware<KoaState> =>
  async (ctx: Context) => {
    const id = ctx.params.id;

    if (!(await getFileByIdCtx.doesFileExist(id))) {
      throw new BadRequest(`file ${id} does not exist`);
    }

    const metadata = await getFileByIdCtx.getMetadata(id);
    ctx.type = metadata.mimeType;
    ctx.response.attachment(metadata.fileName);
    ctx.body = await getFileByIdCtx.getReadableFileStream(id);
  };
