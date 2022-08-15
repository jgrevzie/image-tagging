import { checkParams, getDate, search } from "../search";
import { Context } from "koa";
import { DateTime } from "luxon";
import { SearchCtx } from "../../types/types";

const tag = "tag";
const startDate = "2022-01-01";
const endDate = "2022-01-02";
const id = "12345";

describe(getDate, () => {
  test("throws if not string", () => {
    expect(() => getDate(5)).toThrow(/be string/);
  });

  test("throws if not valid ISO date", () => {
    expect(() => getDate("2002/01/01")).toThrow(/ISO8601/);
  });
});

describe(checkParams, () => {
  test("if tag is present, it must be a string", () => {
    const koaCtx = { query: { tag: 5 } } as unknown as Context;
    expect(() => checkParams(koaCtx)).toThrow(/a string/);
  });

  test("if data is valid, will return search params", () => {
    const koaCtx = { query: { tag, startDate, endDate } } as unknown as Context;
    expect(checkParams(koaCtx)).toStrictEqual({
      tag,
      startDate: DateTime.fromISO(startDate),
      endDate: DateTime.fromISO(endDate),
    });
  });
});

describe(search, () => {
  test("provides search results in body", async () => {
    const koaCtx = { query: { tag, startDate, endDate } } as unknown as Context;
    const mockSearchCtx: SearchCtx = {
      search: () => Promise.resolve([id]),
    };

    await search(mockSearchCtx)(koaCtx, async () => undefined);
    expect(koaCtx.body).toStrictEqual([id]);
  });
});
