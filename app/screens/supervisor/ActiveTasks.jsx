import { ActivityIndicator, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Background from "../../components/Background";
import Topscreen from "../../components/Topscreen";
import SearchComponent from "../../components/SearchComponent";
import TaskDetails from "../../components/TaskDetails";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { AccountRealmContext } from "../../models";
import { useDispatch, useSelector } from "react-redux";
import { resetMulti } from "../../store/slice-reducers/App";
import { styles } from "../../styles/stylesheet";

const { useRealm, useQuery } = AccountRealmContext;

export default function ActiveTasks({ navigation }) {
  //--------------------------------------------------------------------------------------STATE AND VARIABLES
  const route = useRoute();
  const realm = useRealm();
  const dispatch = useDispatch();
  const focus = useIsFocused();
  const job = realm.objectForPrimaryKey(
    "activejob",
    Realm.BSON.ObjectId(route.params?.id)
  );
  const [update, setUpdate] = useState(false);
  const { user } = useSelector((state) => state);
  const foreignSupervisor = job?.supervisor !== user.name ?? true;

  //-------------------------------------------------------------EFFECTS AND FUNCTIONS

  useEffect(() => {
    dispatch(resetMulti());
  }, [focus]);
  useEffect(() => {
    setTimeout(() => {
      setUpdate(true);
    }, 0);
  }, [focus]);

  //----------------------------------------------------RENDERED COMPONENT
  return (
    <Background bgColor='min-h-screen'>
      <Topscreen
        Edit={() => {
          navigation.navigate("ActivateJob", {
            id: route.params.id,
          });
        }}
        text2={job ? job?.tasks.length : item.supervisor}
        text3={job?.job}
        text={job?.matno}
      />

      <View
        className='bg-slate-200 h-[84vh] rounded-t-3xl  p-2 w-full absolute bottom-0
      '
      >
        <View className='mb-1'>
          <SearchComponent initialFilter={"Status"} filterItems={["Status"]} />
        </View>
        <View>
          {!update ? (
            <View className='relative bg-primary_light w-[35%] self-center flex items-center justify-between rounded-sm py-[2vh] top-[5vh]'>
              <ActivityIndicator size={"small"} color={"rgb(13 3 122)"} />
              <Text className='text-Blue relative top-1' style={styles.text_sm}>
                Loading...
              </Text>
            </View>
          ) : (
            <TaskDetails
              foreignSupervisor={foreignSupervisor}
              taskdata={job.tasks}
              jobId={route.params.id}
              clientId={job?.matno}
            />
          )}
        </View>
      </View>
    </Background>
  );
}
