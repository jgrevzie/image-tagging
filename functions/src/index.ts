import * as functions from "firebase-functions";
import * as Koa from "koa";
import * as Router from "@koa/router";
import { uploadPost } from "./routes/upload-post";
import { dummyUploadCtx } from "./contexts/mock-upload-ctx";

const app = new Koa();

const router = new Router();
app.use(router.routes());

router.prefix("/images").post("/", uploadPost(dummyUploadCtx));

export const api = functions.https.onRequest(app.callback());
