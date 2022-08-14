import { Context } from "koa";
import { BadRequest } from "http-errors";
import { GetFileByIdCtx } from "../types/types";

export const getFileById =
  (getFileByIdCtx: GetFileByIdCtx) => async (ctx: Context) => {
    const id = ctx.params.id;

    if (!(await getFileByIdCtx.doesFileExist(id))) {
      throw new BadRequest(`file ${id} does not exist`);
    }

    ctx.type = (await getFileByIdCtx.getMetadata(id)).mimeType;
    ctx.body = await getFileByIdCtx.getReadableFileStream(id);
  };
