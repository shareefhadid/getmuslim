import mapbox from "@mapbox/search-js-core";
import { z } from "zod";

const runtimeConfig = useRuntimeConfig();
const search = new mapbox.SearchBoxCore({
  accessToken: runtimeConfig.mapboxToken,
});

export default defineEventHandler(async (event) => {
  try {
    const { searchText, types } = await getValidatedQuery(
      event,
      z.object({
        searchText: z.string(),
        types: z.string().optional(),
      }).parse,
    );

    const sessionToken =
      getCookie(event, "searchSessionToken") ||
      new mapbox.SessionToken().toString();

    setCookie(event, "searchSessionToken", sessionToken, {
      maxAge: 60 * 60,
    });

    const { suggestions } = await search.suggest(searchText, {
      sessionToken,
      limit: 5,
      types,
    });

    return { suggestions, sessionToken };
  } catch (error) {
    handleServerError(event, error);
  }
});
