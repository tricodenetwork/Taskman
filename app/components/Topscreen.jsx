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
  const { user } = useSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const realm = useRealm();
  const accounts = useQuery(Account);
  const nav = useNavigation();
  const back = () => {
    nav.goBack();
  };
  const id = route.params ? route.params.id : null;

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
      realm?.delete(
        realm?.objectForPrimaryKey(
          "account",
          Realm.BSON.ObjectId(route.params.id)
        )
      );
    });
  }, [realm]);

  const deleteJob = useCallback(() => {
    realm.write(() => {
      // realm.delete(route.params.item);

      // Alternatively if passing the ID as the argument to handleDeleteTask:
      realm?.delete(realm?.objectForPrimaryKey("job", Realm.BSON.ObjectId(id)));

      alert("Deleted Successfully!");
    });
  }, [realm]);

  return (
    <LinearGradient
      style={styls.topSection}
      colors={["#004343", "#0C4D4D"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
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
              style={"rounded-sm mt-4 bg-primary"}
              navigate={() => {
                route.name == "CreateJob"
                  ? deleteJob() & nav.navigate("jobs")
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
      <View
        id='HEADER_NAV'
        className='px-[4vw] absolute top-0  flex-row items-center max-h-max  justify-center  w-full border-white mt-[2vh]  flex  rounded-bl-[35px]'
      >
        <Menu />
        <View className='absolute   left-[3vw]' id='LEFT_OPTION'>
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
        <View id='MIDDLE_OPTION' className='self-center   w-[60%]'>
          <Text
            style={[
              styles.text_md,
              {
                fontSize: actuatedNormalize(16),
                lineHeight: actuatedNormalizeVertical(28),
              },
            ]}
            className='text-white   text-center'
          >
            {text}
          </Text>
          {route.name == "tasks" && (
            <Text style={styles.text_sm} className='text-white self-center'>
              Tasks:{text2}
            </Text>
          )}
          {route.name == "activetasks" ||
            (route.name == "taskdetailsscreen" && (
              <Text
                style={styles.text_sm}
                className='text-white mt-[1vh] self-center'
              >
                {text3}
              </Text>
            ))}
        </View>
        {user.role !== "Client" && (
          <View className='absolute right-[3vw]'>
            <Fragment key={"RIGHT_OPTION"}>
              {route.name == "tasks" || route.name == "activetasks" ? (
                <TouchableOpacity onPress={Edit}>
                  <AntDesign
                    name='select1'
                    size={actuatedNormalize(23)}
                    color='white'
                  />
                </TouchableOpacity>
              ) : (route.name == "CreateJob" && route.params) ||
                (route.name == "CreateAccount" && route.params) ||
                (route.name == "ActivateJob" && route.params) ? (
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
              ) : route.name == "activeJobs" ? (
                <TouchableOpacity
                  onPress={() => {
                    nav.navigate("stats");
                  }}
                >
                  <Ionicons
                    name='stats-chart'
                    size={actuatedNormalize(20)}
                    color='white'
                  />
                </TouchableOpacity>
              ) : null}
            </Fragment>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styls = StyleSheet.create({
  topSection: { height: "40%", borderBottomLeftRadius: 35, zIndex: 0 },
  // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
  // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
});

export default Topscreen;
