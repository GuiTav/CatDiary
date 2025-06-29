import migrations from "@/drizzle/migrations";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import * as SQLite from "expo-sqlite";

const expo = SQLite.openDatabaseSync("db.db");

export const db = drizzle(expo);

export default function RootLayout() {
  useMigrations(db, migrations);

  return (
    <ActionSheetProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[catId]" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ActionSheetProvider>
  );
}
