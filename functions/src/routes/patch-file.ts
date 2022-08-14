import { Context } from "koa";
import { BadRequest } from "http-errors";
import { PatchFileCtx } from "../types/types";

export const patchFile =
  (patchFileCtx: PatchFileCtx) => async (ctx: Context) => {
    const params = checkParams(ctx);
    await patchFileCtx.addTagToFilePointer(params);
    ctx.body = "OK";
  };

export const checkParams = (ctx: Context): { tag: string; id: string } => {
  const tag = ctx.req.body?.tag;

  if (!tag) throw new BadRequest("expecting 'tag' in JSON payload");

  // noinspection SuspiciousTypeOfGuard
  if (typeof tag !== "string") {
    throw new BadRequest("'tag' must be a string'");
  }

  // koa guarantees this param
  const id = ctx.params.id;

  return { tag, id };
};
