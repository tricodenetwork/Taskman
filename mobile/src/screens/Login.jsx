import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { styles } from "../styles/stylesheet";
import LowerButton from "../components/LowerButton";

const Login = ({ navigation }) => {
  const [usermail, setUsermail] = useState(" ");
  const [password, setPassword] = useState(" ");

  return (
    <Background>
      <Topscreen>
        <Text
          style={styles.text}
          className='text-2xl text-white absolute bottom-[3vh] ml-[5vw]'
        >
          Fill in Details
        </Text>
      </Topscreen>
      <View className='w-[90vw] mt-[10vh] self-center'>
        <Text style={styles.text_md2} className='text-amber-950 mb-[1vh]'>
          Username/Email
        </Text>
        <TextInput className='w-full h-[5vh] bg-slate-400 rounded-sm self-center' />
      </View>
      <View className='w-[90vw] mt-[3vh] self-center'>
        <Text style={styles.text_md2} className='text-amber-950 mb-[1vh]'>
          Password
        </Text>
        <TextInput
          secureTextEntry
          className='w-full h-[5vh] bg-slate-400 rounded-sm self-center'
        />
      </View>
      <LowerButton
        navigate={() => navigation.navigate("taskman")}
        text={"Log in"}
      />
    </Background>
  );
};

export default Login;
