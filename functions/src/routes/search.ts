import { Context } from "koa";
import { BadRequest } from "http-errors";
import { DateTime } from "luxon";
import { SearchCtx, SearchParams } from "../types/types";

export const search = (searchCtx: SearchCtx) => async (ctx: Context) => {
  const params = checkParams(ctx);
  ctx.body = await searchCtx.search(params);
};

export const checkParams = (ctx: Context): SearchParams => {
  const tag = ctx.query?.tag;

  // noinspection SuspiciousTypeOfGuard
  if (tag && typeof tag !== "string") {
    throw new BadRequest("'tag' must be a string'");
  }

  const startDateString = ctx.query?.startDate;
  const startDate = getDate(startDateString);

  const endDateString = ctx.query?.endDate;
  const endDate = getDate(endDateString);

  return { tag, startDate, endDate };
};

export const getDate = (dateString: unknown): DateTime | undefined => {
  if (!dateString) return undefined;

  if (typeof dateString !== "string") {
    throw new BadRequest("startDate and endDate must be strings");
  }

  const dateTime = DateTime.fromISO(dateString);

  if (!dateTime.isValid) {
    throw new BadRequest("startDate and endDate must be ISO8601 compliant");
  }

  return dateTime;
};
