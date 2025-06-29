import { db } from "@/app/_layout";
import { CatListItem } from "@/components/CatListItem";
import { ThemedView } from "@/components/shared/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { catAccumulator, catAccumulatorResult, catTable } from "@/models/Cat";
import { imageTable } from "@/models/Image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { eq } from "drizzle-orm";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function MainScreen() {
  const [cats, setCats] = useState<catAccumulatorResult[] | null>(null);

  const catItemList = cats?.map((value) => (
    <CatListItem key={value.id} catData={value} />
  ));

  const buttonColor = useThemeColor({}, "mainColor");
  const backgroundColor = useThemeColor({}, "background");

  const router = useRouter();

  useEffect(() => {
    (async () => {
      // await createDefaultData().catch((e) => console.log(e));
      const catsOnDatabase = await db
        .select()
        .from(catTable)
        .leftJoin(imageTable, eq(catTable.id, imageTable.catId));
      setCats(catAccumulator(catsOnDatabase));
    })();
  });

  return (
    <ThemedView style={styles.mainView} isMainView={true} isScrollView={true}>
      {catItemList}
      <TouchableOpacity
        onPress={() => router.navigate("./cat/")}
        style={[
          styles.addCatButton,
          { borderColor: buttonColor, backgroundColor: backgroundColor },
        ]}
      >
        <Ionicons name="add" size={20} color={buttonColor} />
        <Text style={[styles.buttonText, { color: buttonColor }]}>
          Adicionar um novo gato
        </Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  addCatButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
  },
});
