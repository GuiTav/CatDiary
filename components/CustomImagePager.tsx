import { defaultImageBase64 } from "@/models/Image";
import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View, ViewProps } from "react-native";
import PagerView from "react-native-pager-view";

export type CustomImagePagerProps = ViewProps & {
  imagesBase64: string[];
  buttons: CustomImagePagerButtonProps[];
};

export type CustomImagePagerButtonProps = {
  buttonIcon: React.JSX.Element;
  onPress: (activePageIndex: number) => void;
};

export function CustomImagePager({ style, imagesBase64, buttons }: CustomImagePagerProps) {
    const [activePageIndex, setActivePageIndex] = useState<number>(0);

    function renderButtons() {
    return buttons.map((value, index) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => value.onPress(activePageIndex)}
          style={styles.topButton}
        >
          {value.buttonIcon}
        </TouchableOpacity>
      );
    });
  }

  function createImageViews(base64Array: string[]) {
      return base64Array.map((base64, index) => {
        return (
          <Image
            key={index}
            style={styles.image}
            source={{ uri: `data:image/png;base64,${base64}` }}
          />
        );
      });
    }

  return (
    <View style={[styles.viewPager, style]}>
      <View style={styles.topButtonView}>{renderButtons()}</View>
      <PagerView style={styles.pager} initialPage={0} onPageSelected={(event) => setActivePageIndex(event.nativeEvent.position)}>
        {createImageViews(imagesBase64.length > 0 ? imagesBase64 : [defaultImageBase64])}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewPager: {
    width: "100%",
  },
  pager: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
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
  image: {
    resizeMode: "contain"
  }
});
