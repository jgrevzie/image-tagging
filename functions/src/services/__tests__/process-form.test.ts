import { processForm } from "../process-form";
import * as FormData from "form-data";
import { Context } from "koa";
import { Err, Ok } from "ts-results";
import { UploadFileCtx } from "../../types/types";

const fileContents = "here is the content of the file";

describe(processForm, () => {
  test("if file is bad (e.g. bad mime type), then throw", async () => {
    const uploadFileCtx = {
      isGoodFile: () => Err("bad mime type"),
    } as unknown as UploadFileCtx;

    await expect(() => processForm(getKoaCtx(), uploadFileCtx)).rejects.toThrow(
      /mime/
    );
  });

  test("saves file if file is good", async () => {
    const uploadFileCtx: UploadFileCtx = {
      isGoodFile: () => Ok(null),
      saveFile: jest.fn(async ({ fileName: _1, mimeType: _2, readable }) => {
        readable.resume();
        return "12345";
      }),
    };

    await processForm(getKoaCtx(), uploadFileCtx);

    expect(uploadFileCtx.saveFile).toHaveBeenCalledTimes(1);
  });
});

const getKoaCtx = (): Context => {
  const readableStream = Buffer.from(fileContents);

  const form = new FormData();
  form.append("file", readableStream);

  const headers = form.getHeaders();

  return {
    headers,
    req: { rawBody: form.getBuffer() },
    state: { user: { token: "12345", user: "user" } },
  } as unknown as Context;
};
