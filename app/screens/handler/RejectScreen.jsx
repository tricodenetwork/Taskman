import React, { useCallback, useState } from "react";
import { View } from "react-native";
import OdinaryButton from "../../components/OdinaryButton";
import { Motion } from "@legendapp/motion";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../../styles/stylesheet";
import { useRoute } from "@react-navigation/native";
import {
  setCurrentTask,
  setHandler,
} from "../../store/slice-reducers/ActiveJob";
import { useDispatch, useSelector } from "react-redux";
import { millisecondSinceStartDate } from "../../api/test";
import { sendPushNotification } from "../../api/Functions";
import { chats } from "../../models/Chat";
import useRealmData from "../../hooks/useRealmData";
import { AccountRealmContext } from "../../models";
import Background from "../../components/Background";
import { Text } from "react-native";
import SelectComponent from "../../components/SelectComponent";
import { TextInput } from "react-native";
import useActions from "../../hooks/useActions";
const { useRealm } = AccountRealmContext;

const RejectScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const realm = useRealm();

  const dispatch = useDispatch();
  const { currenttask, handler } = useSelector((state) => state.ActiveJob);
  const { multipleJobs } = useSelector((state) => state.App);
  const { user } = useSelector((state) => state);

  const route = useRoute();
  const { activeJob, Accounts, ActiveJobs, handlers, pushToken } = useRealmData(
    route.params
  );
  const update = route.params?.update;
  console.log(activeJob);

  // Create a chat room
  const { createChatRoom } = useActions();

  const handleErrorSubmit = useCallback(() => {
    // Perform the necessary actions to send the task back to the previous handler
    // and send the error message to the supervisor
    // based on the values of nextTask and nextHandler

    if (user.role !== "Handler") {
      alert("Unauthorized Handler!! ❌.");
    }

    if (!handler) {
      alert("No handler selected!! ❌.");
      return;
    }
    if (!currenttask) {
      alert("No Completed task ❌.");
      return;
    }

    //select handler Id to send error

    receiverId = Accounts.filtered(
      `role == "Handler" AND name == $0`,
      handler
    )[0]?._id;
    const roomId = createChatRoom(receiverId?.toHexString());

    const onSend = () => {
      const messageObject = {
        _id: new Realm.BSON.ObjectId().toHexString(),
        text: errorMessage,
        createdAt: new Date(),
        user: { _id: user._id, name: user.name },
        roomId: roomId,
      };

      realm.write(() => {
        return new chats(realm, messageObject);
      });
    };
    errorMessage != "null" ? onSend() : null;

    realm.write(() => {
      try {
        let Error;
        activeJob?.tasks.map((task) => {
          // set your recieved task to pending and not the time you've spent on the route.params?.job
          if (
            task.name == route.params?.name &&
            task.handler == route.params?.handler
          ) {
            task.handler = "";
            Error = millisecondSinceStartDate(task.inProgress);
            task.status = "Pending";
            task.inProgress = null;
          }
        });

        activeJob?.tasks.map((task) => {
          if (task.name == currenttask) {
            task.status = "Pending";
            task.inProgress = null;
            task.handler = handler;
            task.error = Error;
          }
        });

        alert("Task rejected! 🚫");
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });
    dispatch(setCurrentTask(""));
    dispatch(setHandler(""));
    sendPushNotification(pushToken, "Error in Task");
    update([]);
    navigation.navigate("mytasks");
  }, [
    realm,
    currenttask,
    multipleJobs,
    ActiveJobs,
    route.params?.handler,
    handler,
    route.params?.name,
  ]);
  return (
    <Background>
      <View className=' h-[80%]  pt-[5vh] flex min-h-[40vh] self-center justify-between items-center'>
        <Text
          className='self-center  text-center w-[50vw]'
          style={[
            styles.text_sm2,
            {
              fontSize: actuatedNormalize(20),
              lineHeight: actuatedNormalizeVertical(28),
            },
          ]}
        >
          Report Error
        </Text>

        <View className='h-[70vh]  flex justify-between'>
          <View className='h-[40vh] self-start px-[5vw] flex justify-between'>
            <SelectComponent
              title={"Task"}
              placeholder={"Choose faulty task"}
              data={activeJob?.tasks.filter((obj) => obj.status == "Completed")}
              setData={(params) => {
                dispatch(setCurrentTask(params));
              }}
            />
            <SelectComponent
              title={"Handler"}
              placeholder={"Send to Handler"}
              data={handlers}
              setData={(params) => {
                dispatch(setHandler(params));
              }}
            />
          </View>
          <TextInput
            style={[styles.averageText]}
            multiline={true}
            placeholder='Error Message to Handler'
            // value={errorMessage}
            className='w-[70vw] h-[10vh] border-2 border-gray-400 self-center rounded-md p-2'
            onChangeText={(text) => setErrorMessage(text)}
          />
          {visible ? (
            <View
              className='bg-primary_light rounded-2xl self-center absolute top-[12vh] justify-center w-[90%] h-[55%]'
              // activeOpacity={1}
            >
              <Motion.View
                initial={{ x: -500 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className='justify-center h-full  w-full  flex self-center'
              >
                <Text style={styles.text_sm} className='text-center mb-2'>
                  Press Ok to confirm
                </Text>
                <OdinaryButton
                  style={"rounded-sm mt-4 bg-primary"}
                  navigate={() => {
                    handleErrorSubmit();
                    setVisible(!visible);
                  }}
                  text={"OK"}
                />
              </Motion.View>
            </View>
          ) : null}
          <View
            id='BUTTONS'
            className='flex justify-between align-bottom w-[50vw]  self-center flex-row'
          >
            <OdinaryButton
              text='Submit'
              bg={"#8AD0AB"}
              navigate={() => setVisible(!visible)}
            />
            <OdinaryButton
              text='Cancel'
              bg={"#ff4747"}
              navigate={() => {
                navigation.goBack();
              }}
            />
          </View>
        </View>
      </View>
    </Background>
  );
};

export default RejectScreen;
