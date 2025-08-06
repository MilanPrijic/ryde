import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useDriverStore, useLocationStore } from "@/store";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useEffect, useState } from "react";
import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import MapViewDirections from "react-native-maps-directions";

const Map = ({ shouldShowDirectionsIfPossible = true }) => {
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");

  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  } = useLocationStore();

  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  });

  const { selectedDriver, setDrivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLongitude || !userLatitude) {
        return;
      }
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (markers.length > 0 && destinationLatitude && destinationLongitude) {
      calculateDriverTimes({
        markers,
        userLongitude,
        userLatitude,
        destinationLongitude,
        destinationLatitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  if (loading || (!userLongitude && !userLatitude)) {
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {markers.map((marker) => (
        <Marker
          key={marker.driver_id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === marker.driver_id
              ? icons.selectedMarker
              : icons.marker
          }
        />
      ))}
      {shouldShowDirectionsIfPossible ? (
        <>
          {destinationLongitude && destinationLatitude && (
            <>
              <Marker
                key="destination"
                coordinate={{
                  latitude: destinationLatitude,
                  longitude: destinationLongitude,
                }}
                title="Destination"
                image={icons.pin}
              />
            </>
          )}
          {userLongitude &&
            userLatitude &&
            destinationLongitude &&
            destinationLatitude && (
              <MapViewDirections
                origin={{
                  latitude: userLatitude!,
                  longitude: userLongitude!,
                }}
                destination={{
                  latitude: destinationLatitude!,
                  longitude: destinationLongitude!,
                }}
                apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
                strokeColor="#0286ff"
                strokeWidth={3}
              />
            )}
        </>
      ) : null}
    </MapView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Map;
