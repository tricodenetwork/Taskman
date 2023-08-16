import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import SearchComponent from "../components/SearchComponent";
import OdinaryButton from "../components/OdinaryButton";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { AccountRealmContext } from "../models";
import { activejob } from "../models/Task";
import { useDispatch, useSelector } from "react-redux";
import { resetMulti } from "../store/slice-reducers/App";
import HandlerDetails from "../components/HandlerDetails";
import { Text } from "react-native";
import { SCREEN_HEIGHT, styles } from "../styles/stylesheet";

const { useRealm, useQuery } = AccountRealmContext;

export default function MyTasks({ navigation }) {
  //--------------------------------------------------------------------------------------STATE AND VARIABLES
  const focus = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const [handlerTasks, setHandlerTasks] = useState([]);

  const ActiveJobs = useQuery(activejob);
  const { user } = useSelector((state) => state);

  const tasks = useMemo(() => {
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
      a.started.getTime() < b.started.getTime() ? 1 : -1
    );
  }, [focus]);

  useEffect(() => {
    const unsubscribeBlur = navigation.addListener("blur", () => {
      // Screen lost focus
      dispatch(resetMulti());

      setHandlerTasks([]);
    });

    setTimeout(() => {
      setHandlerTasks(tasks);
    }, 0);

    return () => {
      unsubscribeBlur();
    };
  }, [handlerTasks.length]);

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
          <SearchComponent filterItems={["MatNo", "Status", "Supervisor"]} />
        </View>
        <View>
          {handlerTasks.length == 0 ? (
            <View className='relative top-[5vh]'>
              <ActivityIndicator size={"large"} color={"rgb(88 28 135)"} />
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
