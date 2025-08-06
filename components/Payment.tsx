import CustomButton from "@/components/CustomButton/CustomButton";
import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import { Alert, View, Image, Text } from "react-native";
import { fetchAPI } from "@/lib/fetch";
import { IntentCreationCallbackParams } from "@stripe/stripe-react-native/src/types/PaymentSheet";
import { Result } from "@stripe/stripe-react-native/src/types/PaymentMethod";
import { useLocationStore } from "@/store";
import { useAuth } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";
import { images } from "@/constants";
import { router } from "expo-router";
import ROUTES from "@/constants/route";

const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { userId } = useAuth();
  const [success, setSuccess] = useState(false);
  const {
    userAddress,
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
    destinationAddress,
  } = useLocationStore();

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Ryde, Inc.",
      intentConfiguration: {
        mode: {
          amount: parseInt(amount) * 100,
          currencyCode: "USD",
        },
        confirmHandler: confirmHandler,
      },
      returnURL: "uberclone://book-ride",
      appearance: {
        colors: {
          background: "#ffffff",
          componentBackground: "#ffffff",
          componentText: "#000000",
          componentBorder: "#e0e0e0",
          componentDivider: "#e0e0e0",
          placeholderText: "#888888",
          primaryText: "#000000",
          secondaryText: "#000000",
          icon: "#000000",
          error: "#ff0000",
        },
      },
    });
    if (error) {
      console.log("Error: ", error);
    }
  };

  const confirmHandler = async (
    paymentMethod: Result,
    shouldSavePaymentMethod: boolean,
    intentCreationCallback: (result: IntentCreationCallbackParams) => void,
  ) => {
    const { paymentIntent, customerId } = await fetchAPI(
      "/(api)/(stripe)/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName || email.split("@")[0],
          email: email,
          amount: amount,
          paymentMethodId: paymentMethod.id,
        }),
      },
    );

    if (paymentIntent.client_secret) {
      const { result } = await fetchAPI("/(api)/(stripe)/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          payment_intent_id: paymentIntent.id,
          customer_id: customerId,
        }),
      });

      if (result.client_secret) {
        const createResult = await fetchAPI("/(api)/ride/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            origin_address: userAddress,
            destination_address: destinationAddress,
            origin_latitude: userLatitude,
            origin_longitude: userLongitude,
            destination_latitude: destinationLatitude,
            destination_longitude: destinationLongitude,
            ride_time: rideTime.toFixed(0),
            fare_price: parseInt(amount) * 100,
            payment_status: "paid",
            driver_id: driverId,
            user_id: userId,
          }),
        });

        if (!createResult || createResult.error) {
          console.error("Error creating ride: ", createResult.error);
          Alert.alert("Error", "Failed to create ride. Please try again.");
          return;
        }

        console.log(
          "Ride created successfully with secret: ",
          result.client_secret,
        );

        intentCreationCallback({
          clientSecret: result.client_secret,
        });
      }
    }
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <>
      <CustomButton
        title="Confirm Ride"
        className="my-10"
        onPress={openPaymentSheet}
      />

      <ReactNativeModal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
      >
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image source={images.check} className="w-28 h-28 mt-5" />
          <Text className="text-2xl text-center font-JakartaBold mt-5">
            Ride booked!
          </Text>
          <Text className="text-md text-general-200 font-JakartaMedium text-center mt-3">
            Thank you for your booking. Your reservation has beend placed.
            Please process with your trip!
          </Text>

          <CustomButton
            title="Back Home"
            onPress={() => {
              setSuccess(false);
              router.push(ROUTES.HOME);
            }}
            className="mt-5"
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default Payment;
