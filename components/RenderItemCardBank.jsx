import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors, fontWeight } from "../constants/Colors";
import { router } from "expo-router";
const RenderItemCardBank = (props) => {
  const {
    _id,
    fullName,
    bankName,
    branch,
    accountNumber,
    phoneNumber,
    idCardNumber,
  } = props;
  const handlePushId = () => {
    // Điều hướng đến trang chi tiết sản phẩm và truyền ID
    router.push(`/ManageBank/${_id}`);
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handlePushId}>
      <Image
        style={styles.imgWallet}
        source={require("../assets/images/wallet.png")}
      />
      <View>
        <Text style={styles.accountNumber}>{accountNumber}</Text>
        <Text style={styles.fullName}>{fullName}</Text>
        <Text style={styles.bankName}>{bankName}</Text>
      </View>
      <AntDesign name="right" size={24} color={Colors.gray} />
    </TouchableOpacity>
  );
};

export default RenderItemCardBank;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  imgWallet: {
    width: 50,
    height: 50,
  },
  accountNumber: {
    color: "#333",
    fontSize: 18,
    fontWeight: fontWeight.l500,
  },
  fullName: {
    color: Colors.border,
    fontSize: 15,
    fontWeight: fontWeight.m400,
    marginTop: 5,
    marginBottom: 5,
  },
  bankName: {
    color: Colors.border,
    fontSize: 15,
    fontWeight: fontWeight.m400,
  },
});
