import { View, Text } from "react-native";
import React, { useState } from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { TextInput } from "react-native-gesture-handler";
import { styles } from "../styles/stylesheet";
import OdinaryButton from "../components/OdinaryButton";
import { AccountRealmContext } from "../models";
import { useSelector } from "react-redux";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function Security() {
  const { user } = useSelector((state) => state);
  const realm = useRealm();
  const Account = useObject("account", Realm.BSON.ObjectId(user._id));
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

      <View className='flex mt-[10vh] items-center space-y-[5vh] self-center w-full'>
        <Text style={styles.text_md2}>Old Password</Text>
        <TextInput
          style={styles.averageText}
          onChangeText={setOldPassword}
          className='bg-slate-400 w-[60vw] h-[5vh] '
        />
      </View>
      <View className='flex mt-[10vh] items-center space-y-[5vh] self-center w-full'>
        <Text style={styles.text_md2}>New Password</Text>
        <TextInput
          style={styles.averageText}
          onChangeText={setNewPassword}
          className='bg-slate-400 w-[60vw] h-[5vh] '
        />
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
