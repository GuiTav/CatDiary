import { useThemeColor } from "@/hooks/useThemeColor";
import { catAccumulatorResult } from "@/models/Cat";
import { defaultImageBase64 } from "@/models/Image";
import { useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View, type ViewProps } from "react-native";
import { ThemedText } from "./shared/ThemedText";
import { ThemedView } from "./shared/ThemedView";

export type CatListItemProps = ViewProps & {
  catData: catAccumulatorResult;
};

export function CatListItem({
  catData,
}: CatListItemProps) {
  const mainColor = useThemeColor({}, "mainColor");
  const textColor = useThemeColor({}, "lightBackground");

  const ageInMilis = new Date().getTime() - new Date(catData.birthdate).getTime();
  const ageInYears = ageInMilis / (1000 * 60 * 60 * 24 * 365);
  const ageInMonths = (ageInYears - Math.floor(ageInYears)) * 12;

  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/${catData.id}`)}
      style={styles.outerButton}
    >
      <ThemedView
        color="secondaryBackground"
        style={[ styles.mainView, {borderColor: mainColor} ]}
      >
        <View style={styles.horizontalView}>
          <Image
            source={{
              uri: `data:image/png;base64,${catData.images.length > 0 ? catData.images[0].base64 : defaultImageBase64}`
            }}
            style={{
              backgroundColor: textColor,
              ...styles.image
            }}
          />
          <View style={styles.textView}>
            <ThemedText style={[styles.title, {color: mainColor}]} type="subtitle">
              {catData.name}
            </ThemedText>
            <ThemedText>
              <ThemedText style={{color: mainColor}} type="defaultSemiBold">Idade:</ThemedText>{" "}
              {Math.floor(ageInYears)} anos e {Math.floor(ageInMonths)} meses
            </ThemedText>
            <ThemedText>
              <ThemedText style={{color: mainColor}} type="defaultSemiBold">Raça:</ThemedText> {catData.race}
            </ThemedText>
            <ThemedText>
              <ThemedText style={{color: mainColor}} type="defaultSemiBold">Sexo:</ThemedText> {catData.sex}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerButton: {
    width: "85%",
    marginVertical: 10,
  },
  mainView: {
    width: "100%",
    padding: 15,
    borderWidth: 2,
    borderRadius: 10
  },
  horizontalView: {
    alignItems: 'stretch',
    flexDirection: "row",
    gap: 10,
  },
  textView: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    marginBottom: 5,
  },
  image: {
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: 100
  }
});
