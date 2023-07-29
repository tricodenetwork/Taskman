import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import SearchComponent from "../components/SearchComponent";
import JobDetails from "../components/JobDetails";
import LowerButton from "../components/LowerButton";
import { setFilter, setSearch } from "../store/slice-reducers/Formslice";
import { useDispatch, useSelector } from "react-redux";
import { holiday } from "../models/Account";
import Realm from "realm";
import { AccountRealmContext } from "../models";
import { useIsFocused } from "@react-navigation/native";

const { useRealm, useQuery } = AccountRealmContext;
export default function ActiveJobs({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const realm = useRealm();
  const Focus = useIsFocused();

  useEffect(() => {
    dispatch(setFilter("MatNo"));
    dispatch(setSearch(""));
  }, [Focus]);

  return (
    <Background bgColor='min-h-[98vh]'>
      <Topscreen text={!user.clientId ? "ActiveJobs" : "MyJob"} />
      <View
        className='bg-slate-200 h-[85vh] rounded-t-3xl  p-2 w-full absolute bottom-0
      '
      >
        <View className='mb-1'>
          {!user.clientId ? (
            <SearchComponent
              filterItems={["Job Name", "Client ID", "Supervisor", "Status"]}
            />
          ) : null}
        </View>
        <View>
          <JobDetails />
        </View>
      </View>
      {user.role !== "Client" && (
        <LowerButton
          style={"w-[90vw]"}
          // disabled={
          //   isWeekend || isTodayHoliday || !isAllowedTime ? true : false
          // }
          navigate={() => {
            navigation.navigate("ActivateJob");
          }}
          text={
            // isTodayHoliday
            //   ? "Public Holiday"
            //   : isWeekend || !isAllowedTime
            //   ? "Outside working hours"
            //   :
            "Activate"
          }
          p
        />
      )}
    </Background>
  );
}
