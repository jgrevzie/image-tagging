import { Middleware } from "koa";
import { Unauthorized } from "http-errors";
import { AuthCtx, KoaState } from "../types/types";

export const auth =
  (authCtx: AuthCtx): Middleware<KoaState> =>
  async (ctx, next) => {
    const token = getToken(ctx.headers.authorization);

    const userName =
      token === getMasterToken()
        ? "master user"
        : (await authCtx.getUserByToken(token))?.userName;

    if (!userName) {
      throw new Unauthorized();
    }

    ctx.state.user = { userName, token };

    await next();
  };

export const getToken = (authHeader: string | undefined) => {
  if (!authHeader) throw new Unauthorized();

  if (!authHeader.match(/bearer\s+\w+/i)) throw new Unauthorized();

  const bearer = authHeader.replace(/bearer\s/i, "");

  if (!bearer) throw new Unauthorized();

  return bearer;
};

const getMasterToken = (): string => {
  const masterToken = process.env.MASTER_TOKEN;
  if (!masterToken) {
    throw Error(
      "Please define MASTER_TOKEN in a .env file located in the functions directory"
    );
  }
  return masterToken;
};
