import { View, Text } from "react-native";
import React from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import SearchComponent from "../components/SearchComponent";
import JobDetails from "../components/JobDetails";
import LowerButton from "../components/LowerButton";

export default function ActiveJobs({ navigation }) {
  return (
    <Background>
      <Topscreen
        onPress={() => {
          navigation.goBack();
        }}
        text={"ActiveJobs"}
      />
      <View
        className='bg-slate-200 h-[85vh] rounded-t-3xl  p-2 w-full absolute bottom-0
      '
      >
        <View className='mb-1'>
          <SearchComponent />
        </View>
        <View>
          <JobDetails

          />
        </View>
      </View>
      <LowerButton
        navigate={() => {
          navigation.navigate("ActivateJob");
        }}
        text={"ActivateJob"}
      />
    </Background>
  );
}
