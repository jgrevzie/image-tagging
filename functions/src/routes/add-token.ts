import { Context } from "koa";
import { BadRequest } from "http-errors";
import { AddTokenCtx } from "../types/types";

export const addToken = (addTokenCtx: AddTokenCtx) => async (ctx: Context) => {
  const { token, user } = getParams(ctx);

  await addTokenCtx.saveToken({ token, user });

  ctx.body = "OK";
};

export const getParams = (ctx: Context) => {
  const token = ctx.req.body.token;
  if (!token || typeof token !== "string") {
    throw new BadRequest("expected 'token' in payload");
  }

  const user = ctx.req.body.user;
  if (!user || typeof user !== "string") {
    throw new BadRequest("expected 'user' in payload");
  }

  return { token, user };
};
