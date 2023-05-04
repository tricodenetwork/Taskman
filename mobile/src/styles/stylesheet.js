import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
     Pcard:{
        shadowColor: "#000",
        shadowOffset: {height: 50, width: 20},
        shadowOpacity: 1,
        shadowRadius:3.84,
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
  text: {
    // letterSpacing: 1.25,
    fontFamily: "AxiformaBold",
  },
  text_md: {
    fontFamily: "AxiformaMedium",
  },
  text_md2: {
    fontFamily: "AxiformaSemiBold",
    fontWeight:'600'
  },
  text_sm: {
    fontFamily: "AxiformaRegular",
    // fontWeight:'400'
  },
});
