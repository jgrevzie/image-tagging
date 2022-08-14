import { PatchFileCtx } from "../types/types";
import { addTagToFilePointer, doesFileExist } from "../services/firestore";
import { BadRequest } from "http-errors";

export const firestorePatchCtx: PatchFileCtx = {
  addTagToFilePointer: async ({ id, tag }) => {
    if (!(await doesFileExist(id))) {
      throw new BadRequest(`file ${id} doesn't exist`);
    }
    await addTagToFilePointer({ id, tag });
  },
};
