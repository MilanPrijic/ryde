import { Text, TouchableOpacity } from "react-native";
import {
  CustomButtonBackgroundVariant,
  CustomButtonTextVariant,
} from "@/components/CustomButton/types";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case CustomButtonBackgroundVariant.secondary:
      return "bg-gray-500";
    case CustomButtonBackgroundVariant.danger:
      return "bg-red-500";
    case CustomButtonBackgroundVariant.success:
      return "bg-green-500";
    case CustomButtonBackgroundVariant.outline:
      return "bg-transparent border-neutral-300 border-[0.5px]";
    default:
      return "bg-[#0286ff]";
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case CustomButtonTextVariant.primary:
      return "text-black";
    case CustomButtonTextVariant.secondary:
      return "text-gray-100";
    case CustomButtonTextVariant.danger:
      return "text-red-100";
    case CustomButtonTextVariant.success:
      return "text-green-100";
    default:
      return "text-white";
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = CustomButtonBackgroundVariant.primary,
  textVariant = CustomButtonTextVariant.default,
  IconLeft,
  IconRight,
  className,
  ...props
}: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`w-full rounded-full p-5 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(bgVariant)} ${className}`}
    {...props}
  >
    {IconLeft && <IconLeft />}
    <Text className={`txt-lg font-bold ${getTextVariantStyle(textVariant)}`}>
      {title}
    </Text>
    {IconRight && <IconRight />}
  </TouchableOpacity>
);

export default CustomButton;
