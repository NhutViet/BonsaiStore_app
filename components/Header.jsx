import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";

const Header = (props) => {
  const { name, title, icon } = props;
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
      >
        <AntDesign name={name} size={24} color={"#000"} />
      </TouchableOpacity>
      <Text style={styles.txtSearch}>{title}</Text>
      <TouchableOpacity
        onPress={() => {
          router.push("/cart");
        }}
      >
        <AntDesign name={icon} size={24} color={"#000"} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 15,
    marginRight: 15,
  },
  txtSearch: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
});
