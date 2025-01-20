export const useLocationCookie = () => {
  const locationCookie = useCookie<{
    lat?: number;
    long?: number;
    place?: string;
  }>("location");

  return computed(() => {
    const data = locationCookie.value ? locationCookie.value : {};

    return {
      lat: data.lat,
      long: data.long,
      place: data.place,
      isSet: !!data.lat && !!data.long && !!data.place,
    };
  });
};
