import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import { MaterialIcons } from "@expo/vector-icons";
const OptionsCard = ({ text, icon }) => {
  return (
    <View
      style={styles.Pcard}
      className='bg-white rounded-md  h-[10vh] flex flex-row justify-between items-center px-[4vw] w-[90vw] self-center'
    >
      {icon}
      <Text style={styles.text_sm2}>{text}</Text>
      <MaterialIcons
        name='keyboard-arrow-right'
        size={actuatedNormalize(20)}
        color='black'
      />
    </View>
  );
};

export default OptionsCard;
