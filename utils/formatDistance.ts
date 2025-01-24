export const formatDistance = (distanceInMeter: number) => {
  const distanceInKm = distanceInMeter / 1000;

  if (distanceInKm > 100) {
    return "100 km+";
  } else if (distanceInKm >= 1) {
    return `${Math.round(distanceInKm)} km`;
  } else {
    return `${distanceInKm.toFixed(1)} km`;
  }
};
