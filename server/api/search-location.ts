import mapbox from "@mapbox/search-js-core";
import { z } from "zod";

const runtimeConfig = useRuntimeConfig();
const search = new mapbox.SearchBoxCore({
  accessToken: runtimeConfig.mapboxToken,
});

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    const { searchText } = z
      .object({
        searchText: z.string(),
      })
      .parse(query);

    const sessionToken =
      getCookie(event, "searchSessionToken") ||
      new mapbox.SessionToken().toString();

    setCookie(event, "searchSessionToken", sessionToken, {
      maxAge: 60 * 60,
    });

    const { suggestions } = await search.suggest(searchText, {
      sessionToken,
      limit: 5,
      types: "place",
    });

    return { suggestions, sessionToken };
  } catch (error) {
    handleServerError(event, error);
  }
});
