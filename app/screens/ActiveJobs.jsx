import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import SearchComponent from "../components/SearchComponent";
import JobDetails from "../components/JobDetails";
import LowerButton from "../components/LowerButton";
import { setFilter } from "../store/slice-reducers/Formslice";
import { useDispatch, useSelector } from "react-redux";
export default function ActiveJobs({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const { isWeekend, isAllowedTime } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(setFilter("Job"));
  }, []);

  return (
    <Background bgColor='min-h-[98vh]'>
      <Topscreen text={"ActiveJobs"} />
      <View
        className='bg-slate-200 h-[85vh] rounded-t-3xl  p-2 w-full absolute bottom-0
      '
      >
        <View className='mb-1'>
          <SearchComponent
            filterItems={["Job", "Dept", "Supervisor", "Status"]}
          />
        </View>
        <View>
          <JobDetails />
        </View>
      </View>
      {user.role !== "Client" && (
        <LowerButton
          disabled={isWeekend || !isAllowedTime ? true : false}
          navigate={() => {
            navigation.navigate("ActivateJob");
          }}
          text={
            isWeekend || !isAllowedTime ? "Outside working hours" : "Activate"
          }
        />
      )}
    </Background>
  );
}
