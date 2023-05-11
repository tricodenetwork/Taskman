import React from "react";
import { View, StyleSheet } from "react-native";
import Background from "../components/Background";
import ProfileCard from "../components/ProfileCard";
import OptionsCard from "../components/OptionsCard";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import LowerButton from '../components/LowerButton'
import Topscreen from "../components/Topscreen";

const Profile = ({ navigation }) => {
  return (
    <Background>
      <Topscreen
        onPress={() => {
          navigation.goBack();
        }}
        text={"Profile"}
      />

      <ProfileCard />
      <OptionsCard
        text={"Security Details"}
        icon={
          <MaterialIcons
            style={{ backgroundColor: "gray", padding: 3, borderRadius: 5 }}
            name='lock-outline'
            size={30}
            color='black'
          />
        }
      />
      <OptionsCard
        text={"Edit Profile"}
        icon={
          <AntDesign
            name='user'
            style={{ backgroundColor: "gray", padding: 3, borderRadius: 5 }}
            size={30}
            color='black'
          />
        }
      />
      <LowerButton text={"Log out"} />
    </Background>
  );
};

const styles = StyleSheet.create({});

export default Profile;


