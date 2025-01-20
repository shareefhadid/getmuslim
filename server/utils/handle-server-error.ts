import { EventHandlerRequest, H3Error, H3Event } from "h3";

export const handleServerError = (
  event: H3Event<EventHandlerRequest>,
  error: unknown,
) => {
  logError(getRequestURL(event).pathname, error);
  if (error instanceof H3Error) throw error;
  throw createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
};
