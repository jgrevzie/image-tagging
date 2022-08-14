import { getFileById } from "../get-file-by-id";
import { GetFileByIdCtx } from "../../types/types";
import { Context } from "koa";
import { DateTime } from "luxon";
import { Readable } from "stream";

const id = "12345";
const mockKoaCtx = { params: { id } } as unknown as Context;
const dateUploaded = DateTime.fromISO("2022-01-01");
const mimeType = "image/jpeg";
const name = "file-name.jpg";
const fileContents = "dummy contents of jpeg";

const fullMockGetFileByIdCtx: GetFileByIdCtx = {
  doesFileExist: () => Promise.resolve(true),
  getMetadata: () =>
    Promise.resolve({
      id,
      dateUploaded,
      mimeType,
      name,
    }),
  getReadableFileStream: () => Readable.from(fileContents),
};

describe(getFileById, () => {
  test("if file is missing, throw error", async () => {
    const mockGetFileByIdCtx = {
      doesFileExist: () => Promise.resolve(false),
    } as unknown as GetFileByIdCtx;

    await expect(
      async () => await getFileById(mockGetFileByIdCtx)(mockKoaCtx)
    ).rejects.toThrow(/does not exist/);
  });

  test("sets content type from metadata", async () => {
    await getFileById(fullMockGetFileByIdCtx)(mockKoaCtx);
    expect(mockKoaCtx.type).toBe(mimeType);
  });

  test("body is readable stream of file content", async () => {
    await getFileById(fullMockGetFileByIdCtx)(mockKoaCtx);

    const result = await streamToString(mockKoaCtx.body as Readable);
    expect(result).toBe(fileContents);
  });
});

const streamToString = (stream: Readable): Promise<string> => {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
};
