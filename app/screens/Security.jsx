import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { TextInput } from "react-native-gesture-handler";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
import OdinaryButton from "../components/OdinaryButton";
import { AccountRealmContext } from "../models";
import { useSelector } from "react-redux";
import Eye from "../../assets/icons/eye.svg";
import EyesClosed from "../../assets/icons/closed.svg";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function Security() {
  const { user } = useSelector((state) => state);
  const [show, setShow] = useState(true);
  const [show1, setShow1] = useState(true);

  const realm = useRealm();
  const Account =
    user.role !== "Client"
      ? useObject("account", Realm.BSON.ObjectId(user._id))
      : useQuery("client").filtered(`clientId == $0`, user.clientId)[0];
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const status = Account.password == oldPassword;

  const updatePassword = () => {
    if (Account.password !== oldPassword) {
      alert("Please input correct Password");
    } else {
      realm.write(() => {
        if (!newPassword) {
          alert("Enter new password");
        }
        Account.password = newPassword;
      });
      alert("Password changed 🔑");
    }
  };

  return (
    <Background bgColor='min-h-[100vh]'>
      <Topscreen text={"Security"} />

      <View className='flex  mt-[10vh] items-center space-y-[5vh] self-center w-full'>
        <Text style={styles.text_md2}>Old Password</Text>
        <View className='justify-center'>
          <TextInput
            style={styles.averageText}
            onChangeText={setOldPassword}
            secureTextEntry={show}
            className='bg-slate-400 w-[60vw] h-[5vh] '
          />
          <View className={"absolute right-[1vw]"}>
            <Pressable
              onPress={() => {
                setShow(!show);
              }}
            >
              {show ? (
                <EyesClosed
                  width={actuatedNormalize(22)}
                  height={actuatedNormalizeVertical(22)}
                  color={"rgba(147,51, 234,0.7)"}
                />
              ) : (
                <Eye
                  width={actuatedNormalize(23)}
                  height={actuatedNormalizeVertical(23)}
                  color={"rgba(147,51, 234,0.7)"}
                />
              )}
            </Pressable>
          </View>
        </View>
      </View>
      <View className='flex relative mt-[10vh] items-center space-y-[5vh] self-center w-full'>
        <Text style={styles.text_md2}>New Password</Text>
        <View className='justify-center'>
          <TextInput
            style={styles.averageText}
            onChangeText={setNewPassword}
            secureTextEntry={show1}
            className='bg-slate-400 w-[60vw] h-[5vh] '
          />
          <View className={"absolute  right-[1vw]"}>
            <Pressable
              onPress={() => {
                setShow1(!show1);
              }}
            >
              {show1 ? (
                <EyesClosed
                  width={actuatedNormalize(22)}
                  height={actuatedNormalizeVertical(22)}
                  color={"rgba(147,51, 234,0.7)"}
                />
              ) : (
                <Eye
                  width={actuatedNormalize(23)}
                  height={actuatedNormalizeVertical(23)}
                  color={"rgba(147,51, 234,0.7)"}
                />
              )}
            </Pressable>
          </View>
        </View>
      </View>
      <OdinaryButton
        disabled={!status}
        navigate={updatePassword}
        // disabled={Account.password == oldPassword}
        text={"Update"}
        style={"bg-Supervisor3 mt-[10vh]"}
      />
    </Background>
  );
}
