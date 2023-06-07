import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Modal,
} from "react-native";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
import LowerButton from "../components/LowerButton";
import { Realm, useApp } from "@realm/react";
import * as Updates from "expo-updates";
import Eye from "../../assets/icons/eye.svg";
import EyesClosed from "../../assets/icons/closed.svg";
import Error from "../../assets/icons/error.svg";
import { Motion } from "@legendapp/motion";

export let AuthState;
(function (AuthState) {
  AuthState[(AuthState["None"] = 0)] = "None";
  AuthState[(AuthState["Loading"] = 1)] = "Loading";
  AuthState[(AuthState["LoginError"] = 2)] = "LoginError";
  AuthState[(AuthState["User"] = 3)] = "User";
})(AuthState || (AuthState = {}));
export const Login = ({ navigation }) => {
  const [usermail, setUsermail] = useState(" ");
  const [password, setPassword] = useState(" ");
  const [show, setShow] = useState(true);
  const app = useApp();
  const [authState, setAuthState] = useState(AuthState.None);
  // console.log(authState);

  const handleLogin = useCallback(async () => {
    setAuthState(AuthState.Loading);
    // const credentials = Realm.Credentials.anonymous();
    const credentials = Realm.Credentials.function({
      name: usermail,
      password: password,
    });
    try {
      await app.logIn(credentials);
      setAuthState(AuthState.None);
    } catch (e) {
      console.log("Error logging in", e);
      setAuthState(AuthState.LoginError);

      setTimeout(() => {
        setAuthState(AuthState.None);
      }, 2500);
    }
  }, [usermail, password, setAuthState, app]);

  return (
    <Background bgColor='bg-primary min-h-[90vh] items-center justify-center'>
      <Text className='text-primary_light text-2xl absolute top-[3vh] left-[5vw]'>
        {/* Uniben */}
      </Text>
      <View className=' rounded-3xl relative my-auto bg-slate-300 px-[12vw] pt-[4vh] pb-[8vh] border-2 border-Supervisor2'>
        <View className='w-[55vw] mt-[7vh] self-center'>
          <Text
            style={styles.text_md}
            className='text-purple-600 text-center mb-[1vh]'
          >
            Name
          </Text>
          <View className='relative items-center flex flex-row'>
            <TextInput
              style={styles.averageText}
              value={usermail.trimStart()}
              onChangeText={setUsermail}
              className='w-full h-[5vh] bg-slate-400 rounded-sm self-center'
            />
            <View className={"absolute right-[1vw]"}></View>
          </View>
        </View>
        <View className='w-[55vw] mt-[3vh] self-center'>
          <Text
            style={styles.text_md}
            className='text-purple-600 text-center mb-[1vh]'
          >
            Password
          </Text>
          <View className='relative items-center flex flex-row'>
            <TextInput
              style={styles.averageText}
              value={password.trimStart()}
              onChangeText={setPassword}
              secureTextEntry={show}
              className='w-full h-[5vh] bg-slate-400 rounded-sm self-center'
            />
            <View className={"absolute right-[1vw]"}>
              <Pressable
                onPress={() => {
                  setShow(!show);
                }}
              >
                {!show ? (
                  <Motion.EyesClosed
                    width={actuatedNormalize(22)}
                    height={actuatedNormalizeVertical(22)}
                    color={show ? "purple" : "gray"}
                  />
                ) : (
                  <Eye
                    width={actuatedNormalize(23)}
                    height={actuatedNormalizeVertical(23)}
                    color={show ? " rgb(147 51 234)" : "gray"}
                  />
                )}
              </Pressable>
            </View>
          </View>
        </View>
        <Text className='text-purple-600 mt-[5vh] text-center'>
          Forgot Password? Check your mail!
        </Text>
      </View>
      <Modal visible={authState == 1}>
        <View className='flex bg-slate-300 h-full justify-center items-center'>
          <ActivityIndicator size={"large"} />
          <Text className='text-primary' style={styles.text_md}>
            Checking user details!
          </Text>
        </View>
      </Modal>
      <Modal visible={authState == 2}>
        <View className='flex bg-slate-300 space-y-[3vh] h-full justify-center items-center'>
          <Error width={40} height={40} color='red' />
          <Text className='text-primary' style={styles.text_md}>
            Please ensure your details are correct
          </Text>
        </View>
      </Modal>

      <LowerButton
        disabled={authState == 1}
        style={"bg-[#77E6B6]"}
        textStyle='text-slate-900'
        navigate={() => {
          handleLogin();
          // navigation.navigate("accounts");
        }}
        text={"Log in"}
      />
    </Background>
  );
};

export default Login;
