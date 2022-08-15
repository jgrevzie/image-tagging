import { auth, getToken } from "../auth";
import { AuthCtx } from "../../types/types";
import { Context } from "koa";

const masterToken = "55555";

describe(getToken, () => {
  test("throws if missing altogether", () => {
    expect(() => getToken(undefined)).toThrow(/Unauthorized/);
  });

  test("throws if bearer token is missing", () => {
    expect(() => getToken("password")).toThrow(/Unauthorized/);
  });

  test("returns token if present", () => {
    const token = "12345";
    expect(getToken(`Bearer ${token}`)).toBe(token);
  });
});

describe(auth, () => {
  const koaCtx = {
    headers: { authorization: "Bearer 12345" },
    state: {},
  } as unknown as Context;

  const userName = "name";
  const token = "12345";
  const user = { userName, token };

  beforeEach(() => {
    process.env.MASTER_TOKEN = masterToken;
  });

  test("will reject unknown token", async () => {
    const authCtx: AuthCtx = {
      getUserByToken: jest.fn(() => Promise.resolve(null)),
    };

    await expect(() =>
      auth(authCtx)(koaCtx, () => Promise.resolve())
    ).rejects.toThrow(/Unauthorized/);
  });

  test("will pass onto next middleware if token exists", async () => {
    const authCtx: AuthCtx = {
      getUserByToken: jest.fn(() => Promise.resolve(user)),
    };
    const next = jest.fn();

    await auth(authCtx)(koaCtx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test("will add user to context if token exists", async () => {
    const authCtx: AuthCtx = {
      getUserByToken: jest.fn(() => Promise.resolve(user)),
    };
    const next = jest.fn();

    await auth(authCtx)(koaCtx, next);

    expect(koaCtx.state.user).toStrictEqual(user);
  });
});
