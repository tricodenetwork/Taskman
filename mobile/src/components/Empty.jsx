import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Card from "./Card";
import { Motion } from "@legendapp/motion";

const Empty = () => {
  return (
    <Motion.View
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3 }}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Card />
      <Card />
      <Card />
      <Card />
    </Motion.View>
  );
};

export default Empty;

const styles = StyleSheet.create({});
