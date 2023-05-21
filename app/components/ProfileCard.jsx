import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import { actuatedNormalize, styles } from "../styles/stylesheet";

const ProfileCard = () => {
  return (
    <View
      style={styles.Pcard}
      className='bg-white h-[25vh]  w-[90vw] self-center absolute top-[28vh] rounded-[28px] '
    >
      <Image
        className='rounded-full w-[25%] absolute top-[-7vh]  self-center '
        source={require("../../assets/images/face.png")}
      />
      <View className='self-center space-y-[4vh] absolute  top-[8vh]'>
        <Text style={[styles.text]} className='self-center text-primary'>
          Victor Osamuyi
        </Text>
        <Text style={styles.text_md2} className='self-center text-[#E59F71]'>
          Admin
        </Text>
        <Text style={styles.text_md2} className='self-center text-slate-950'>
          Exams and Records
        </Text>
      </View>
    </View>
  );
};



export default ProfileCard;
