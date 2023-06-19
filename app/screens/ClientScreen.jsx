import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect } from "react";
import Background from "../components/Background";
import HandlerTopscreen from "../components/HandlerTopScreen";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
import { useNavigation, useRoute } from "@react-navigation/native";
import OptionsCard from "../components/OptionsCard";
import { FontAwesome5 } from "@expo/vector-icons";
import LowerButton from "../components/LowerButton";
import { AccountRealmContext } from "../models";
import { useSelector } from "react-redux";
import { formattedDate } from "../api/Functions";
import { activejob } from "../models/Task";
import { useUser } from "@realm/react";
import { MaterialIcons } from "@expo/vector-icons";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function ClientScreen() {
  // prettier-ignore
  //   -------------------------------------------------------------------------VARIABLES AND STATES
  const route = useRoute();
  const user = useUser();
  const navigation = useNavigation();
  const realm = useRealm();
  const { _id, clientId } = useSelector((state) => state.user);
  // const account = useObject("account", Realm.BSON.ObjectId(id));
  // const activeJobs = useQuery(activejob);
  const handleLogout = useCallback(() => {
    user?.logOut();
  }, [user]);

  return (
    <Background>
      <HandlerTopscreen
        text3={formattedDate}
        text={`Hello, ${clientId}`}
      ></HandlerTopscreen>
      <View className='self-center pt-[3vh]'>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("activeJobs");
            }}
            activeOpacity={0.5}
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

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("messages");
          }}
          activeOpacity={0.5}
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
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("security");
          }}
          activeOpacity={0.5}
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
      <LowerButton
        style={"w-[90vw]"}
        navigate={handleLogout}
        text={"Log Out"}
      />
    </Background>
  );
}
