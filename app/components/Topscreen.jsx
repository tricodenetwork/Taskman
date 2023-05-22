import React, { Fragment, useCallback, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Notify from "../../assets/images/notify.svg";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
import Svg, { Circle, Rect } from "react-native-svg";
import ProfileCard from "./ProfileCard";
import { Motion } from "@legendapp/motion";
import { useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setMenu,
  openNotification,
  setVisible,
} from "../store/slice-reducers/Formslice";
import Menu from "./Menu";
import { AccountRealmContext } from "../models";
import { Account } from "../models/Account";
import OdinaryButton from "./OdinaryButton";
import { useNavigation } from "@react-navigation/native";

const { useRealm, useQuery } = AccountRealmContext;

const Topscreen = ({ text, text2, text3, children, del, Edit }) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { menu, notify } = useSelector((state) => state.app);
  const [visible, setVisible] = useState(false);
  const realm = useRealm();
  const accounts = useQuery(Account);
  const nav = useNavigation();
  const back = () => {
    nav.goBack();
  };

  const toggleMenu = () => {
    dispatch(setMenu());
  };

  const toggleNotifications = () => {
    dispatch(openNotification());
  };

  //

  const deleteAccount = useCallback(() => {
    realm.write(() => {
      // realm.delete(route.params.item);

      // Alternatively if passing the ID as the argument to handleDeleteTask:
      realm?.delete(realm?.objectForPrimaryKey("account", route.params.id));
    });
  }, [realm]);

  return (
    <LinearGradient
      style={styls.topSection}
      colors={["#004343", "#0C4D4D"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View
        id='HEADER_NAV'
        className='px-[4vw]  justify-between flex-row items-center max-h-max bg-opacity-100 border- border-white mt-[6vh]  relative flex  rounded-bl-[35px]'
      >
        <Menu />
        <View id='LEFT_OPTION'>
          <TouchableOpacity
            className={`${menu && "relative "}`}
            onPress={route.name == "taskman" ? toggleMenu : back}
          >
            {route.name == "taskman" ? (
              <Motion.View className='bg-primary_light rounded-full w-[10vw] h-[10vw] flex items-center justify-center'>
                <Ionicons
                  // name='md-arrow-back-outline'
                  name={!menu ? "ios-menu" : "ios-close"}
                  size={actuatedNormalize(25)}
                  style={styles.backArrow}
                  color={!menu ? "black" : "darkgreen"}
                />
              </Motion.View>
            ) : (
              <Ionicons
                name='md-arrow-back-outline'
                size={actuatedNormalize(25)}
                style={styles.backArrow}
                color={!menu ? "white" : "darkgreen"}
              />
            )}
          </TouchableOpacity>
        </View>
        <View id='MIDDLE_OPTION' className='self-center w-[40%]'>
          <Text
            style={[
              styles.text_md,
              {
                fontSize: actuatedNormalize(20),
                // lineHeight: actuatedNormalizeVertical(28),
              },
            ]}
            className='text-white   text-center'
          >
            {text}
          </Text>
          {route.name == "tasks" && (
            <>
              <Text style={styles.text_sm} className='text-white self-center'>
                Tasks:{text2}
              </Text>
              <Text
                style={styles.text_sm}
                className='text-white absolute w-[100vw] text-center top-[145%]'
              >
                {text3}
              </Text>
            </>
          )}
        </View>
        <Fragment key={"RIGHT_OPTION"}>
          {route.name == "tasks" || route.name == "activetasks" ? (
            <TouchableOpacity onPress={Edit}>
              <AntDesign
                name='select1'
                size={actuatedNormalize(23)}
                color='white'
              />
            </TouchableOpacity>
          ) : route.name == "CreateAccount" || route.name == "ActivateJob" ? (
            <TouchableOpacity
              onPress={() => {
                setVisible(!visible);
              }}
            >
              <AntDesign
                name='delete'
                size={actuatedNormalize(20)}
                color='white'
              />
            </TouchableOpacity>
          ) : (
            <View className='relative border-  border-white'>
              <TouchableOpacity onPress={toggleNotifications}>
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

                <Notify width={actuatedNormalize(20)} />
              </TouchableOpacity>
            </View>
          )}
        </Fragment>
      </View>
      {visible ? (
        <TouchableOpacity
          className='bg-primary_light rounded-2xl self-center absolute top-[5vh] justify-center w-[70%] h-[35%]'
          activeOpacity={1}
        >
          <Motion.View
            initial={{ x: -500 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className='justify-center h-full  w-full  flex self-center'
          >
            <Text style={styles.text_sm} className='text-center mb-2'>
              Press Ok to confirm
            </Text>
            <OdinaryButton
              style={"rounded-sm text-blue-800"}
              navigate={() => {
                route.name == "tasks"
                  ? deleteTasks(id).then((res) => {
                      console.log(res, "deleted task sucessfully");
                    })
                  : route.name == "jobs"
                  ? deleteJob(id).then((res) => {
                      console.log(res, "deleted job sucessfully");
                    })
                  : route.name == "ActivateJob"
                  ? del() & nav.navigate("activeJobs")
                  : route.name == "CreateAccount"
                  ? deleteAccount() &
                    console.log("deleted account sucessfully") &
                    nav.navigate("accounts")
                  : null;
                setVisible(!visible);
              }}
              text={"OK"}
            />
          </Motion.View>
        </TouchableOpacity>
      ) : null}
      {children}
      {notify ? (
        <Motion.View
          initial={{ x: 500 }}
          animate={{ x: 0 }}
          id='NOTIFICATION_MENU'
          style={([], { borderRadius: actuatedNormalize(10) })}
          className='h-[90vh] absolute flex py-[2vh] px-[2vw] top-[4vh] right-0 w-[65%] bg-[#69DC9E]'
        >
          <View className='self-end mb-[2vh]'>
            <TouchableOpacity onPress={toggleNotifications}>
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
    </LinearGradient>
  );
};

const styls = StyleSheet.create({
  topSection: { height: "40%", borderBottomLeftRadius: 35, zIndex: 0 },
  // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
  // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
});

export default Topscreen;
