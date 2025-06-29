import { ScrollView, View, type ViewProps } from "react-native";

import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";

export type ThemedViewProps = ViewProps & {
  isMainView?: boolean;
  isScrollView?: boolean;
  lightColor?: string;
  darkColor?: string;
  color?: keyof typeof Colors.light & keyof typeof Colors.dark;
};

export function ThemedView({
  style,
  isMainView = false,
  isScrollView = false,
  lightColor,
  darkColor,
  color,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    color ? color : "background"
  );

  let initialView;

  if (isScrollView) {
    initialView = (
      <ScrollView contentContainerStyle={style} style={{ backgroundColor }} {...otherProps}/>
    );
  } else {
    initialView = (
      <View style={[{ backgroundColor }, style]} {...otherProps} />
    );
  }

  if (isMainView) {
    return (
      <SafeAreaView style={{ backgroundColor, flex: 1 }}>
        {initialView}
      </SafeAreaView>
    );
  } else {
    return initialView;
  }
}
