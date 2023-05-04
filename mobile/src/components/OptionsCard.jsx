import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {styles }from '../styles/stylesheet';
import { MaterialIcons } from "@expo/vector-icons";
const OptionsCard = ({text,icon}) => {

       

    return (
      <View
        style={styles.Pcard}
        className='bg-white mb-[3vh] h-[10vh] flex flex-row justify-between items-center p-5 w-[90vw] self-center top-[18vh] rounded-lg'
      >
        {icon}
        <Text style={styles.text_sm}>{text}</Text>
        <MaterialIcons name='keyboard-arrow-right' size={30} color='black' />
      </View>
    );
}


export default OptionsCard;
