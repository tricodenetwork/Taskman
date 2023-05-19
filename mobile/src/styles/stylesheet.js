import { Dimensions, Platform, PixelRatio, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const scale = SCREEN_WIDTH / 375;

const scaleVertical = SCREEN_HEIGHT / 812;

export function actuatedNormalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
  }
}

export function actuatedNormalizeVertical(size) {
  const newSize = size * scaleVertical;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
  }
}

export function isTab() {
  if (SCREEN_WIDTH > 550) {
    return true;
  } else {
    return false;
  }
}

export function isScreenHeight770() {
  if (SCREEN_HEIGHT > 740 && SCREEN_HEIGHT < 760) {
    return true;
  } else {
    return false;
  }
}

export const styles = StyleSheet.create({
  Pcard: {
    shadowColor: "#000",
    shadowOffset: { height: 50, width: 20 },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "105%",
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#ff6600",
    opacity: 0.1,
    borderRadius: 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headingText: {
    fontFamily: "AxiformaBold",
    fontSize: actuatedNormalize(18),
    lineHeight: actuatedNormalizeVertical(28),
  },
  text: {
    // letterSpacing: 1.25,
    fontFamily: "AxiformaBold",
  },
  text_md: {
    fontFamily: "AxiformaMedium",
    fontSize: actuatedNormalize(14),
  },
  text_mdhandler: {
    fontFamily: "AxiformaMedium",
  },
  text_md2: {
    fontFamily: "AxiformaSemiBold",
    fontWeight: "600",
  },
  text_sm: {
    fontFamily: "AxiformaRegular",
    fontSize: actuatedNormalize(14),
    lineHeight: actuatedNormalize(20),
    // fontWeight:'400'
  },
  input2: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "flex-start",
    // borderWidth: 0.8,
    // borderRadius: 8,
    // height: 45,
  },
  box: {
    position: "absolute",
    right: 0,
    bottom: 40,
    padding: 5,
  },
  box2: {
    width: "87%",
    position: "absolute",
    // right: 0,
  },
  averageText: {
    fontSize: 15,
    paddingLeft: 5,
  },
});
