import { checkParams, patchFile } from "../patch-file";
import { Context } from "koa";
import { PatchFileCtx } from "../../types/types";

const id = "12345";
const tag = "tag";

describe(patchFile, () => {
  test("adds tag to file pointer", async () => {
    const mockKoaCtx = {
      params: { id },
      req: { body: { tag } },
    } as unknown as Context;

    const mockPatchFileCtx: PatchFileCtx = {
      addTagToFilePointer: jest.fn(),
    };

    await patchFile(mockPatchFileCtx)(mockKoaCtx);

    expect(mockPatchFileCtx.addTagToFilePointer).toBeCalledWith({ id, tag });
  });
});

describe(checkParams, () => {
  test("requires 'tag'", () => {
    const mockKoaCtx = { req: { body: {} } } as unknown as Context;

    expect(() => checkParams(mockKoaCtx)).toThrow(/expecting 'tag'/);
  });

  test("returns tag and id", () => {
    const mockKoaCtx = {
      params: { id },
      req: { body: { tag } },
    } as unknown as Context;

    expect(checkParams(mockKoaCtx)).toStrictEqual({ id, tag });
  });
});
