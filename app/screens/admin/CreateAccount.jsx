import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Background from "../../components/Background";
import Topscreen from "../../components/Topscreen";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../../styles/stylesheet";
import LowerButton from "../../components/LowerButton";
import { generatePassword, sendUserDetails } from "../../api/Functions";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setVisible, setVisible2 } from "../../store/slice-reducers/Formslice";
import { Motion } from "@legendapp/motion";
import {
  setName,
  setEmail,
  setDept,
  setPhone,
  setRole,
  setPassword,
  setCategory,
  setUser,
} from "../../store/slice-reducers/userSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { AccountRealmContext } from "../../models";
import { Account } from "../../models/Account";
import OdinaryButton from "../../components/OdinaryButton";

const { useRealm, useQuery } = AccountRealmContext;

const CreateAccount = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [error2, setError2] = useState(null);

  const dispatch = useDispatch();
  const { visible, visible2 } = useSelector((state) => state.app);
  const { user } = useSelector((state) => state);
  const { Job } = useSelector((state) => state);
  const { id, name, category, no, duration } = Job;
  const route = useRoute();
  const realm = useRealm();
  const accounts = useQuery(Account);
  const Cat = useQuery("category");

  const validateEmail = (email) => {
    // Regular expression to check if email is valid
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleEmailChange = (value) => {
    if (!validateEmail(value)) {
      setError("Please enter a valid email");
    } else {
      if (accounts.filtered(`email ==$0`, value).length !== 0) {
        setError("Email already exist");
      } else {
        dispatch(setEmail(value));
        setError(null);
      }
    }
  };

  const editAccount = useCallback(
    (user) => {
      // Alternatively if passing the ID as the argument to handleToggleTaskStatus:
      realm?.write(() => {
        const account = realm?.objectForPrimaryKey(
          "account",
          Realm.BSON.ObjectId(route.params.id)
        ); // If the ID is passed as an ObjectId
        // const task = realm?.objectForPrimaryKey('Task', Realm.BSON.ObjectId(id));  // If the ID is passed as a string
        account.name = user.name;
        account.email = user.email;
        account.dept = user.dept;
        account.password = user.password;
        account.role = user.role;
        account.phone = user.phone;
        account.category.name = user.category.name;
      });
      sendUserDetails(user.email, user); // Assuming `sendUserDetails` is a function that sends the email

      alert("Success!!");
      navigation.navigate("accounts");
    },
    [realm]
  );

  const createAccount = useCallback(
    (user) => {
      if (!user) {
        return;
      }

      realm.write(() => {
        const newAccount = new Account(realm, user);
        alert("New User Created");
        // Send email to the newly created user
        sendUserDetails(user.email, user); // Assuming `sendUserDetails` is a function that sends the email
        return newAccount;
      });
    },
    [realm]
  );

  const initialUser = () => {
    if (route.params) {
      const item = realm?.objectForPrimaryKey(
        "account",
        Realm.BSON.ObjectId(route.params.id)
      );
      dispatch(setUser(item));
    } else {
      dispatch(setUser());
    }
  };

  useEffect(() => {
    initialUser();
  }, []);
  return (
    <Background bgColor='min-h-[98vh]'>
      <Topscreen
        onPress={() => {
          navigation.goBack();
        }}
        text={route.params ? `Edit Account` : "Create Account"}
      />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View className='bg-slate-200 h-[82vh] rounded-t-3xl justify-start   w-full absolute bottom-0'>
          <View className='flex items-center mt-[6.5vh] justify-between h-[80%]'>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text_md2}>Name:</Text>
              <TextInput
                defaultValue={user.name.trimStart()}
                style={[
                  styles.averageText,
                  { height: actuatedNormalizeVertical(50) },
                ]}
                onChangeText={(value) => {
                  const newValue = value.replace(/\s+/g, " ").trimEnd();
                  if (accounts.filtered(`name ==$0`, newValue).length !== 0) {
                    setError2("User already exist");
                  } else if (!/^[^\s]+\s[^\s]+$/.test(newValue)) {
                    // Check if the entered value contains a name, a space, and then a surname
                    setError2("Name and  Surname required ");
                  } else {
                    dispatch(setName(newValue));
                    setError2(null);
                  }
                }}
                className='w-[65vw] bg-slate-300  rounded-sm'
              />
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text_md2}>Role:</Text>
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
                  name='caretdown'
                  size={actuatedNormalize(20)}
                  color='black'
                />
              </TouchableOpacity>
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text_md2}>Category:</Text>
              <View className='w-[65vw] relative bg-slate-300  rounded-sm'>
                {visible2 && (
                  <Motion.View
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.2 }}
                    style={styles.box}
                    className='bg-white absolute bottom-0 right-0  space-y-1  border-2 border-black w-[65vw] flex justify-around rounded-md'
                  >
                    <FlatList
                      data={Cat}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            dispatch(setCategory(item));
                            dispatch(setVisible2(!visible));
                          }}
                        >
                          <Text
                            style={styles.averageText}
                            className='border-b-[1px] border-b-slate-700'
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </Motion.View>
                )}
                <TextInput
                  defaultValue={user.category?.name}
                  editable={false}
                  style={[
                    styles.averageText,
                    { color: "black", height: actuatedNormalizeVertical(50) },
                  ]}
                  value={user.category?.name}
                  className='w-[65vw] bg-slate-300  rounded-sm'
                />
              </View>
              <View className='absolute right-[1vw]'>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setVisible2(!visible));
                  }}
                >
                  <AntDesign
                    name='caretdown'
                    size={actuatedNormalize(20)}
                    color='black'
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text_md2}>Phone:</Text>
              <TextInput
                defaultValue={user.phone}
                inputMode='numeric'
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
              <Text style={styles.text_md2}>Dept:</Text>
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
            <View className='flex relative items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text_md2}>Email:</Text>
              <TextInput
                defaultValue={user.email}
                style={[
                  styles.averageText,
                  { height: actuatedNormalizeVertical(50) },
                ]}
                onChangeText={(value) => {
                  handleEmailChange(value);
                }}
                className='w-[65vw] bg-slate-300  rounded-sm'
              />
            </View>

            <View className='flex  items-end relative left-[23vw] justify-center'>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setPassword(generatePassword(10)));
                }}
                className='bg-Supervisor2 p-2 rounded-md'
              >
                <Text style={styles.text_md}>Generate Password</Text>
              </TouchableOpacity>
              <TextInput
                editable={false}
                style={[
                  styles.averageText,
                  { height: actuatedNormalizeVertical(50) },
                ]}
                secureTextEntry={false}
                value={user.password}
                className='w-[30vw] bg-slate-300 mt-2 text-black  rounded-sm'
              />
            </View>
          </View>
          {(error || error2) && (
            <Motion.View
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='absolute flex-row items-center space-x-1 px-[1vh] self-center top-[1vh] '
            >
              <Text style={[styles.text_sm, { color: "red" }]}>
                {error || error2}
              </Text>
              <MaterialIcons
                name='error'
                size={actuatedNormalize(18)}
                color='red'
              />
            </Motion.View>
          )}
          <LowerButton
            style={"w-[90vw]"}
            disabled={
              route.params
                ? false
                : user.name === "" ||
                  user.role === "" ||
                  user.dept === "" ||
                  user.phone === "" ||
                  user.email == "" ||
                  user.password == "" ||
                  error ||
                  error2
                ? true
                : false
            }
            navigate={() => {
              setIsLoading(true);

              if (route.params) {
                editAccount(user);
              } else {
                createAccount(user);
                navigation.navigate("accounts");
              }
              setIsLoading(false);

              // navigation.navigate("accounts");
            }}
            text={route.params ? "Edit" : "Create"}
          />
        </View>
      )}
    </Background>
  );
};

export default CreateAccount;
