import { Middleware } from "koa";
import { log } from "firebase-functions/lib/logger";
import { KoaState } from "../types/types";

export const accessLogger: Middleware<KoaState> = async (ctx, next) => {
  log("access log", {
    who: ctx.state.user,
    userAgent: ctx.header["user-agent"],
    path: ctx.request.path,
  });
  await next();
};
