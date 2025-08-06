import { View, Text } from "react-native";
import { useLocationStore } from "@/store";
import RydeLayout from "@/components/RydeLayout";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton/CustomButton";
import { router } from "expo-router";
import ROUTES from "@/constants/route";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <RydeLayout title="Ride" snapPoints={["85%"]}>
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold">From</Text>
        <GoogleTextInput
          icon={icons.target}
          initialLocation={userAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          handlePress={(location) => setUserLocation(location)}
        />
      </View>
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold">To</Text>
        <GoogleTextInput
          icon={icons.map}
          initialLocation={destinationAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={(location) => setDestinationLocation(location)}
        />
      </View>

      <CustomButton
        title="Find now"
        onPress={() => router.push(ROUTES.CONFIRM_RIDE)}
        className="mt-5"
      />
    </RydeLayout>
  );
};

export default FindRide;
