import React, { useEffect, useState } from "react";
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
import {
  setMenu,
  openNotification,
  setClock,
} from "../store/slice-reducers/Formslice";
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
  const { menu, clock } = useSelector((state) => state.app);

  useEffect(() => {
    let interval = null;

    function onClock() {
      interval = setInterval(() => {
        const times = `${new Date().getHours().toLocaleString()}:${new Date()
          .getMinutes()
          .toLocaleString()}`;
        dispatch(setClock(times));
      }, 60000);
    }

    onClock();
    // Update the clock immediately on mount
    const times = `${new Date().getHours().toLocaleString()}:${new Date()
      .getMinutes()
      .toLocaleString()}`;
    dispatch(setClock(times));
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <LinearGradient
      style={styls.topSection}
      colors={["#1F271B", "#0C4D4D"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View
        id='headerNav'
        className='px-[5vw]   justify-between flex-row items-center h-[20%]  border- border-white mt-[5vh]  relative flex'
      >
        <View>
          <Text style={styles.headingText} className='text-white  text-left '>
            {text}
          </Text>

          <Text
            style={styles.text_sm}
            className='text-primary_light mt-1 text-left'
          >
            {text3}
          </Text>
        </View>
        <Text
          style={[styles.text_md, { fontSize: actuatedNormalize(18) }]}
          className='text-Gold absolute right-[5vw] mt-1 text-left'
        >
          {clock}
        </Text>
      </View>
      <View className='flex-1 justify-center items-center'>{children}</View>
    </LinearGradient>
  );
};

const styls = StyleSheet.create({
  topSection: { height: "50%", borderBottomLeftRadius: 35, zIndex: 20 },
  // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
  // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
});

export default HandlerTopscreen;
