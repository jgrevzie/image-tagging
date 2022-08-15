import { AuthCtx, User } from "../types/types";
import { getUserByToken } from "../services/firestore";

export const firestoreAuthCtx: AuthCtx = {
  getUserByToken: (token: string): Promise<User | null> =>
    getUserByToken(token),
};
