import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/stylesheet";
import { useSelector } from "react-redux";
import { AccountRealmContext } from "../models";
const { useObject } = AccountRealmContext;
const ProfileCard = () => {
  const { user } = useSelector((state) => state);
  const account = useObject("account", Realm.BSON.ObjectId(user._id));
  return (
    <View
      style={styles.Pcard}
      className='bg-white h-[25vh]  w-[90vw] self-center absolute justify-center top-[28vh] rounded-[28px] '
    >
      {/* <Image
        className='rounded-full w-[25%] absolute top-[-7vh]  self-center '
        source={require("../../assets/images/face.png")}
      /> */}
      <View className='self-center space-y-[15vh]'>
        <Text style={[styles.text]} className='self-center text-primary'>
          {account.name}
        </Text>
        <Text style={styles.text_md2} className='self-center text-[#E59F71]'>
          {account.role}
        </Text>
        <Text style={styles.text_md2} className='self-center text-slate-950'>
          {account.dept}
        </Text>
      </View>
    </View>
  );
};

export default ProfileCard;
