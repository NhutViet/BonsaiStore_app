import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";

const TabIcon = ({ focused, name }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <Entypo name={name} size={24} color={focused ? "black" : "gray"} />
      {focused && <View style={styles.dot} />}
    </View>
  );
};

export default TabIcon;

const styles = StyleSheet.create({});
