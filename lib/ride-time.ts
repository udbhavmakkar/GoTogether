const RIDE_CONFLICT_WINDOW_MINUTES = 120;

export function getRideStart(date: Date, time: string) {
  const [hourText, minuteText] = time.split(":");
  const rideStart = new Date(date);

  rideStart.setHours(Number(hourText), Number(minuteText), 0, 0);

  return rideStart;
}

export function hasRideTimeConflict(
  candidateDate: Date,
  candidateTime: string,
  rides: Array<{ departureDate: Date; departureTime: string }>,
) {
  const candidateStart = getRideStart(candidateDate, candidateTime).getTime();

  return rides.some((ride) => {
    const rideStart = getRideStart(ride.departureDate, ride.departureTime).getTime();
    const differenceInMinutes = Math.abs(candidateStart - rideStart) / (1000 * 60);

    return differenceInMinutes < RIDE_CONFLICT_WINDOW_MINUTES;
  });
}

export function isUpcomingRide(date: Date, time: string, now: Date) {
  return getRideStart(date, time) >= now;
}
