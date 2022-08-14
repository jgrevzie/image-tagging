import { SearchCtx } from "../types/types";
import {
  byFromDate,
  byTag,
  byToDate,
  getAllFilesQuery,
  getMetadataMatchingQuery,
  orderByDate,
} from "../services/firestore";

export const firestoreSearchCtx: SearchCtx = {
  search: async ({ tag, startDate, endDate }): Promise<string[]> => {
    const allFilesQuery = getAllFilesQuery();

    const tagQuery = tag ? byTag(tag, allFilesQuery) : allFilesQuery;

    const fromDateQuery = startDate
      ? byFromDate(startDate, tagQuery)
      : tagQuery;

    const toDateQuery = endDate
      ? byToDate(endDate, fromDateQuery)
      : fromDateQuery;

    const ordered = orderByDate(toDateQuery);

    return (await getMetadataMatchingQuery(ordered)).map((m) => m.id);
  },
};
