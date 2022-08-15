import { addToken, getParams } from "../add-token";
import { Context } from "koa";
import { AddTokenCtx } from "../../types/types";

const token = "1234";
const userName = "user";

describe(addToken, () => {
  test("saves token", async () => {
    const mockAddTokenCtx: AddTokenCtx = { saveToken: jest.fn() };
    const mockKoaCtx = {
      req: { body: { token, user: userName } },
    } as Context;

    await addToken(mockAddTokenCtx)(mockKoaCtx, async () => undefined);

    expect(mockAddTokenCtx.saveToken).toHaveBeenCalledWith({
      token,
      userName,
    });
  });
});

describe(getParams, () => {
  test("expects token in payload", () => {
    const mockCtx = { req: { body: {} } } as Context;
    expect(() => getParams(mockCtx)).toThrow(/token/);
  });

  test("expects user in payload", () => {
    const mockCtx = { req: { body: { token: "1234" } } } as Context;
    expect(() => getParams(mockCtx)).toThrow(/user/);
  });

  test("extracts user and token", () => {
    const mockCtx = {
      req: { body: { token, user: userName } },
    } as Context;
    const result = getParams(mockCtx);

    expect(result).toStrictEqual({ token, userName });
  });
});
