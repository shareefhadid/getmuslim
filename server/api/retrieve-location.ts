import mapbox from "@mapbox/search-js-core";
import { z } from "zod";

const runtimeConfig = useRuntimeConfig();
const search = new mapbox.SearchBoxCore({
  accessToken: runtimeConfig.mapboxToken,
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { suggestion } = z.object({ suggestion: z.any() }).parse(body);

    const sessionToken =
      getCookie(event, "searchSessionToken") ||
      new mapbox.SessionToken().toString();

    const { features } = await search.retrieve(suggestion, {
      sessionToken,
    });

    deleteCookie(event, "searchSessionToken");

    const feature = features[0] ?? null;

    if (feature) {
      setCookie(
        event,
        "location",
        JSON.stringify({
          long: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1],
          place: feature.properties.context.place?.name,
        }),
        {
          maxAge: 2000000000,
        },
      );
    }

    return { feature };
  } catch (error) {
    handleServerError(event, error);
  }
});
