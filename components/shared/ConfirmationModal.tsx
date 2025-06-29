import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export type ConfirmationModalProps = {
  title: string;
  message: string;
  show: boolean;
  handleConfirm: (confirm: boolean) => void;
};

export function ConfirmationModal({
  title,
  message,
  show,
  handleConfirm
}: ConfirmationModalProps) {
  const textColor = useThemeColor({}, "text");
  const mainColor = useThemeColor({}, "mainColor");

  if (!show) return;

  return (
    <View style={styles.background}>
      <ThemedView color="secondaryBackground" style={styles.modalView}>
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText type="subtitle">{message}</ThemedText>
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => {
              handleConfirm(false);
            }}
            style={[styles.button, { borderColor: textColor }]}
          >
            <ThemedText type="subtitle">Cancelar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleConfirm(true)}
            style={[
              styles.button,
              { borderColor: textColor, backgroundColor: mainColor },
            ]}
          >
            <ThemedText type="subtitle">Confirmar</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    zIndex: 10,
    backgroundColor: "#000a",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "80%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 26
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 2,
  },
});
