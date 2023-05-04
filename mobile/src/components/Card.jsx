import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Rating, AirbnbRating } from "react-native-ratings";
import { styles } from "../styles/stylesheet";
import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_600SemiBold,
  Montserrat_500Medium,
  Montserrat_300Light,
  Montserrat_100Thin,
} from "@expo-google-fonts/montserrat";
import { Ionicons } from "@expo/vector-icons";

const Card = () => {
  const [rating, setRating] = useState(0);

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_600SemiBold,
    Montserrat_500Medium,
    Montserrat_300Light,
    Montserrat_100Thin,
  });

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
  };
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <TouchableOpacity className='my-2 border-2 flex flex-row justify-between p-3 border-amber-950 rounded-xl w-[90%]'>
        <View className='flex space-y-5 items-start'>
          <Image
            style={styled.profile_pic}
            source={require("../../assets/images/cover.png")}
          />
          {/* <Rating
            imageSize={17}
            tintColor='#F3F4F6'
            ratingColor='black'
            readonly
            showRating
            fractions={0}
            onFinishRating={handleRating}
          /> */}
          <AirbnbRating size={15} reviewSize={15} />
        </View>
        <View className='space-y-3 justify-center items-end'>
          <Text style={styles.text_md} className='text-lg'>
            Francis Adams
          </Text>
          <Text style={styles.text_sm} className='text-[13px] font-semibold'>
            Benz Mechanic
          </Text>
          <View className='flex flex-row relative right-2 space-x-2'>
            <TouchableOpacity className='bg-cyan-900 rounded-xl px-3 py-1'>
              <Ionicons name='call-outline' size={15} color='white' />
            </TouchableOpacity>
            <TouchableOpacity className='bg-cyan-900 rounded-xl px-3 py-1'>
              <Ionicons name='ios-chatbubble-outline' size={15} color='white' />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

export default Card;

const styled = StyleSheet.create({
  profile_pic: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
});
