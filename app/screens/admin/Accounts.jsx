import { ActivityIndicator, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Background from "../../components/Background";
import Topscreen from "../../components/Topscreen";
import LowerButton from "../../components/LowerButton";
import SearchComponent from "../../components/SearchComponent";
import UserDetails from "../../components/UserDetails";
import { styles } from "../../styles/stylesheet";

export default function Accounts({ navigation }) {
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setUpdate(true);
    }, 0);
  }, []);
  return (
    <Background bgColor='min-h-[98vh]'>
      <Topscreen text={"Accounts"} />
      <View
        className='bg-slate-200 h-[85vh] rounded-t-3xl  pt-[3vh] w-full absolute bottom-0
      '
      >
        <View className='mb-1'>
          <SearchComponent
            initialFilter={"Name"}
            filterItems={["Name", "Dept", "Role"]}
          />
        </View>
        <View>
          {!update ? (
            <View className='relative bg-primary_light w-[35%] self-center flex items-center justify-between rounded- py-[2vh] top-[5vh]'>
              <ActivityIndicator size={"small"} color={"rgb(13 3 122)"} />
              <Text className='text-Blue relative top-2' style={styles.text_sm}>
                Loading...
              </Text>
            </View>
          ) : (
            <UserDetails />
          )}
        </View>
      </View>
      <LowerButton
        style={"w-[90vw]"}
        navigate={() => {
          navigation.navigate("CreateAccount");
        }}
        text={"Add"}
      />
    </Background>
  );
}
