import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Background from "../../components/Background";
import Topscreen from "../../components/Topscreen";
import SearchComponent from "../../components/SearchComponent";
import OdinaryButton from "../../components/OdinaryButton";
import { useIsFocused } from "@react-navigation/native";
import { AccountRealmContext } from "../../models";
import { activejob } from "../../models/Task";
import { useDispatch, useSelector } from "react-redux";
import HandlerDetails from "../../components/HandlerDetails";
import { Text } from "react-native";
import { SCREEN_HEIGHT, styles } from "../../styles/stylesheet";
import { global } from "../../models/Account";

const { useQuery } = AccountRealmContext;

export default function MyTasks({ navigation }) {
  //--------------------------------------------------------------------------------------STATE AND VARIABLES
  const focus = useIsFocused();
  const [handlerTasks, setHandlerTasks] = useState([]);
  const {updateCon} = useSelector(state=>state.app)
  const ActiveJobs = useQuery(activejob);
  const { user } = useSelector((state) => state);
  const updateCondition = useQuery(global)[0].mut
  const dispatch = useDispatch()

  useEffect(() => {
    setTimeout(() => {
    //    if (updateCondition == updateCon) {
    //   setUpdate(true);
    //   return;
    // }

      const tasks = () => {
        const myTasks = Array.from(ActiveJobs).map((job) => {
          const assigned =
            job?.tasks.filter((obj) => obj.handler === user.name) ?? [];
          assigned.forEach((obj) => {
            obj.id = job._id.toString();
            obj.job = job.job;
            obj.supervisor = job.supervisor;
            obj.matno = job.matno;
          });
          return assigned;
        });

        const merged = myTasks.reduce((acc, obj) => acc.concat(obj), []);
        return merged.sort((a, b) =>
          a.started?.getTime() < b.started?.getTime() ? 1 : -1
        );
      };
      setHandlerTasks(tasks);
    }, 0);
  }, [handlerTasks.length,updateCondition]);

  // //-------------------------------------------------------------EFFECTS AND FUNCTIONS
  // useEffect(() => {
  //   dispatch(resetMulti());
  // }, [focus]);
  //----------------------------------------------------RENDERED COMPONENT
  return (
    <Background bgColor='min-h-[98vh]'>
      <Topscreen text={"My Tasks"}></Topscreen>

      <View
        style={[styles.Pcard]}
        className='bg-slate-200 h-[84vh] rounded-t-3xl  p-2 w-full absolute bottom-0
      '
      >
        <OdinaryButton
          // bg={"#77E6B6"}
          color={"white"}
          navigate={() => {
            navigation.navigate("taskdetailsscreen");
          }}
          text='Assign Multiple Tasks'
          style={`absolute ${
            SCREEN_HEIGHT < 500 ? "-top-[6vh]" : "-top-[5vh]"
          } w-[55vw]`}
        />
        <View className='mb-2'>
          <SearchComponent
            initialFilter={"MatNo"}
            filterItems={["MatNo", "Status", "Supervisor"]}
          />
        </View>
        <View>
          {handlerTasks.length == 0 ? (
            <View className='relative bg-primary_light w-[35%] self-center flex items-center justify-between rounded- py-[2vh] top-[5vh]'>
              <ActivityIndicator size={"small"} color={"rgb(13 3 122)"} />
              <Text className='text-Blue relative top-2' style={styles.text_sm}>
                Loading...
              </Text>
            </View>
          ) : (
            // <Text>{tasks.length}</Text>
            <HandlerDetails
              taskdata={handlerTasks}
              update={setHandlerTasks}
              // jobId={route.params.id}
            />
          )}
        </View>
      </View>
    </Background>
  );
}
