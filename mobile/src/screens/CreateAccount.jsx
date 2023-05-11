import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { styles } from "../styles/stylesheet";
import LowerButton from "../components/LowerButton";
import {
  editJob,
  editUser,
  generatePassword,
  sendUserDetails,
} from "../api/Functions";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setVisible } from "../store/slice-reducers/Formslice";
import { Motion } from "@legendapp/motion";
import {
  setName,
  setEmail,
  setDept,
  setPhone,
  setRole,
  setPassword,
  setId,
  setUser,
} from "../store/slice-reducers/userSlice";
import { useRoute } from "@react-navigation/native";

const CreateAccount = ({ navigation }) => {
  const dispatch = useDispatch();
  const { visible } = useSelector((state) => state.app);
  const { user } = useSelector((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  //  console.log(item);

  const initialUser = () => {
    if (route.params) {
      const { item } = route.params;
      console.log(item);
      dispatch(setUser(item));
      // dispatch(setName(item.name));
      // dispatch(setEmail(item.email));
      // dispatch(setDept(item.dept));
      // dispatch(setPassword(item.password));
      // dispatch(setRole(item.role));
      // dispatch(setPhone(item.phone));
    } else {
      return;
    }
  };

  useEffect(() => {
    initialUser();
  }, []);
  return (
    <Background>
      <Topscreen
        onPress={() => {
          navigation.goBack();
        }}
        text={route.params ? `Edit Account` : "Create Account"}
      />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View className='bg-slate-200 h-[85vh] rounded-t-3xl justify-center  p-2 w-full absolute bottom-0'>
          <View className='flex items-center justify-between h-[55vh]'>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Name:</Text>
              <TextInput
                defaultValue={user.name}
                style={styles.averageText}
                onChangeText={(value) => {
                  dispatch(setName(value));
                }}
                className='w-[70vw] bg-slate-300  rounded-sm h-10'
              />
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Role:</Text>
              <View className='w-[70vw] relative bg-slate-300  rounded-sm h-10'>
                {visible && (
                  <Motion.View
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.2 }}
                    style={styles.box}
                    className='bg-white absolute bottom-0 right-0  space-y-1  border-2 border-black w-[70vw] flex justify-around rounded-md'
                  >
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(setRole("Admin"));
                        dispatch(setVisible(!visible));
                      }}
                    >
                      <Text
                        style={styles.averageText}
                        className='border-b-[1px] border-b-slate-700'
                      >
                        Admin
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(setRole("Supervisor"));
                        dispatch(setVisible(!visible));
                      }}
                    >
                      <Text
                        style={styles.averageText}
                        className='border-b-[1px] border-b-slate-700'
                      >
                        Supervisor
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(setRole("Handler"));
                        dispatch(setVisible(!visible));
                      }}
                    >
                      <Text
                        style={styles.averageText}
                        className='border-b-[1px] border-b-slate-700'
                      >
                        Handler
                      </Text>
                    </TouchableOpacity>
                  </Motion.View>
                )}
                <TextInput
                  editable={false}
                  style={styles.averageText}
                  value={user.role}
                  className='w-[70vw] bg-slate-300 text-black  rounded-sm h-10'
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setVisible(!visible));
                }}
                className='absolute right-0'
              >
                <AntDesign name='select1' size={24} color='black' />
              </TouchableOpacity>
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Phone:</Text>
              <TextInput
                defaultValue={user.phone}
                style={styles.averageText}
                onChangeText={(value) => {
                  dispatch(setPhone(value));
                }}
                className='w-[70vw] bg-slate-300  rounded-sm h-10'
              />
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Dept:</Text>
              <TextInput
                defaultValue={user.dept}
                style={styles.averageText}
                onChangeText={(value) => {
                  dispatch(setDept(value));
                }}
                className='w-[70vw] bg-slate-300  rounded-sm h-10'
              />
            </View>
            <View className='flex  items-center relative left-[8vw] justify-center'>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setPassword(generatePassword(10)));
                }}
                className='bg-Supervisor2 p-2 rounded-md'
              >
                <Text style={styles.text}>Generate Password</Text>
              </TouchableOpacity>
              <TextInput
                onChangeText={(value) => {
                  dispatch(setPassword(value));
                }}
                editable={false}
                style={styles.averageText}
                secureTextEntry={false}
                value={user.password}
                className='w-[60vw] bg-slate-300 mt-2  rounded-sm h-10'
              />
            </View>
          </View>
          <LowerButton
            disabled={
              route.params
                ? false
                : user.name === "" ||
                  user.role === "" ||
                  user.dept === "" ||
                  user.phone === "" ||
                  user.password === ""
                ? true
                : false
            }
            navigate={() => {
              setIsLoading(true);

              if (route.params) {
                editUser(user).then((res) => {
                  console.log(res);
                });
              } else {
                sendUserDetails(user).then((res) => {
                  dispatch(setId(res));
                  console.log(res);
                });
              }
              setIsLoading(false);
              route.params
                ? navigation.navigate("accounts")
                : navigation.navigate("accounts");
              //   console.log(job.id);
            }}
            text={route.params ? "Edit" : "Create"}
          />
        </View>
      )}
    </Background>
  );
};

export default CreateAccount;
