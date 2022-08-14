import { getFileMetadata } from "../get-file-metadata";
import { FileMetadata, GetFileMetadataCtx } from "../../types/types";
import { Context } from "koa";
import { DateTime } from "luxon";

const id = "12345";
const mockKoaCtx = { params: { id } } as unknown as Context;
const metadata: FileMetadata = {
  id,
  dateUploaded: DateTime.fromISO("2022-01-01"),
  mimeType: "mime/type",
  name: "name",
};

describe(getFileMetadata, () => {
  test("throws error if file doesn't exist", async () => {
    const mockGetFileMetadataCtx = {
      doesFileExist: () => Promise.resolve(false),
    } as unknown as GetFileMetadataCtx;

    await expect(() =>
      getFileMetadata(mockGetFileMetadataCtx)(mockKoaCtx)
    ).rejects.toThrow(/does not exist/);
  });

  test("sets body to metadata", async () => {
    const mockGetFileMetadataCtx = {
      doesFileExist: () => Promise.resolve(true),
      getMetadata: () => Promise.resolve(metadata),
    } as unknown as GetFileMetadataCtx;

    await getFileMetadata(mockGetFileMetadataCtx)(mockKoaCtx);

    expect(mockKoaCtx.body).toStrictEqual(metadata);
  });
});
