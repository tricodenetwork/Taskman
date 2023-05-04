import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { Marker } from "react-native-maps";
import { setLocale, setLat, setLong } from "../store/slice-reducers/Formslice";
import { useDispatch, useSelector } from "react-redux";

const Map = () => {
  const { location, long, lat } = useSelector((state) => state.form);
  const [mapRegion, setMapRegion] = useState({
    latitude: lat,
    longitude: long,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatch();

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let locations = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    // dispatch(setLocale(locations));
    // dispatch(setLong(locations.coords.longitude));
    // dispatch(setLat(locations.coords.latitude));
    setMapRegion({
      latitude: locations.coords.latitude,
      longitude: locations.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <MapView
      className='w-full h-full'
      showsUserLocation
      // showsScale
      region={mapRegion}
      // initialRegion={{
      //   latitude: long,
      //   longitude: lat,
      //   latitudeDelta: 0.0922,
      //   longitudeDelta: 0.0421,
      // }}
    >
      <Marker
        coordinate={mapRegion}
        title={"Branch"}
        description={"Tricode Head Office"}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({});

export default Map;
