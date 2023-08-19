import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import { setUser } from "../store/slice-reducers/userSlice";
import { useUser } from "@realm/react";
import Stats from "../screens/Stats";
import Security from "../screens/Security";
import ClientScreen from "../screens/ClientScreen";
import { AccountRealmContext } from "../models";
import IndividualTask from "../screens/IndividualTask";
import Actions from "../screens/Actions";
import DeleteJobs from "../screens/DeleteJobs";

const Stack = createNativeStackNavigator();

const { useObject, useQuery } = AccountRealmContext;

export const MainStack = () => {
  const navRef = useNavigationContainerRef();
  const dispatch = useDispatch();
  const user = useUser();
  const oid = user.identities[0].id;
  const cleanedOid = oid.replace(/[^0-9a-zA-Z ]/g, "");

  const account =
    cleanedOid.length > 20
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
        <Stack.Screen name='actions' component={Actions} />

        {/* //Supervisor */}
        <Stack.Screen name='supervisor' component={Supervisor} />
        <Stack.Screen name='ActivateJob' component={ActivateJob} />
        <Stack.Screen name='DeleteJobs' component={DeleteJobs} />
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
