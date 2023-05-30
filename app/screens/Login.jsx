import React, { useCallback, useState } from "react";
import { View, StyleSheet, Text, TextInput, SafeAreaView } from "react-native";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { styles } from "../styles/stylesheet";
import LowerButton from "../components/LowerButton";
import { Realm, useApp } from "@realm/react";

export let AuthState;
(function (AuthState) {
  AuthState[(AuthState["None"] = 0)] = "None";
  AuthState[(AuthState["Loading"] = 1)] = "Loading";
  AuthState[(AuthState["LoginError"] = 2)] = "LoginError";
  AuthState[(AuthState["RegisterError"] = 3)] = "RegisterError";
})(AuthState || (AuthState = {}));
const Login = ({ navigation }) => {
  const [usermail, setUsermail] = useState(" ");
  const [password, setPassword] = useState(" ");
  const app = useApp();
  const [authState, setAuthState] = useState(AuthState.None);

  const handleLogin = useCallback(async () => {
    console.log("logging in");
    setAuthState(AuthState.Loading);
    // const credentials = Realm.Credentials.anonymous();
    const credentials = Realm.Credentials.function({
      name: usermail,
      password: password,
    });
    try {
      const user = await app.logIn(credentials);
      console.log(user.id);
      setAuthState(AuthState.None);
    } catch (e) {
      console.log("Error logging in", e);
      setAuthState(AuthState.LoginError);
    }
  }, [usermail, password, setAuthState, app]);

  // const users = Realm.objects("account");
  // console.log(users);

  return (
    <SafeAreaView>
      <Background bgColor='bg-primary'>
        {/* <Topscreen>
        <Text
          style={styles.text}
          className='text-2xl  text-white absolute bottom-[3vh] ml-[5vw]'
        >
          Fill in Details
        </Text>
      </Topscreen> */}
        <View className='w-[90vw] mt-[7vh] self-center'>
          <Text style={styles.text_md} className='text-primary_light mb-[1vh]'>
            Name
          </Text>
          <TextInput
            value={usermail.trimStart()}
            onChangeText={setUsermail}
            className='w-full h-[5vh] bg-slate-400 rounded-sm self-center'
          />
        </View>
        <View className='w-[90vw] mt-[3vh] self-center'>
          <Text style={styles.text_md} className='text-primary_light mb-[1vh]'>
            Password
          </Text>
          <TextInput
            onChangeText={setPassword}
            value={password.trim()}
            // secureTextEntry
            className='w-full h-[5vh] bg-slate-400 rounded-sm self-center'
          />
        </View>
        {authState === AuthState.LoginError && (
          <Text style={[styles.error]}>
            There was an error logging in, please try again
          </Text>
        )}
        {authState === AuthState.RegisterError && (
          <Text style={[styles.error]}>
            There was an error registering, please try again
          </Text>
        )}
        <LowerButton
          navigate={() => {
            handleLogin();
            // navigation.navigate("accounts");
          }}
          text={"Log in"}
        />
      </Background>
    </SafeAreaView>
  );
};

export default Login;
