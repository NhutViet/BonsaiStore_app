import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors, fontWeight } from "../constants/Colors";

const RenderNotification = (props) => {
  const { title, createdAt, message, total } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.message}>
        Tổng tiền: {total.toLocaleString()} VNĐ
      </Text>
      <Text style={styles.createdAt}>
        {new Date(createdAt).toLocaleString()}
      </Text>
    </View>
  );
};

export default RenderNotification;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 15,
    borderRadius: 8,
  },
  title: {
    color: Colors.backgroundColor,
    fontSize: 16,
    fontWeight: fontWeight.l500,
  },
  message: {
    color: Colors.gray,
    fontSize: 14,
    fontWeight: fontWeight.m400,
  },
});
