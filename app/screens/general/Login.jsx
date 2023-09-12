import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Modal,
} from "react-native";
import Background from "../../components/Background";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../../styles/stylesheet";
import { Realm, useApp } from "@realm/react";
import Eye from "../../../assets/icons/eye.svg";
import EyesClosed from "../../../assets/icons/closed.svg";
import Error from "../../../assets/icons/error.svg";
import Logo from "../../../assets/images/C.svg";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";

let AuthState;
(function (AuthState) {
  AuthState[(AuthState["None"] = 0)] = "None";
  AuthState[(AuthState["Loading"] = 1)] = "Loading";
  AuthState[(AuthState["LoginError"] = 2)] = "LoginError";
  AuthState[(AuthState["User"] = 3)] = "User";
})(AuthState || (AuthState = {}));

const Login = ({ navigation }) => {
  const [usermail, setUsermail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(true);
  const app = useApp();
  const [authState, setAuthState] = useState(AuthState.None);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const checkNetworkConnection = async () => {
      try {
        const response = await fetch("https://www.google.com", {
          method: "HEAD",
          mode: "no-cors",
        });
        setIsOffline(!response.ok);
      } catch (error) {
        setIsOffline(true);
      }
    };

    checkNetworkConnection();
  }, []);

  const handleLogin = useCallback(async () => {
    if (usermail == "") {
      alert("Enter Username 👤");
      return;
    }
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

  const userName = (val) => {
    const name = val.trim();

    setUsermail(name);
  };

  const Pass = (val) => {
    setPassword(val.trim());
  };

  return (
    <Background bgColor='bg-primary min-h-[90vh]   items-center justify-center'>
      <View
        style={{ borderRadius: actuatedNormalize(25) }}
        className='relative w-[90vw] h-[55vh] bg-slate-300 px-[12vw] pt-[4vh] pb-[12vh] border-2 border-Supervisor2'
      >
        <View className='w-[50vw] mt-[2vh] self-center'>
          <Text
            style={styles.text_md}
            className='text-purple-600 text-center mb-[1vh]'
          >
            Name
          </Text>
          <View className='relative items-center flex flex-row'>
            <TextInput
              style={styles.averageText}
              value={usermail}
              onChangeText={userName}
              className='w-full h-[5vh] bg-slate-400 rounded-sm self-center'
            />
            <View className={"absolute right-[1vw]"}></View>
          </View>
        </View>
        <View className='w-[50vw] mt-[7.5vh] self-center'>
          <Text
            style={styles.text_md}
            className='text-purple-600 text-center mb-[1vh]'
          >
            Password
          </Text>
          <View className='relative items-center flex flex-row'>
            <TextInput
              style={styles.averageText}
              value={password}
              onChangeText={Pass}
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
                  <EyesClosed
                    width={actuatedNormalize(22)}
                    height={actuatedNormalizeVertical(22)}
                    color={"gray"}
                  />
                ) : (
                  <Eye
                    width={actuatedNormalize(23)}
                    height={actuatedNormalizeVertical(23)}
                    color={"rgb(147 51 234)"}
                  />
                )}
              </Pressable>
            </View>
          </View>
        </View>
        <Text
          style={[styles.averageText, { fontSize: actuatedNormalize(12) }]}
          className='text-purple-600 mt-[9.5vh] text-center'
        >
          Forgot Password? Check your mail!
        </Text>

        {/* <LowerButton
          disabled={authState == 1}
          style={"bg-[#FFCB47]  w-[30vw]"}
          textStyle='text-slate-900'
          navigate={}
          text={"Log in"}
        /> */}
        <View className='absolute bottom-[2%] self-center'>
          <TouchableOpacity
            onPress={handleLogin}
            style={[{ borderRadius: actuatedNormalize(10) }]}
            className='bg-[#FFBA0A] px-[8vw] py-[1.2vh]'
          >
            <Text
              className='text-center text-slate-900'
              style={[styles.text_md]}
            >
              Log in
            </Text>
          </TouchableOpacity>
        </View>
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
      {/* Add a Modal to show a message when there's no internet connection */}
      <Modal visible={isOffline}>
        <View className='flex bg-slate-300 space-y-[3vh] h-full justify-center items-center'>
          <Error width={40} height={40} color='red' />
          <Text className='text-primary' style={styles.text_md}>
            No internet connection. Please check your network!
          </Text>
        </View>
      </Modal>

      {/* ... rest of your component code ... */}
      <View className='flex flex-row items-end absolute top-[4.5vh] self-center '>
        <View className=' left-0 top-0'>
          <Logo width={actuatedNormalize(35)} height={actuatedNormalize(35)} />
        </View>
        <Text
          style={[styles.averageText, { fontStyle: "normal" }]}
          className='text-cyan-500'
        >
          {` `}
        </Text>
      </View>
    </Background>
  );
};

export default Login;
