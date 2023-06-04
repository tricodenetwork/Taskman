import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  PixelRatio,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Notify from "../../assets/images/notify.svg";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import Svg, { Circle, Rect } from "react-native-svg";
import ProfileCard from "./ProfileCard";
import { Motion } from "@legendapp/motion";
import { useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setMenu, openNotification } from "../store/slice-reducers/Formslice";
import { AccountRealmContext } from "../models";
import { setName, setUser } from "../store/slice-reducers/userSlice";
import { activejob } from "../models/Task";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const { useRealm, useQuery, useObject } = AccountRealmContext;

const HandlerTopscreen = ({ text, text2, text3, children, Edit }) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const realm = useRealm();
  const { user } = useSelector((state) => state);
  // const account = useObject("account", Realm.BSON.ObjectId(id));
  const { menu, notify } = useSelector((state) => state.app);

  const toggleNotification = () => {
    dispatch(openNotification());
  };

  return (
    <LinearGradient
      style={styls.topSection}
      colors={["#004343", "#0C4D4D"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View
        // id='headerNav'
        className='px-[5vw]  justify-between flex-row items-center h-[20%]  border- border-white mt-[5vh]  relative flex'
      >
        {/* <TouchableOpacity
          className={`z-[500]  ${menu && "relative "}`}
          onPress={route.name == "taskman" ? toggleMenu : onPress}
        >
          {route.name == "taskman" ? (
            <Motion.View className='bg-primary_light rounded-full w-[10vw] h-[10vw] flex items-center justify-center'>
              <Ionicons
                // name='md-arrow-back-outline'
                name={!menu ? "ios-menu" : "ios-close"}
                size={25}
                style={styles.backArrow}
                color={!menu ? "white" : "darkgreen"}
              />
            </Motion.View>
          ) : (
            <Ionicons
              name='md-arrow-back-outline'
              size={25}
              style={styles.backArrow}
              color={!menu ? "white" : "darkgreen"}
            />
          )}
        </TouchableOpacity> */}
        <View>
          <Text style={styles.headingText} className='text-white  text-left '>
            {text}
          </Text>

          <Text
            style={styles.text_sm}
            className='text-primary_light mt-1 `  text-left'
          >
            {text3}
          </Text>
        </View>
      </View>

      {children}
    </LinearGradient>
  );
};

const styls = StyleSheet.create({
  topSection: { height: "50%", borderBottomLeftRadius: 35, zIndex: 20 },
  // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
  // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
});

export default HandlerTopscreen;
