import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
import Background from "../../components/Background";
import HandlerTopscreen from "../../components/HandlerTopScreen";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../../styles/stylesheet";
import { useNavigation, useRoute } from "@react-navigation/native";
import OptionsCard from "../../components/OptionsCard";
import { FontAwesome5 } from "@expo/vector-icons";
import LowerButton from "../../components/LowerButton";
import { AccountRealmContext } from "../../models";
import { useSelector } from "react-redux";
import { formattedDate } from "../../api/Functions";
import { useUser } from "@realm/react";
import { MaterialIcons } from "@expo/vector-icons";
import { chats as chat, chatroom } from "../../models/Chat";

const { useQuery } = AccountRealmContext;

export default function ClientScreen() {
  // prettier-ignore
  //   -------------------------------------------------------------------------VARIABLES AND STATES
  const user = useUser();
  const navigation = useNavigation();
  const chats = useQuery(chat);
  const { _id, clientId } = useSelector((state) => state.user);
  // const account = useObject("account", Realm.BSON.ObjectId(id));
  // const activeJobs = useQuery(activejob);
  const handleLogout = useCallback(() => {
    user?.logOut();
  }, [user]);

  const userRooms = useQuery(chatroom)
    .filtered(`recieverId == $0 || senderId == $0`, _id)
    .map((params) => params._id)
    .filter(
      (roomId) =>
        chats.filtered(
          `status != "read" AND user._id != $0 AND roomId == $1`,
          _id,
          roomId
        ).length > 0
    );

  return (
    <Background>
      <HandlerTopscreen
        text3={formattedDate}
        text={`Hello, ${clientId}`}
      ></HandlerTopscreen>
      <View className='self-center flex justify-between h-[40vh] py-[2.5vh]'>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("activeJobs");
            }}
            activeOpacity={0.9}
            className='rounded-md bg-primary'
          >
            <OptionsCard
              icon={
                <FontAwesome5
                  name='tasks'
                  size={actuatedNormalize(25)}
                  color='black'
                />
              }
              text={"Job"}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("security");
            }}
            activeOpacity={0.9}
            className='rounded-md bg-primary'
          >
            <OptionsCard
              text={"Change Password"}
              icon={
                <MaterialIcons
                  style={{
                    // backgroundColor: "rgba(186,90,49,.5)",
                    // padding: actuatedNormalize(7),
                    borderRadius: 5,
                  }}
                  name='lock-outline'
                  size={actuatedNormalize(27)}
                  color='black'
                />
              }
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("messages");
          }}
          activeOpacity={0.9}
          className='relative flex rounded-md bg-primary flex-row max-h-max'
        >
          <OptionsCard
            icon={
              <FontAwesome5
                name='rocketchat'
                size={actuatedNormalize(25)}
                color='black'
              />
            }
            text={"Messages"}
          />
          {userRooms.length !== 0 ? (
            <View
              style={{
                width: actuatedNormalize(25),
                height: actuatedNormalize(25),
              }}
              className='rounded-full absolute left-[15vw] self-center   flex items-center justify-center bg-purple-500'
            >
              <Text
                className='text-red-100'
                style={[
                  styles.text_sm,
                  {
                    fontSize: actuatedNormalize(12),
                    lineHeight: actuatedNormalizeVertical(12 * 1.5),
                  },
                ]}
              >
                {userRooms.length}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
      <LowerButton
        style={"w-[90vw]"}
        navigate={handleLogout}
        text={"Log Out"}
      />
    </Background>
  );
}
