import * as FirebaseAdmin from "firebase-admin";
import { firestore } from "firebase-admin";
import { FileMetadata } from "../types/types";
import { DateTime } from "luxon";

const filePointerCollection = () =>
  FirebaseAdmin.firestore().collection("filePointers");

const userTokenCollection = () =>
  FirebaseAdmin.firestore().collection("userTokens");

export const newDbFilePointer = ({
  id,
  mimeType,
  fileName,
}: {
  id: string;
  mimeType: string;
  fileName: string;
}) =>
  filePointerCollection().doc(id).set({
    id,
    mimeType,
    fileName,
    uploadedAt: FirebaseAdmin.firestore.FieldValue.serverTimestamp(),
  });

export const addTagToFilePointer = ({ id, tag }: { id: string; tag: string }) =>
  filePointerCollection()
    .doc(id)
    .update({
      tags: FirebaseAdmin.firestore.FieldValue.arrayUnion(tag),
      // We don't use the result of the update, so cast it to void
      // If there is an error, then an exception is thrown
    }) as Promise<unknown> as Promise<void>;

export const doesFileExist = (id: string): Promise<boolean> =>
  filePointerCollection()
    .doc(id)
    .get()
    .then((d) => d.exists)
    .catch((_) => false);

export const getMetadata = (id: string): Promise<FileMetadata> =>
  filePointerCollection()
    .doc(id)
    .get()
    .then((d) => d.data() as FileMetadata);

export const getAllFilesQuery = () => filePointerCollection();

export const byTag = (
  tag: string,
  query: firestore.Query<firestore.DocumentData>
) => query.where("tags", "array-contains", tag);

export const byFromDate = (
  fromDate: DateTime,
  query: firestore.Query<firestore.DocumentData>
) => query.where("uploadedAt", ">=", fromDate.toJSDate());

export const byToDate = (
  toDate: DateTime,
  query: firestore.Query<firestore.DocumentData>
) => query.where("uploadedAt", "<", toDate.toJSDate());

export const orderByDate = (query: firestore.Query<firestore.DocumentData>) =>
  query.orderBy("uploadedAt");

export const getMetadataMatchingQuery = (
  query: firestore.Query<firestore.DocumentData>
) => query.get().then((snapshot) => snapshot.docs.map(toMetadata));

const toMetadata = (
  doc: firestore.QueryDocumentSnapshot<firestore.DocumentData>
) => doc.data() as FileMetadata;

export const getUserByToken = (token: string) =>
  userTokenCollection()
    .doc(token)
    .get()
    .then((d) => d?.data()?.user)
    .catch((_) => null);

export const saveToken = ({ user, token }: { user: string; token: string }) =>
  userTokenCollection()
    .doc(token)
    .set({ user }) as Promise<unknown> as Promise<void>;
