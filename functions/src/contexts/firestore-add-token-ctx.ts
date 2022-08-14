import { AddTokenCtx } from "../types/types";
import { saveToken } from "../services/firestore";

export const firestoreAddTokenCtx: AddTokenCtx = {
  saveToken: ({ token, user }) => saveToken({ token, user }),
};
