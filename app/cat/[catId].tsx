import {
  CustomImagePager,
  CustomImagePagerButtonProps,
} from "@/components/CustomImagePager";
import { ThemedText } from "@/components/shared/ThemedText";
import { ThemedTextInput } from "@/components/shared/ThemedTextInput";
import { ThemedView } from "@/components/shared/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { catAccumulator, catTable } from "@/models/Cat";
import { imageTable } from "@/models/Image";
import { useActionSheet } from "@expo/react-native-action-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { eq } from "drizzle-orm";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { db } from "../_layout";

export default function EditCat() {
  const { catId } = useLocalSearchParams();
  const [catName, setCatName] = useState<string>();
  const [catDescription, setCatDescription] = useState<string | null>();
  const [catRace, setCatRace] = useState<string>();
  const [catSex, setCatSex] = useState<string>();
  const [catBirthdate, setCatBirthdate] = useState<Date>();
  const [catImages, setCatImages] = useState<
    (typeof imageTable.$inferSelect)[]
  >([]);

  const [showDatepicker, setShowDatepicker] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const { showActionSheetWithOptions } = useActionSheet();

  const mainColor = useThemeColor({}, "mainColor");
  const secondaryBackground = useThemeColor({}, "secondaryBackground");

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
      const catInfoParsed = catAccumulator(catInfo)[0];

      if (catInfoParsed) {
        setCatImages(catInfoParsed.images);
        setCatName(catInfoParsed.name);
        setCatDescription(catInfoParsed.description);
        setCatBirthdate(new Date(catInfoParsed.birthdate));
        setCatRace(catInfoParsed.race);
        setCatSex(catInfoParsed.sex);
      }
    })();
  }, [catId]);

  function datePicked(event: any, selectedDate: Date | undefined) {
    if (selectedDate && event.type === "set") {
      setCatBirthdate(selectedDate);
    }
    setShowDatepicker(false);
  }

  async function addImage() {
    showActionSheetWithOptions(
      {
        options: ["Tirar foto", "Escolher foto salva", "Cancelar"],
        destructiveButtonIndex: 2,
      },
      async (i) => {
        let image: ImagePicker.ImagePickerResult;

        switch (i) {
          case 0:
            if (!status?.granted) {
              let perm = await requestPermission();
              if (!perm.granted) return;
            }

            image = await ImagePicker.launchCameraAsync({
              base64: true,
              allowsEditing: true,
              quality: 0.7,
            });
            break;

          case 1:
            image = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images", "livePhotos"],
              base64: true,
              allowsEditing: true,
              quality: 0.7,
            });
            break;

          default:
            return;
        }

        if (image.assets && image.assets.length > 0 && image.assets[0].base64) {
          const newImage = await db
            .insert(imageTable)
            .values({
              catId: parseInt(catId.toString()),
              base64: image.assets[0].base64,
            })
            .returning();
          setCatImages([...newImage, ...catImages]);
        }
      }
    );
  }

  async function deletePagedImage(activePageIndex: number) {
    const imageId = catImages[activePageIndex].id;

    await db
      .delete(imageTable)
      .where(eq(imageTable.id, imageId));

    const tempArray = catImages.filter((value, index) => {
      return index !== activePageIndex;
    });
    setCatImages(tempArray);
  }

  async function editCat() {
    if (
      catName === undefined ||
      catName.length === 0 ||
      catRace === undefined ||
      catRace.length === 0 ||
      catSex === undefined ||
      catSex.length === 0 ||
      catBirthdate === undefined
    ) {
      setErrMsg("Preencha todos os campos obrigatórios (*)");
      return;
    }

    await db
      .update(catTable)
      .set({
        name: catName,
        description: catDescription,
        birthdate: catBirthdate?.toISOString(),
        race: catRace,
        sex: catSex,
      })
      .where(eq(catTable.id, parseInt(catId.toString())));

    router.navigate("..");
  }

  const viewPagerButtons: CustomImagePagerButtonProps[] = [
    {
      buttonIcon: (
        <MaterialIcons name="add-photo-alternate" size={20} color={mainColor} />
      ),
      onPress: addImage,
    },
    {
      buttonIcon: <AntDesign name="close" size={20} color="red" />,
      onPress: deletePagedImage,
    },
  ];

  return (
    <ThemedView isMainView={true} style={styles.mainView}>
      <View>
        <ThemedText
          type="title"
          style={[styles.title, { backgroundColor: mainColor }]}
        >
          Editar um gato
        </ThemedText>
        {catImages.length !== 0 ? (
          <CustomImagePager
            style={styles.pager}
            buttons={viewPagerButtons}
            imagesBase64={catImages.map((image) => image.base64)}
          />
        ) : (
          <></>
        )}
        <View style={styles.content}>
          {catImages.length === 0 ? (
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={() => {
                  addImage();
                }}
                style={[styles.addImageButton, { borderColor: mainColor }]}
              >
                <MaterialIcons
                  name="add-photo-alternate"
                  size={32}
                  color={mainColor}
                />
                <ThemedText type="subtitle" style={{ color: mainColor }}>
                  Adicionar foto
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
          <ThemedTextInput
            style={styles.input}
            placeholder="Insira o nome do gato *"
            defaultValue={catName}
            onChangeText={(value) => {
              setCatName(value);
            }}
          />
          <ThemedTextInput
            style={styles.input}
            placeholder="Insira uma descrição sobre o gato"
            defaultValue={catDescription ? catDescription : ""}
            multiline={true}
            numberOfLines={4}
            onChangeText={(value) => {
              setCatDescription(value);
            }}
          />
          <TouchableOpacity
            style={[styles.input, { backgroundColor: secondaryBackground }]}
            onPress={() => {
              setShowDatepicker(true);
            }}
          >
            <ThemedText style={styles.inputText}>
              {catBirthdate
                ? catBirthdate.toLocaleDateString()
                : "Insira a data de nascimento do gato *"}
            </ThemedText>
          </TouchableOpacity>
          {showDatepicker ? (
            <DateTimePicker
              value={catBirthdate ? catBirthdate : new Date()}
              onChange={datePicked}
              maximumDate={new Date()}
            />
          ) : (
            <></>
          )}
          <ThemedTextInput
            style={styles.input}
            placeholder="Insira a raça do gato *"
            defaultValue={catRace}
            onChangeText={(value) => {
              setCatRace(value);
            }}
          />
          <ThemedTextInput
            style={styles.input}
            placeholder="Insira o sexo do gato *"
            defaultValue={catSex}
            onChangeText={(value) => {
              setCatSex(value);
            }}
          />
        </View>
      </View>
      <View>
        {errMsg ? (
          <ThemedText darkColor="red" lightColor="red" style={styles.errText}>
            {errMsg}
          </ThemedText>
        ) : (
          <></>
        )}
        <TouchableOpacity
          onPress={editCat}
          style={[styles.editCat, { borderTopColor: mainColor }]}
        >
          <ThemedText style={[styles.editCatText, { color: mainColor }]}>
            Finalizar edição
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    justifyContent: "space-between",
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    padding: 20,
  },
  pager: {
    height: "30%",
  },
  viewButton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  addImageButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 1,
    gap: 10,
    borderWidth: 2,
    padding: 20,
    borderRadius: 100,
    marginBottom: 20,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    fontSize: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  inputText: {
    fontSize: 20,
  },
  errText: {
    textAlign: "center",
  },
  editCat: {
    width: "100%",
    borderWidth: 2,
    padding: 20,
  },
  editCatText: {
    textAlign: "center",
    fontSize: 20,
  },
});
