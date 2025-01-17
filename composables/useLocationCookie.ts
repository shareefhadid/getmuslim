export const useLocationCookie = () => {
  const location = useCookie<{ lat?: number; long?: number }>("location", {
    default: () => ({ lat: undefined, long: undefined }),
  });

  return location;
};
