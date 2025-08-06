const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

    return {
      id: driver.driver_id,
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      ...driver,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
  const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude
  )
    return;

  try {
    const timesPromises = markers.map(async (marker) => {
      const responseToUser = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${directionsAPI}`,
      );
      const dataToUser = await responseToUser.json();
      const timeToUser = dataToUser.routes[0].legs[0].duration.value; // Time in seconds

      const responseToDestination = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`,
      );
      const dataToDestination = await responseToDestination.json();
      const timeToDestination =
        dataToDestination.routes[0].legs[0].duration.value; // Time in seconds

      const totalTime = (timeToUser + timeToDestination) / 60; // Total time in minutes
      const price = (totalTime * 0.5).toFixed(2); // Calculate price based on time

      return { ...marker, time: totalTime, price };
    });

    return await Promise.all(timesPromises);
  } catch (error) {
    console.error("Error calculating driver times:", error);
  }
};

export const formGeoapifyMapImageUrl = ({
  originLatitude,
  originLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
}) => {
  const origin = `${originLongitude},${originLatitude}`;
  const destination = `${destinationLongitude},${destinationLatitude}`;
  const center = `${(Number(originLongitude) + Number(destinationLongitude)) / 2},${(Number(originLatitude) + Number(destinationLatitude)) / 2}`;

  // Markers: origin (start), destination (end)
  const originMarker = `marker=lonlat:${origin};color:%230000ff;type:material;icon:circle;size:large`;
  const destMarker = `marker=lonlat:${destination};color:%23006400;type:awesome;icon:flag;size:large`;
  const centerPoint = `center=lonlat:${center}`;
  const zoom = `zoom=12`;

  // Path: line from origin to destination - but will not show on the free Geoapify plan
  // On the free plan, including path in the URL causes a 400 error, even if the syntax is correct.
  // const path = `path=lonlat:${origin}|${destination};stroke:%230064ff;stroke-width:4`;

  return `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=800&height=600&${zoom}&${centerPoint}&${originMarker}&${destMarker}&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`;
};
