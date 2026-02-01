import { useUser } from "@clerk/clerk-expo";
import { Platform, Image, Text, View } from "react-native";

import RydeLayout from "@/components/RydeLayout";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";
import Payment from "@/components/Payment";
import { useEffect, useState } from "react";

const BookRide = () => {
  const { user } = useUser();
  const { userAddress, destinationAddress } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const driverDetails = drivers?.filter(
    (driver) => +driver.driver_id === selectedDriver,
  )[0];

  const [StripeProviderComponent, setStripeProviderComponent] = useState<any>(null);
  const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  useEffect(() => {
    // Only try to load the native stripe provider on native platforms and when a key is present.
    if (Platform.OS === "web" || !publishableKey) {
      setStripeProviderComponent(null);
      return;
    }

    let mounted = true;
    import("@stripe/stripe-react-native")
        .then((mod) => {
          if (mounted) {
            // prefer named export, fall back to default
            setStripeProviderComponent(mod.StripeProvider || mod.default || null);
          }
        })
        .catch(() => {
          // If import fails (not linked / not available), swallow error and render without StripeProvider.
          if (mounted) setStripeProviderComponent(null);
        });

    return () => {
      mounted = false;
    };
  }, [publishableKey]);

  const content = (
      <RydeLayout title="Book Ride" snapPoints={["12%", "85%"]}>
        <>
          <Text className="text-xl font-JakartaSemiBold mb-3">
            Ride Information
          </Text>

          <View className="flex flex-col w-full items-center justify-center mt-10">
            <Image
              source={{ uri: driverDetails?.profile_image_url }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />

            <View className="flex flex-row items-center justify-center mt-5 space-x-2">
              <Text className="text-lg font-JakartaSemiBold">
                {driverDetails?.title}
              </Text>

              <View className="flex flex-row items-center space-x-0.5 pl-1">
                <Image
                  source={icons.star}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-lg font-JakartaRegular">
                  {driverDetails?.rating}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex flex-col w-full items-start justify-center py-3 px-5 bg-general-600 rounded-3xl mt-5">
            <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
              <Text className="text-lg font-JakartaRegular">Ride Price</Text>
              <Text className="text-lg font-JakartaRegular text-green-500">
                ${driverDetails?.price}
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
              <Text className="text-lg font-JakartaRegular">Pickup Time</Text>
              <Text className="text-lg font-JakartaRegular">
                {formatTime(parseInt(`${driverDetails?.time}`) || 5)}
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full py-3">
              <Text className="text-lg font-JakartaRegular">Car Seats</Text>
              <Text className="text-lg font-JakartaRegular">
                {driverDetails?.car_seats}
              </Text>
            </View>
          </View>

          <View className="flex flex-col w-full items-start justify-center mt-5">
            <View className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 w-full py-3">
              <Image source={icons.to} className="w-6 h-6" />
              <Text className="text-lg font-JakartaRegular ml-2">
                {userAddress}
              </Text>
            </View>

            <View className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
              <Image source={icons.point} className="w-6 h-6" />
              <Text className="text-lg font-JakartaRegular ml-2">
                {destinationAddress}
              </Text>
            </View>
          </View>

          <Payment
            fullName={user?.fullName!}
            email={user?.emailAddresses[0].emailAddress!}
            amount={driverDetails?.price!}
            driverId={driverDetails?.driver_id}
            rideTime={driverDetails?.time!}
          />
        </>
      </RydeLayout>
  );

  // If we have a StripeProvider component and a publishable key, wrap; otherwise render content directly.
  if (StripeProviderComponent && publishableKey) {
    return (
        <StripeProviderComponent
            publishableKey={publishableKey}
            merchantIdentifier="merchant.uber.com"
            urlScheme="uberclone"
        >
          {content}
        </StripeProviderComponent>
    );
  }

  return content;
};

export default BookRide;
