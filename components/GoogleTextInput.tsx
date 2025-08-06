import { View, Image } from "react-native";
import GooglePlacesTextInput from "react-native-google-places-textinput";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const customGooglePlacesAutocompleteStyles = {
    container: {
      flex: 1,
      marginHorizontal: 0,
    },
    input: {
      height: 45,
      borderColor: textInputBackgroundColor || "white",
      borderRadius: 8,
      backgroundColor: textInputBackgroundColor || "white",
    },
    suggestionsContainer: {
      backgroundColor: textInputBackgroundColor || "white",
      maxHeight: 250,
    },
    suggestionItem: {
      padding: 15,
    },
    suggestionText: {
      main: {
        fontSize: 16,
        color: "#333",
      },
      secondary: {
        fontSize: 14,
        color: "#666",
      },
    },
    loadingIndicator: {
      color: "#999",
    },
    placeholder: {
      color: "#999",
    },
  };

  return (
    <View
      className={`flex flex-row items-center justify-center  relative z-50 rounded-xl ${containerStyle} mb-5`}
    >
      {icon && (
        <Image source={icon} className="ml-3 w-6 h-6" resizeMode="contain" />
      )}
      <GooglePlacesTextInput
        apiKey={googlePlacesApiKey!}
        fetchDetails={true}
        debounceDelay={200}
        minCharsToFetch={2}
        placeHolderText={initialLocation ?? "Where do you want to go?"}
        showClearButton={true}
        style={customGooglePlacesAutocompleteStyles}
        onPlaceSelect={(place) => {
          handlePress({
            latitude: place.details?.location.latitude,
            longitude: place.details?.location.longitude,
            address: place.details?.formattedAddress || "",
          });
        }}
      />
    </View>
  );
};

export default GoogleTextInput;
