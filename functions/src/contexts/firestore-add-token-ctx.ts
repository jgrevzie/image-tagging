import { AddTokenCtx } from "../types/types";
import { saveToken } from "../services/firestore";

export const firestoreAddTokenCtx: AddTokenCtx = {
  saveToken: ({ token, userName }) => saveToken({ token, userName }),
};
