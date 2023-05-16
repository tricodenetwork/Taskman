import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Notify from "../../assets/images/notify.svg";
import { styles } from "../styles/stylesheet";
import Svg, { Circle, Rect } from "react-native-svg";
import ProfileCard from "./ProfileCard";
import { Motion } from "@legendapp/motion";
import { useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setMenu } from "../store/slice-reducers/Formslice";
import Menu from "./Menu";

const Topscreen = ({
  text,
  text2,
  text3,
  children,
  onPress,
  navigation,
  Edit,
}) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { menu } = useSelector((state) => state.app);

  const toggleMenu = () => {
    dispatch(setMenu());
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
        className='px-5 z-20 justify-between flex-row items-center h-[20%] bg-opacity-100 border- border-white mt-[5vh]  relative flex  rounded-bl-[35px]'
      >
        <Menu navigation={navigation} />
        <TouchableOpacity
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
        </TouchableOpacity>
        <Text
          style={styles.text_md}
          className='text-white absolute w-[100vw] text-center top-[25%] text-xl'
        >
          {text}
        </Text>
        {route.name == "tasks" && (
          <Text
            style={styles.text_sm}
            className='text-white absolute w-[100vw] text-center top-[95%]'
          >
            Tasks:{text2}
          </Text>
        )}
        <Text
          style={styles.text_sm}
          className='text-white absolute w-[100vw] text-center top-[145%]'
        >
          {text3}
        </Text>
        {route.name == "tasks" ? (
          <TouchableOpacity onPress={Edit}>
            <AntDesign name='select1' size={24} color='white' />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className='relative border- border-white'>
            <Svg
              className='absolute  bottom-2 right-[-1vw]'
              height='50%'
              width='50%'
              viewBox='0 0 100 100'
            >
              <Circle
                cx='50'
                cy='50'
                r='40'
                stroke='blue'
                strokeWidth='0'
                fill='#77e6b6'
              />
            </Svg>

            <Notify width={20} height={22} />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </LinearGradient>
  );
};

const styls = StyleSheet.create({
  topSection: { height: "40%", borderBottomLeftRadius: 35 },
  // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
  // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
});

export default Topscreen;
