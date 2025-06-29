import { CustomImagePager, CustomImagePagerButtonProps } from "@/components/CustomImagePager";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { ThemedText } from "@/components/shared/ThemedText";
import { ThemedView } from "@/components/shared/ThemedView";
import { catAccumulator, catAccumulatorResult, catTable } from "@/models/Cat";
import { imageTable } from "@/models/Image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { db } from "./_layout";

export default function CatDetails() {
  const { catId } = useLocalSearchParams();
  const [cat, setCat] = useState<catAccumulatorResult>();
  const [imagesBase64, setImagesBase64] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ageInMilis, setAgeInMilis] = useState<number>(-1);
  const [ageInYears, setAgeInYears] = useState<number>(-1);
  const [ageInMonths, setAgeInMonths] = useState<number>(-1);
  const router = useRouter();

  const deleteModal = (
    <ConfirmationModal
      title="Tem certeza que deseja excluir este gato?"
      message="Esta ação não poderá ser desfeita"
      show={showModal}
      handleConfirm={onConfirm}
    />
  );

  useEffect(() => {
    (async () => {
      const catIdInt = parseInt(catId.toString());

      const catInfo = await db
        .select()
        .from(catTable)
        .where(eq(catTable.id, catIdInt))
        .leftJoin(imageTable, eq(catTable.id, imageTable.catId))
        .all();
      if (catInfo.length === 0) {
        throw "Gato não encontrado;";
      }
      setCat(catAccumulator(catInfo)[0]);

      if (cat) {
        const mappedImages = cat.images.map((image) => image.base64);
        setImagesBase64(mappedImages);
        setAgeInMilis(
          new Date().getTime() - new Date(cat?.birthdate).getTime()
        );
        setAgeInYears(ageInMilis / (1000 * 60 * 60 * 24 * 365));
        setAgeInMonths((ageInYears - Math.floor(ageInYears)) * 12);
      }
    })();
  }, [catId, cat, ageInMilis, ageInYears]);

  function deleteCat() {
    setShowModal(true);
  }

  async function onConfirm(confirm: boolean) {
    if (confirm) {
      await db
        .delete(catTable)
        .where(eq(catTable.id, parseInt(catId.toString())));
      router.back();
    } else {
      setShowModal(false);
    }
  }

  const viewPagerButtons: CustomImagePagerButtonProps[] = [{
    buttonIcon: (<Ionicons name="pencil" size={20} color="white" />),
    onPress: () => router.navigate(`./cat/${catId}`)
  },{
    buttonIcon: (<AntDesign name="close" size={20} color="red" />),
    onPress: deleteCat
  }
];

  return (
    <>
      <ThemedView isMainView={true} style={styles.mainView}>
        <CustomImagePager style={styles.pager} buttons={viewPagerButtons} imagesBase64={imagesBase64} />
        <View style={styles.mainContent}>
          <ThemedText type="title" style={styles.title}>
            {cat?.name}
          </ThemedText>
          {cat?.description ? (
            <ThemedText style={styles.description}>
              {cat?.description}
            </ThemedText>
          ) : (
            <></>
          )}
          <ThemedText type="subtitle" style={styles.infos}>
            Idade: {Math.floor(ageInYears)} anos e {Math.floor(ageInMonths)}{" "}
            meses
          </ThemedText>
          <ThemedText type="subtitle" style={styles.infos}>
            Raça: {cat?.race}
          </ThemedText>
          <ThemedText type="subtitle" style={styles.infos}>
            Sexo: {cat?.sex}
          </ThemedText>
        </View>
      </ThemedView>
      {deleteModal}
    </>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  pager: {
    height: "30%",
  },
  image: {
    resizeMode: "contain",
  },
  topButtonView: {
    position: "absolute",
    top: 10,
    right: 15,
    flexDirection: "row",
    gap: 10,
    zIndex: 10,
  },
  topButton: {
    borderRadius: 50,
    padding: 10,
    backgroundColor: "#151718",
  },
  mainContent: {
    padding: 25,
  },
  title: {
    marginBottom: 20,
  },
  description: {
    marginBottom: 10,
  },
  infos: {
    marginTop: 10,
  },
});
