import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import TabIcon from "../../components/TabIcon";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="home" />
          ),
        }}
      />

      <Tabs.Screen
        name="Search"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="magnifying-glass" />
          ),
        }}
      />

      <Tabs.Screen
        name="Notify"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="bell" />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="user" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#000",
    marginTop: 4,
  },
});
