import { View, Text, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { Motion } from "@legendapp/motion";
import { useIsFocused } from "@react-navigation/native";
import { useUser } from "@realm/react";
import { AccountRealmContext } from "../models";
import { setUser } from "../store/slice-reducers/userSlice";
import { useDispatch } from "react-redux";

const { useObject, useQuery } = AccountRealmContext;

export default function Taskman({ navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const user = useUser();
  const oid = user.identities[0].id;
  const cleanedOid = oid.replace(/[^0-9a-zA-Z]/g, "");

  const account = useObject("account", Realm.BSON.ObjectId(cleanedOid));
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const initial = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const animate = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    dispatch(setUser(account));
  }, [isFocused]);
  useEffect(() => {
    initial();
    setTimeout(() => {
      animate();
    }, 1000);
  }, []);

  return (
    <Background bgColor='-z-40'>
      <Topscreen>
        <Animated.Text
          style={[
            styles.text_md2,
            {
              fontSize: actuatedNormalize(22),
              lineHeight: actuatedNormalizeVertical(45),
              color: "purple",
              borderRadius: actuatedNormalize(5),
              opacity: fadeAnim,
            },
          ]}
          className=' bg-[#FEFAE0] px-[5vw] my-auto border-[1px] bottom-[7vh] border-Supervisor2 py-[1vh] mx-auto'
        >
          Univeristy of Benin
        </Animated.Text>
        <Motion.Text
          initial={{ x: -400 }}
          animate={{ x: 0 }}
          transition={{ duration: 3 }}
          style={[styles.text_md2]}
          className=' text-Secondary px-[5vw] bottom-[10vh]  py-[1vh]  self-center'
        >
          Knowledge for Service
        </Motion.Text>
      </Topscreen>
      <View className='flex-1 px-[3vw] pt-[3vh] -z-40'>
        <Text className='text-primary' style={[styles.text_sm]}>
          With TaskMan, you can remotely...
        </Text>

        <View className='mt-[5vh] h-[30vh] flex justify-around'>
          <Text
            style={[
              styles.text_tiny,
              {
                fontSize: actuatedNormalize(14),
                lineHeight: actuatedNormalizeVertical(22),
              },
            ]}
          >
            * Set time target for tasks
          </Text>
          <Text
            style={[
              styles.text_tiny,
              {
                fontSize: actuatedNormalize(14),
                lineHeight: actuatedNormalizeVertical(22),
              },
            ]}
          >
            * Record tasks history
          </Text>
          <Text
            style={[
              styles.text_tiny,
              {
                fontSize: actuatedNormalize(14),
                lineHeight: actuatedNormalizeVertical(22),
              },
            ]}
          >
            * Supervise tasks among handlers
          </Text>
          <Text
            style={[
              styles.text_tiny,
              {
                fontSize: actuatedNormalize(14),
                lineHeight: actuatedNormalizeVertical(22),
              },
            ]}
          >
            * Evaluate handlers performance
          </Text>
          <Text
            style={[
              styles.text_tiny,
              {
                fontSize: actuatedNormalize(14),
                lineHeight: actuatedNormalizeVertical(22),
              },
            ]}
          >
            * Give feedback to clients
          </Text>
        </View>

        <Text
          style={[
            styles.text,
            {
              fontSize: actuatedNormalize(18),
              lineHeight: actuatedNormalizeVertical(30),
            },
          ]}
          className='absolute bottom-[3vh]  -z-40 rounded-3xl px-4 py-1  text-2xl text-primary self-center'
        >
          Taskman
        </Text>
      </View>
    </Background>
  );
}
