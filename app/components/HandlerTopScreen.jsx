import React from "react";
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const { useRealm, useQuery, useObject } = AccountRealmContext;

const HandlerTopscreen = ({ text, text2, text3, children, Edit }) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const realm = useRealm();
  const { id } = useSelector((state) => state.user);
  const account = useObject("account", Realm.BSON.ObjectId(id));
  const { menu, notify } = useSelector((state) => state.app);
  console.log(account);

  const toggleMenu = () => {
    dispatch(setMenu());
  };

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
        className='px-[5vw]  justify-between flex-row items-center h-[20%]  border- border-white mt-[7vh]  relative flex'
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
            {`Hello, ${account?.name}`}
          </Text>

          <Text
            style={styles.text_sm}
            className='text-primary_light mt-1 `  text-left'
          >
            {text3}
          </Text>
        </View>
        {route.name == "tasks" ? (
          <TouchableOpacity onPress={Edit}>
            <AntDesign name='select1' size={24} color='white' />
          </TouchableOpacity>
        ) : (
          <View className='relative border-  border-white'>
            <TouchableOpacity onPress={toggleNotification}>
              <Svg
                className='absolute top-[-5] right-[-3]'
                height='50%'
                width='50%'
                viewBox='0 0 100 100'
              >
                <Circle
                  cx='50'
                  cy='50'
                  r='30'
                  stroke='blue'
                  strokeWidth='0'
                  fill='#77e6b6'
                />
              </Svg>

              <Notify width={actuatedNormalize(25)} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {notify ? (
        <Motion.View
          initial={{ x: 500 }}
          animate={{ x: 0 }}
          id='NOTIFICATION_MENU'
          style={([], { borderRadius: actuatedNormalize(10) })}
          className='h-[90vh] absolute flex py-[2vh] px-[2vw] top-[4vh] right-0 w-[65%] bg-[#69DC9E]'
        >
          <View className='self-end mb-[2vh]'>
            <TouchableOpacity onPress={toggleNotification}>
              <Ionicons
                name='ios-close'
                color={"darkgreen"}
                size={actuatedNormalize(25)}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={[styles.text_sm]}>You have just recieved a Task!</Text>
          </TouchableOpacity>
        </Motion.View>
      ) : null}
      {children}
    </LinearGradient>
  );
};

const styls = StyleSheet.create({
  topSection: { height: "50%", borderBottomLeftRadius: 35 },
  // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
  // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
});

export default HandlerTopscreen;
