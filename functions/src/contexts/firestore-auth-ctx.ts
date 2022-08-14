import { AuthCtx } from "../types/types";
import { getUserByToken } from "../services/firestore";

export const firestoreAuthCtx: AuthCtx = {
  getUserByToken: (token: string): Promise<string | null> =>
    getUserByToken(token),
};
