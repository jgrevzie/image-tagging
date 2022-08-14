import { Context } from "koa";
import { GetFileMetadataCtx } from "../types/types";
import { BadRequest } from "http-errors";

export const getFileMetadata =
  (getFileMetadata: GetFileMetadataCtx) => async (ctx: Context) => {
    const id = ctx.params.id;

    if (!(await getFileMetadata.doesFileExist(id))) {
      throw new BadRequest(`file ${id} does not exist`);
    }

    ctx.body = await getFileMetadata.getMetadata(id);
  };
