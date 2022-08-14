import * as functions from "firebase-functions";
import * as Koa from "koa";
import * as Router from "@koa/router";
import { uploadFile } from "./routes/upload-file";
import { cloudStorageUploadCtx } from "./contexts/cloud-storage-upload-ctx";
import * as FirebaseAdmin from "firebase-admin";
import { patchFile } from "./routes/patch-file";
import { firestorePatchCtx } from "./contexts/firestore-patch-ctx";
import { cloudStorageGetByIdCtx } from "./contexts/cloud-storage-get-file-by-id-ctx";
import { getFileById } from "./routes/get-file-by-id";
import { firestoreGetMetadataCtx } from "./contexts/firestore-get-metadata";
import { getFileMetadata } from "./routes/get-file-metadata";
import { search } from "./routes/search";
import { firestoreSearchCtx } from "./contexts/firestore-search-ctx";
import { accessLogger } from "./middleware/access-logger";
import { firestoreAuthCtx } from "./contexts/firestore-auth-ctx";
import { auth } from "./middleware/auth";
import { addToken } from "./routes/add-token";
import { firestoreAddTokenCtx } from "./contexts/firestore-add-token-ctx";

FirebaseAdmin.initializeApp();

const app = new Koa();

const imageRouter = new Router();

imageRouter
  .prefix("/images")
  .post("/", uploadFile(cloudStorageUploadCtx))
  .patch("/:id", patchFile(firestorePatchCtx))
  .get("/", search(firestoreSearchCtx))
  .get("/:id", getFileById(cloudStorageGetByIdCtx))
  .get("/:id/metadata", getFileMetadata(firestoreGetMetadataCtx));

const tokenRouter = new Router();
tokenRouter.post("/tokens", addToken(firestoreAddTokenCtx));

app
  .use(auth(firestoreAuthCtx))
  .use(accessLogger)
  .use(imageRouter.routes())
  .use(tokenRouter.routes());

// noinspection JSUnusedGlobalSymbols
export const api = functions.https.onRequest(app.callback());
