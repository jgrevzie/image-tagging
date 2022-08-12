import * as functions from "firebase-functions";
import * as Koa from "koa";
import {Context} from "koa";
import * as Router from "@koa/router";

const app = new Koa();
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const router = new Router();

router.get("/", async (ctx:Context) => {
  ctx.body = "Hello World";
});


export const api = functions.https.onRequest(app.callback());
