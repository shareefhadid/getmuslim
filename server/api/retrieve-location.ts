import mapbox, { SearchBoxFeatureSuggestion } from "@mapbox/search-js-core";
import { z } from "zod";

const runtimeConfig = useRuntimeConfig();
const search = new mapbox.SearchBoxCore({
  accessToken: runtimeConfig.mapboxToken,
});

export default defineEventHandler(async (event) => {
  try {
    const { suggestion, setLocationCookie } = await readValidatedBody(
      event,
      z.object({
        suggestion: z.any(),
        setLocationCookie: z.boolean().optional().default(false),
      }).parse,
    );

    const sessionToken =
      getCookie(event, "searchSessionToken") ||
      new mapbox.SessionToken().toString();

    const { features } = await search.retrieve(suggestion, {
      sessionToken,
    });

    deleteCookie(event, "searchSessionToken");

    const feature: SearchBoxFeatureSuggestion = features[0] ?? null;

    if (feature && setLocationCookie) {
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
