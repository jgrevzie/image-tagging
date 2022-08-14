import * as FirebaseAdmin from "firebase-admin";
import * as pump from "pump";
import { Readable } from "stream";

export const saveToCloudStorage = async ({
  id,
  mimeType,
  readable,
}: {
  id: string;
  mimeType: string;
  readable: Readable;
}): Promise<void> => {
  const bucket = FirebaseAdmin.storage().bucket();

  const cloudFile = bucket.file(id);
  await new Promise<void>((resolve, reject) =>
    pump(
      readable,
      cloudFile.createWriteStream({ contentType: mimeType }),
      (err: Error | undefined) => (err ? reject(err) : resolve())
    )
  );
};

export const deleteFromCloudStorage = async (id: string): Promise<void> => {
  const bucket = FirebaseAdmin.storage().bucket();

  const cloudFile = bucket.file(id);
  await cloudFile.delete();
};

export const doesFileExist = async (id: string): Promise<boolean> => {
  const bucket = FirebaseAdmin.storage().bucket();

  return (await bucket.file(id).exists())[0];
};

export const getReadableFileStream = (id: string): Readable => {
  const bucket = FirebaseAdmin.storage().bucket();

  return bucket.file(id).createReadStream();
};
