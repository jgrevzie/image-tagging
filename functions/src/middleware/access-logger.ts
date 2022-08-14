import { Middleware } from "koa";
import { log } from "firebase-functions/lib/logger";

export const accessLogger: Middleware = async (ctx, next) => {
  log("access log", {
    who: ctx.state.user,
    userAgent: ctx.header["user-agent"],
    path: ctx.request.path,
  });
  await next();
};
