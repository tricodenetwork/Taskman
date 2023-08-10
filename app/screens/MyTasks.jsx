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
import { resetMulti, setHandler } from "../store/slice-reducers/App";
import HandlerDetails from "../components/HandlerDetails";
import TaskDetails from "../components/TaskDetails";
import { Text } from "react-native";
import { SCREEN_HEIGHT, styles } from "../styles/stylesheet";

const { useRealm, useQuery } = AccountRealmContext;

export default function MyTasks({ navigation }) {
  //--------------------------------------------------------------------------------------STATE AND VARIABLES
  const route = useRoute();
  const realm = useRealm();
  const focus = useIsFocused();
  const dispatch = useDispatch();
  const [update, setUpdate] = useState(false);

  const ActiveJobs = useQuery(activejob);
  const { user } = useSelector((state) => state);
  const { handler } = useSelector((state) => state.App);

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
    return merged.sort((a, b) => (a.id < b.id ? 1 : -1));
  }, [focus]);

  useEffect(() => {
    setTimeout(() => {
      // dispatch(setHandler(tasks));
      setUpdate(true);
    }, 0);
  }, []);

  //-------------------------------------------------------------EFFECTS AND FUNCTIONS
  useEffect(() => {
    dispatch(resetMulti());
  }, [focus]);
  //----------------------------------------------------RENDERED COMPONENT
  return (
    <Background bgColor='min-h-[98vh]'>
      <Topscreen text={"My Tasks"}>
        <OdinaryButton
          // bg={"#77E6B6"}
          color={"white"}
          navigate={() => {
            navigation.navigate("taskdetailsscreen");
          }}
          text='Assign Multiple Tasks'
          style={`absolute ${
            SCREEN_HEIGHT < 500 ? "top-[7vh]" : "top-[9vh]"
          } w-[55vw]`}
        />
      </Topscreen>

      <View
        style={[styles.Pcard]}
        className='bg-slate-200 h-[84vh] rounded-t-3xl  p-2 w-full absolute bottom-0
      '
      >
        <View className='mb-2'>
          <SearchComponent filterItems={["MatNo", "Status", "Supervisor"]} />
        </View>
        <View>
          {!update ? (
            <View className='relative top-[5vh]'>
              <ActivityIndicator size={"large"} color={"rgb(88 28 135)"} />
            </View>
          ) : (
            // <Text>{tasks.length}</Text>
            <HandlerDetails
              taskdata={tasks}
              // jobId={route.params.id}
            />
          )}
        </View>
      </View>
    </Background>
  );
}
