
import { Stack } from "expo-router";

export default function CatLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[catId]" />
    </Stack>
  );
}
