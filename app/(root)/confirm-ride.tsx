import { FlatList, View } from "react-native";
import RydeLayout from "@/components/RydeLayout";
import DriverCard from "@/components/DriverCard";
import CustomButton from "@/components/CustomButton/CustomButton";
import { router } from "expo-router";
import { useDriverStore } from "@/store";
import ROUTES from "@/constants/route";

const ConfirmRide = () => {
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  return (
    <RydeLayout title="Choose a Driver" snapPoints={["65%", "85%"]}>
      <FlatList
        data={drivers}
        renderItem={({ item }) => (
          <DriverCard
            item={item}
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(item.driver_id)}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <CustomButton
              title="Select Ride"
              onPress={() => router.push(ROUTES.BOOK_RIDE)}
            />
          </View>
        )}
      />
    </RydeLayout>
  );
};

export default ConfirmRide;
