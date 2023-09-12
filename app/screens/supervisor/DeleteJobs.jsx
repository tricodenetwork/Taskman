import React, { useState, useCallback } from "react";

import { View, Text, ActivityIndicator } from "react-native";
import Background from "../../components/Background";
import Topscreen from "../../components/Topscreen";
import { styles } from "../../styles/stylesheet";
import LowerButton from "../../components/LowerButton";
import { AccountRealmContext } from "../../models";
import { activejob } from "../../models/Task";
import MultiSelect from "../../components/MultiSelect";

const { useRealm, useQuery } = AccountRealmContext;

const DeleteJobs = ({ navigation }) => {
  //--------------------------------------------------------------------------------------STATE AND VARIABLES

  const realm = useRealm();
  const activeJobs = useQuery(activejob);
  const [isLoading, setIsLoading] = useState(false);
  //-------------------------------------------------------------EFFECTS AND FUNCTIONS
  let multiplejobs = [];

  const addJobs = (param) => {
    const index = multiplejobs.indexOf(param);
    if (index !== -1) {
      multiplejobs.splice(index, 1);
    } else {
      multiplejobs.push(param);
    }
    console.log(multiplejobs);
  };

  const deleteActiveJob = useCallback(() => {
    realm.write(() => {
      if (multiplejobs.length != 0) {
        multiplejobs.forEach((params) => {
          const itemToDelete = activeJobs.filtered(`matno == $0`, params)[0];
          console.log(itemToDelete);
          realm.delete(itemToDelete);
        });
      } else {
        return;
      }
    });
  }, [realm, activeJobs]);

  //----------------------------------------------------RENDERED COMPONENT

  return (
    <Background bgColor='min-h-[98vh]'>
      <Topscreen text={"Delete Jobs"} />
      {isLoading ? (
        <View className='items-center justify-center h-[58vh] border-2'>
          <Text style={styles.text_md2}>Loading...</Text>
          <ActivityIndicator size={"large"} color={"#004343"} />
        </View>
      ) : (
        <View
          id='FULL_VIEW'
          className='bg-slate-200 h-[80vh] rounded-t-3xl justify-center  p-2 w-full absolute bottom-0'
        >
          <View className='flex items-center justify-between h-[55vh]'>
            <MultiSelect title={"Jobs:"} data={activeJobs} setData={addJobs} />
          </View>

          <LowerButton
            navigate={() => {
              //   setIsLoading(true);
              deleteActiveJob();

              navigation.navigate("activeJobs");
            }}
            text={"Delete"}
            style={"w-[90vw]"}
          />
        </View>
      )}
    </Background>
  );
};

export default DeleteJobs;
