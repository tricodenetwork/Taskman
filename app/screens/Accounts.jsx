import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { styles } from "../styles/stylesheet";
import { FontAwesome5 } from "@expo/vector-icons";
import LowerButton from "../components/LowerButton";
import SearchComponent from "../components/SearchComponent";
import DetailsCard from "../components/DetailsCard";
import JobCategory from "../components/UserDetails";
import UserDetails from "../components/UserDetails";
// import { accounts } from "../api/Functions";

export default function Accounts({ navigation }) {
  const render = ({ item }) => (
    // <View className='h-[40%]'>
    //   <Text className=''>Soft things</Text>
    // </View>
    <DetailsCard Name={item.name} Dept={item.dept} Role={item.role} />
  );

  return (
    <Background>
      <Topscreen
        onPress={() => {
          navigation.goBack();
        }}
        text={"Accounts"}
      />
      <View
        className='bg-slate-200 h-[80vh] rounded-t-3xl  pt-[3vh] w-full absolute bottom-0
      '
      >
        <View className='mb-1'>
          <SearchComponent />
        </View>
        <View>
          <UserDetails
          // onPress={(item) => {
          //   navigation.navigate("CreateAccount", { item: item });
          // }}
          />
        </View>
      </View>
      <LowerButton
        navigate={() => {
          navigation.navigate("CreateAccount");
        }}
        text={"Add"}
      />
    </Background>
  );
}
