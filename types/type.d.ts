import {
  TouchableOpacityProps,
  TextInputProps,
  ImageSourcePropType,
} from "react-native";

declare global {
  interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: CustomButtonBackgroundVariant;
    textVariant?: CustomButtonTextVariant;
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
  }

  interface InputFieldProps extends TextInputProps {
    label: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
  }

  interface Ride {
    origin_address: string;
    destination_address: string;
    origin_latitude: number;
    origin_longitude: number;
    destination_latitude: number;
    destination_longitude: number;
    ride_time: number;
    fare_price: string;
    payment_status: string;
    driver_id: number;
    user_email: string;
    created_at: string;
    driver: {
      first_name: string;
      last_name: string;
      car_seats: number;
    };
  }

  interface GoogleInputProps {
    icon?: ImageSourcePropType;
    initialLocation?: string;
    containerStyle?: string;
    textInputBackgroundColor?: string;
    handlePress: ({
      latitude,
      longitude,
      address,
    }: {
      latitude: number;
      longitude: number;
      address: string;
    }) => void;
  }

  interface LocationStore {
    userLatitude: number | null;
    userLongitude: number | null;
    userAddress: string | null;
    destinationLatitude: number | null;
    destinationLongitude: number | null;
    destinationAddress: string | null;
    setUserLocation: ({
      latitude,
      longitude,
      address,
    }: {
      latitude: number;
      longitude: number;
      address: string;
    }) => void;
    setDestinationLocation: ({
      latitude,
      longitude,
      address,
    }: {
      latitude: number;
      longitude: number;
      address: string;
    }) => void;
  }

  interface Driver {
    driver_id: number;
    first_name: string;
    last_name: string;
    profile_image_url: string;
    car_image_url: string;
    car_seats: number;
    rating: number;
  }

  interface MarkerData {
    latitude: number;
    longitude: number;
    driver_id: number;
    title: string;
    profile_image_url: string;
    car_image_url: string;
    car_seats: number;
    rating: number;
    first_name: string;
    last_name: string;
    time?: number;
    price?: string;
  }

  interface DriverStore {
    drivers: MarkerData[];
    selectedDriver: number | null;
    setSelectedDriver: (driverId: number) => void;
    setDrivers: (drivers: MarkerData[]) => void;
    clearSelectedDriver: () => void;
  }

  interface DriverCardProps {
    item: MarkerData;
    selected: number;
    setSelected: () => void;
  }

  interface PaymentProps {
    fullName: string;
    email: string;
    amount: string;
    driverId: number;
    rideTime: number;
  }
}

export {};
