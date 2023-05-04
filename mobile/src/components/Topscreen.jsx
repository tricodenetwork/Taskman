import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import Notify from '../../assets/images/notify.svg';
import { styles } from '../styles/stylesheet';
import Svg, { Circle, Rect } from "react-native-svg";
import ProfileCard from './ProfileCard'




const Topscreen = () => {
    return (
      <LinearGradient
        className=''
        style={styls.topSection}
        colors={["#004343", "#0C4D4D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View id='headerNav' className='px-4 justify-between flex-row items-center h-[20%] bg-opacity-100 border- border-white mt-[4vh]  relative flex  rounded-bl-[35px]'>
          <TouchableOpacity>
            <Ionicons
              name='md-arrow-back-outline'
              size={30}
              style={styles.backArrow}
              color='white'
            />
          </TouchableOpacity>
          <Text style={styles.text_md} className='text-white text-xl'>
            Profile
          </Text>
          <TouchableOpacity className='relative border- border-white'>
            <Svg
              className='absolute  bottom-2 right-[-1vw]'
              height='50%'
              width='50%'
              viewBox='0 0 100 100'
            >
              <Circle
                cx='50'
                cy='50'
                r='40'
                stroke='blue'
                strokeWidth='0'
                fill='#77e6b6'
              />
            </Svg>

            <Notify width={20} height={22} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
}

const styls = StyleSheet.create({

    topSection: {height:'40%', borderBottomLeftRadius: 35}
,
    // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
    // backArrow:{position:'absolute',left:0,top:0, alignSelf:'flex-start', marginLeft: 20, marginTop: 20}
})

export default Topscreen;
