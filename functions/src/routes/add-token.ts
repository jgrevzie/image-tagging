import { Context, Middleware } from "koa";
import { BadRequest } from "http-errors";
import { AddTokenCtx, KoaState } from "../types/types";

export const addToken =
  (addTokenCtx: AddTokenCtx): Middleware<KoaState> =>
  async (ctx: Context) => {
    const { token, userName } = getParams(ctx);

    await addTokenCtx.saveToken({ token, userName });

    ctx.body = "OK";
  };

export const getParams = (ctx: Context) => {
  const token = ctx.req.body.token;
  if (!token || typeof token !== "string") {
    throw new BadRequest("expected 'token' in payload");
  }

  const userName = ctx.req.body.user;
  if (!userName || typeof userName !== "string") {
    throw new BadRequest("expected 'userName' in payload");
  }

  return { token, userName };
};
