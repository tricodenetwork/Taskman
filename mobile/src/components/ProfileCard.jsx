import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import { styles } from '../styles/stylesheet';

const ProfileCard = () => {
    return (
      <View
        style={styles.Pcard}
        className='bg-white h-[25vh] w-[90vw] self-center absolute top-[28vh] rounded-[28px] '
      >
        <Image
          className='rounded-full w-28 h-28 self-center absolute top-[-56px]'
          source={require("../../assets/images/face.png")}
        />
        <View className='self-center space-y-4 text-lg absolute top-[8vh]'>
          <Text
            style={styles.text}
            className=' text-lg self-center text-primary'
          >
            Victor Osamuyi
          </Text>
          <Text
            style={styles.text_md2}
            className=' text-lg self-center text-[#77e6b6]'
          >
            Admin
          </Text>
          <Text
            style={styles.text_md2}
            className=' text-lg self-center text-black'
          >
            Exams and Records
          </Text>
        </View>
      </View>
    );
}



export default ProfileCard;
