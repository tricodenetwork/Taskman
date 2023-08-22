import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFlipper } from "@react-navigation/devtools";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useUser } from "@realm/react";

import Profile from "../screens/general/Profile";
import Login from "../screens/general/Login";
import Accounts from "../screens/admin/Accounts";
import CreateAccount from "../screens/admin/CreateAccount";
import CreateJob from "../screens/admin/CreateJob";
import Jobs from "../screens/admin/Jobs";
import Tasks from "../screens/admin/Tasks";
import Taskman from "../screens/admin/Taskman";
import ActivateJob from "../screens/supervisor/ActivateJob";
import ActiveJobs from "../screens/supervisor/ActiveJobs";
import Handler from "../screens/handler/Handler";
import Supervisor from "../screens/supervisor/Supervisor";
import ActiveTasks from "../screens/supervisor/ActiveTasks";
import MyTasks from "../screens/handler/MyTasks";
import TaskDetailsPage from "../screens/handler/TaskDetailsPage";
import ChatScreen from "../screens/general/ChatScreen";
import MessageScreen from "../screens/general/MessageScreen";
import { setUser } from "../store/slice-reducers/userSlice";
import Stats from "../screens/supervisor/Stats";
import Security from "../screens/general/Security";
import ClientScreen from "../screens/client/ClientScreen";
import { AccountRealmContext } from "../models";
import IndividualTask from "../screens/supervisor/IndividualTask";
import Actions from "../screens/admin/Actions";
import DeleteJobs from "../screens/supervisor/DeleteJobs";
import DoneTaskScreen from "../screens/handler/DoneTaskScreen";
import RejectScreen from "../screens/handler/RejectScreen";

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
        {/* General */}
        <Stack.Screen name='profile' component={Profile} />
        <Stack.Screen name='login' component={Login} />
        <Stack.Screen name='security' component={Security} />
        <Stack.Screen name='chats' component={ChatScreen} />
        <Stack.Screen name='messages' component={MessageScreen} />

        {/* Admin */}
        <Stack.Screen name='taskman' component={Taskman} />
        <Stack.Screen name='accounts' component={Accounts} />
        <Stack.Screen name='jobs' component={Jobs} />
        <Stack.Screen name='tasks' component={Tasks} />
        <Stack.Screen name='CreateAccount' component={CreateAccount} />
        <Stack.Screen name='CreateJob' component={CreateJob} />
        <Stack.Screen name='actions' component={Actions} />

        {/* //Supervisor */}
        <Stack.Screen name='supervisor' component={Supervisor} />
        <Stack.Screen name='ActivateJob' component={ActivateJob} />
        <Stack.Screen name='it' component={IndividualTask} />
        <Stack.Screen name='DeleteJobs' component={DeleteJobs} />
        <Stack.Screen name='activeJobs' component={ActiveJobs} />
        <Stack.Screen name='activetasks' component={ActiveTasks} />
        <Stack.Screen name='stats' component={Stats} />
        {/* Handler */}
        <Stack.Screen name='handler' component={Handler} />
        <Stack.Screen name='mytasks' component={MyTasks} />
        <Stack.Screen name='taskdone' component={DoneTaskScreen} />
        <Stack.Screen name='reject' component={RejectScreen} />
        <Stack.Screen name='taskdetailsscreen' component={TaskDetailsPage} />

        {/* Client */}
        <Stack.Screen name='client' component={ClientScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
