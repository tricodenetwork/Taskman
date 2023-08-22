import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import Background from "../../components/Background";
import ProfileCard from "../../components/ProfileCard";
import OptionsCard from "../../components/OptionsCard";
import { MaterialIcons } from "@expo/vector-icons";
import LowerButton from "../../components/LowerButton";
import Topscreen from "../../components/Topscreen";
import { actuatedNormalize } from "../../styles/stylesheet";
import { useUser } from "@realm/react";
import { TouchableOpacity } from "react-native-gesture-handler";

const Profile = ({ navigation }) => {
  const user = useUser();
  const handleLogout = useCallback(() => {
    user?.logOut();
  }, [user]);

  return (
    <Background>
      <Topscreen text={"Profile"} />

      <ProfileCard />
      <View className='mt-[18vh]'>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("security");
          }}
          activeOpacity={0.5}
        >
          <OptionsCard
            text={"Change Password"}
            icon={
              <MaterialIcons
                style={{
                  backgroundColor: "rgba(186,90,49,.5)",
                  padding: actuatedNormalize(7),
                  borderRadius: 5,
                }}
                name='lock-outline'
                size={actuatedNormalize(25)}
                color='black'
              />
            }
          />
        </TouchableOpacity>
        {/* <OptionsCard
          text={"Edit Profile"}
          icon={
            <AntDesign
              name='user'
              style={{
                backgroundColor: "rgba(0,67,67,0.5)",
                padding: actuatedNormalize(7),
                borderRadius: 5,
              }}
              size={actuatedNormalize(25)}
              color='black'
            />
          }
        /> */}
      </View>
      <LowerButton
        style={"w-[90vw]"}
        navigate={handleLogout}
        text={"Log out"}
      />
    </Background>
  );
};

const styles = StyleSheet.create({});

export default Profile;