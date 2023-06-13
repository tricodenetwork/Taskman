import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Motion } from "@legendapp/motion";
import Profile from "../screens/Profile";
import Login from "../screens/Login";
import Accounts from "../screens/Accounts";
import CreateAccount from "../screens/CreateAccount";
import CreateJob from "../screens/CreateJob";
import Jobs from "../screens/Jobs";
import Tasks from "../screens/Tasks";
import Taskman from "../screens/Taskman";
import ActivateJob from "../screens/ActivateJob";
import ActiveJobs from "../screens/ActiveJobs";
import Handler from "../screens/Handler";
import { useFlipper } from "@react-navigation/devtools";
import Supervisor from "../screens/Supervisor";
import ActiveTasks from "../screens/ActiveTasks";
import MyTasks from "../screens/MyTasks";
import TaskDetailsPage from "../screens/TaskDetailsPage";
import ChatScreen from "../screens/ChatScreen";
import MessageScreen from "../screens/MessageScreen";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setId, setUser } from "../store/slice-reducers/userSlice";
import { useUser } from "@realm/react";
import Stats from "../screens/Stats";
import Security from "../screens/Security";
import ClientScreen from "../screens/ClientScreen";
import { AccountRealmContext } from "../models";
import IndividualTask from "../screens/IndividualTask";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const { useObject, useQuery } = AccountRealmContext;

export const MainStack = () => {
  const navRef = useNavigationContainerRef();
  const dispatch = useDispatch();
  const user = useUser();
  const oid = user.identities[0].id;
  const cleanedOid = oid.replace(/[^0-9a-zA-Z]/g, "");

  const account =
    cleanedOid.length > 10
      ? useObject("account", Realm.BSON.ObjectId(cleanedOid))
      : useQuery("client").filtered(`clientId == $0`, cleanedOid)[0];

  useEffect(() => {
    dispatch(setUser(account));
  }, [account, cleanedOid]);

  useFlipper(navRef);
  return (
    <NavigationContainer ref={navRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={
          account.role == "Admin"
            ? "taskman"
            : account.role == "Handler"
            ? "handler"
            : account.role == "Supervisor"
            ? "supervisor"
            : account.role == "Client"
            ? "client"
            : "login"
        }
      >
        <Stack.Screen name='taskman' component={Taskman} />
        <Stack.Screen name='profile' component={Profile} />
        <Stack.Screen name='login' component={Login} />
        <Stack.Screen name='accounts' component={Accounts} />
        <Stack.Screen name='jobs' component={Jobs} />
        <Stack.Screen name='tasks' component={Tasks} />
        <Stack.Screen name='CreateAccount' component={CreateAccount} />
        <Stack.Screen name='CreateJob' component={CreateJob} />
        <Stack.Screen name='security' component={Security} />
        <Stack.Screen name='it' component={IndividualTask} />

        {/* //Supervisor */}
        <Stack.Screen name='supervisor' component={Supervisor} />
        <Stack.Screen name='ActivateJob' component={ActivateJob} />
        <Stack.Screen name='activeJobs' component={ActiveJobs} />
        <Stack.Screen name='activetasks' component={ActiveTasks} />
        <Stack.Screen name='stats' component={Stats} />
        {/* Handler */}
        <Stack.Screen name='handler' component={Handler} />
        <Stack.Screen name='mytasks' component={MyTasks} />
        <Stack.Screen name='chats' component={ChatScreen} />
        <Stack.Screen name='messages' component={MessageScreen} />
        <Stack.Screen name='taskdetailsscreen' component={TaskDetailsPage} />
        <Stack.Screen name='client' component={ClientScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// const TabNav = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarHideOnKeyboard: true,
//         tabBarActiveTintColor: "#FF6600",
//         tabBarStyle: {
//           backgroundColor: "white",
//           borderTopWidth: 0,
//           borderTopLeftRadius: 30,
//           borderTopRightRadius: 30,
//           position: "absolute",
//           // top: 50,

//           // left: 50,
//           // right: 50,
//           bottom: 0,
//           height: "10%",
//         },
//         tabBarItemStyle: {
//           // backgroundColor: "#00ff00",

//           margin: 15,
//         },
//       }}
//     >
//       <Tab.Screen
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <AntDesign name='home' color={color} size={30} />
//           ),
//           header: () => {},
//         }}
//         name='main'
//         component={Home}
//       />
//       <Tab.Screen
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons
//               name='ios-chatbubble-ellipses-outline'
//               size={30}
//               color={color}
//             />
//           ),
//           header: () => {},
//         }}
//         name='chat'
//         component={Initial}
//       />
//       <Tab.Screen
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name='md-notifications-outline' size={30} color={color} />
//           ),
//           header: () => {},
//         }}
//         name='notificaton'
//         component={Initial}
//       />
//       <Tab.Screen
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name='md-settings-outline' size={30} color={color} />
//           ),
//           header: () => {},
//         }}
//         name='settings'
//         component={Initial}
//       />
//     </Tab.Navigator>
//   );
// };
