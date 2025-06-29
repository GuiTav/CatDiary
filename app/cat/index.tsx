import {
  CustomImagePager,
  CustomImagePagerButtonProps,
} from "@/components/CustomImagePager";
import { ThemedText } from "@/components/shared/ThemedText";
import { ThemedTextInput } from "@/components/shared/ThemedTextInput";
import { ThemedView } from "@/components/shared/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { catTable } from "@/models/Cat";
import { imageTable } from "@/models/Image";
import { useActionSheet } from "@expo/react-native-action-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { db } from "../_layout";

export default function CreateCat() {
  const [catName, setCatName] = useState<string>();
  const [catDescription, setCatDescription] = useState<string>();
  const [catRace, setCatRace] = useState<string>();
  const [catSex, setCatSex] = useState<string>();
  const [catBirthdate, setCatBirthdate] = useState<Date>();
  const [catImagesBase64, setCatImagesBase64] = useState<string[]>([]);

  const [showDatepicker, setShowDatepicker] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const { showActionSheetWithOptions } = useActionSheet();

  const mainColor = useThemeColor({}, "mainColor");
  const secondaryBackground = useThemeColor({}, "secondaryBackground");

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
          setCatImagesBase64([image.assets[0].base64, ...catImagesBase64]);
        }
      }
    );
  }

  function deletePagedImage(activePageIndex: number) {
    const tempArray = catImagesBase64.filter((value, index) => {
      return index !== activePageIndex;
    });
    setCatImagesBase64(tempArray);
  }

  async function createCat() {
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

    const catInfo = await db.insert(catTable).values({
      name: catName,
      description: catDescription,
      birthdate: catBirthdate?.toISOString(),
      race: catRace,
      sex: catSex
    });

    await db.insert(imageTable).values(catImagesBase64.map(base64 => {
      return {
        catId: catInfo.lastInsertRowId,
        base64
      }
    }));

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
          Criar um novo gato
        </ThemedText>
        {catImagesBase64.length !== 0 ? (
          <CustomImagePager
            style={styles.pager}
            buttons={viewPagerButtons}
            imagesBase64={catImagesBase64}
          />
        ) : (
          <></>
        )}
        <View style={styles.content}>
          {catImagesBase64.length === 0 ? (
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
            onChangeText={(value) => {
              setCatName(value);
            }}
          />
          <ThemedTextInput
            style={styles.input}
            placeholder="Insira uma descrição sobre o gato"
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
              value={new Date()}
              onChange={datePicked}
              maximumDate={new Date()}
            />
          ) : (
            <></>
          )}
          <ThemedTextInput
            style={styles.input}
            placeholder="Insira a raça do gato *"
            onChangeText={(value) => {
              setCatRace(value);
            }}
          />
          <ThemedTextInput
            style={styles.input}
            placeholder="Insira o sexo do gato *"
            onChangeText={(value) => {
              setCatSex(value);
            }}
          />
        </View>
      </View>
      <View>
        {errMsg ? <ThemedText darkColor="red" lightColor="red" style={styles.errText}>{errMsg}</ThemedText> : <></>}
        <TouchableOpacity
          onPress={createCat}
          style={[styles.createCat, { borderTopColor: mainColor }]}
        >
          <ThemedText style={[styles.createCatText, { color: mainColor }]}>
            Criar Gato
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
    textAlign: 'center'
  },
  createCat: {
    width: "100%",
    borderWidth: 2,
    padding: 20,
  },
  createCatText: {
    textAlign: "center",
    fontSize: 20,
  },
});
