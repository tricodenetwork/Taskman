import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
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
import { AccountRealmContext } from "../models";
import { Account } from "../models/Account";

const { useRealm, useQuery } = AccountRealmContext;

const CreateAccount = ({ navigation }) => {
  const dispatch = useDispatch();
  const { visible } = useSelector((state) => state.app);
  const { user } = useSelector((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const realm = useRealm();
  const accounts = useQuery(Account);
  //  console.log(item);

  const editAccount = useCallback(
    (user) => {
      // Alternatively if passing the ID as the argument to handleToggleTaskStatus:
      realm?.write(() => {
        const account = realm?.objectForPrimaryKey("account", route.params?.id); // If the ID is passed as an ObjectId
        // const task = realm?.objectForPrimaryKey('Task', Realm.BSON.ObjectId(id));  // If the ID is passed as a string
        account.name = user.name;
        account.email = user.email;
        account.dept = user.dept;
        account.password = user.password;
        account.role = user.role;
        account.phone = user.phone;
      });
    },
    [realm]
  );

  const createAccount = useCallback(
    (user) => {
      if (!user) {
        return;
      }
      realm.write(() => {
        return new Account(realm, user);
      });
    },
    [realm]
  );

  const initialUser = () => {
    if (route.params) {
      // const { item } = route.params;
      const item = realm?.objectForPrimaryKey("account", route.params.id);
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
        <View className='bg-slate-200 h-[80vh] rounded-t-3xl justify-start   w-full absolute bottom-0'>
          <View className='flex items-center mt-[5vh] justify-between h-[80%]'>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Name:</Text>
              <TextInput
                defaultValue={user.name}
                style={[
                  styles.averageText,
                  { height: actuatedNormalizeVertical(50) },
                ]}
                onChangeText={(value) => {
                  dispatch(setName(value));
                }}
                className='w-[65vw] bg-slate-300  rounded-sm'
              />
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Role:</Text>
              <View className='w-[65vw] relative bg-slate-300  rounded-sm '>
                {visible && (
                  <Motion.View
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.2 }}
                    style={styles.box}
                    className='bg-white absolute bottom-0 right-0  space-y-1  border-2 border-black w-[65vw] flex justify-around rounded-md'
                  >
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(setRole("Admin"));
                        dispatch(setVisible(!visible));
                      }}
                    >
                      <Text
                        style={[styles.averageText]}
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
                        style={[styles.averageText]}
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
                        style={[styles.averageText]}
                        className='border-b-[1px] border-b-slate-700'
                      >
                        Handler
                      </Text>
                    </TouchableOpacity>
                  </Motion.View>
                )}
                <TextInput
                  editable={false}
                  style={[
                    styles.averageText,
                    { height: actuatedNormalizeVertical(50) },
                  ]}
                  value={user.role}
                  className='w-[65vw] bg-slate-300 text-black  rounded-sm'
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setVisible(!visible));
                }}
                className='absolute right-0'
              >
                <AntDesign
                  name='select1'
                  size={actuatedNormalize(20)}
                  color='black'
                />
              </TouchableOpacity>
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Phone:</Text>
              <TextInput
                defaultValue={user.phone}
                style={[
                  styles.averageText,
                  { height: actuatedNormalizeVertical(50) },
                ]}
                onChangeText={(value) => {
                  dispatch(setPhone(value));
                }}
                className='w-[65vw] bg-slate-300  rounded-sm'
              />
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Dept:</Text>
              <TextInput
                defaultValue={user.dept}
                style={[
                  styles.averageText,
                  { height: actuatedNormalizeVertical(50) },
                ]}
                onChangeText={(value) => {
                  dispatch(setDept(value));
                }}
                className='w-[65vw] bg-slate-300  rounded-sm'
              />
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Email:</Text>
              <TextInput
                defaultValue={user.email}
                style={[
                  styles.averageText,
                  { height: actuatedNormalizeVertical(50) },
                ]}
                onChangeText={(value) => {
                  dispatch(setEmail(value));
                }}
                className='w-[65vw] bg-slate-300  rounded-sm'
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
                editable={false}
                style={[
                  styles.averageText,
                  { height: actuatedNormalizeVertical(50) },
                ]}
                secureTextEntry={false}
                value={user.password}
                className='w-[60vw] bg-slate-300 mt-2 text-black  rounded-sm'
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
                  // user.phone === "" ||
                  user.password === ""
                ? true
                : false
            }
            navigate={() => {
              setIsLoading(true);

              if (route.params) {
                editAccount(user);
              } else {
                createAccount(user);
              }
              setIsLoading(false);

              navigation.navigate("accounts");
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
