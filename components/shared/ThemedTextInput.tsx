import { TextInput, TextInputProps } from "react-native";

import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
  backgroundLightColor?: string;
  backgroundDarkColor?: string;
  textLightColor?: string;
  textDarkColor?: string;
  color?: keyof typeof Colors.light & keyof typeof Colors.dark;
};

export function ThemedTextInput({
  style,
  backgroundLightColor,
  backgroundDarkColor,
  textLightColor,
  textDarkColor,
  color,
  ...otherProps
}: ThemedTextInputProps) {
  const backgroundColor = useThemeColor(
    { light: backgroundLightColor, dark: backgroundDarkColor },
    color ? color : "secondaryBackground"
  );
  const textColor = useThemeColor(
    { light: textLightColor, dark: textDarkColor },
    color ? color : "text"
  );

  return (
    <TextInput
      placeholderTextColor={textColor}
      style={[{ backgroundColor, color: textColor }, style]}
      {...otherProps}
    />
  );
}
