import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { setClock } from "../store/slice-reducers/Formslice";
import { AccountRealmContext } from "../models";
import { styles } from "../styles/stylesheet";

const HandlerTopscreen = ({ text, text3, children }) => {
  const dispatch = useDispatch();
  // const account = useObject("account", Realm.BSON.ObjectId(id));
  const { clock } = useSelector((state) => state.app);

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
