import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

const RenderItemPR = (props) => {
  const { _id, imagePR, namePR, traitPR, pricePR, quantity } = props;
  const router = useRouter();

  const handlePress = () => {
    // Điều hướng đến trang chi tiết sản phẩm và truyền ID
    router.push(`/details/${_id}`);
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image style={styles.imgPR} source={{ uri: imagePR }} />
      <Text style={styles.namePR} numberOfLines={1}>
        {namePR}
      </Text>

      <View style={styles.viewBottom}>
        <Text style={styles.traitPR}>{traitPR}</Text>
        <View style={styles.line} />
        <Text style={styles.quantity}>Số lượng:{quantity}</Text>
      </View>
      <Text style={styles.pricePR}>{pricePR.toLocaleString()} VNĐ</Text>
    </TouchableOpacity>
  );
};

export default RenderItemPR;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 200,
    margin: 10,
  },
  imgPR: {
    width: 155,
    height: 134,
    borderRadius: 5,
  },
  namePR: {
    fontSize: 16,
    color: "#221F1F",
    fontWeight: "500",
    marginTop: 5,
  },
  traitPR: {
    fontSize: 14,
    color: "#7D7B7B",
    fontWeight: "300",
  },
  line: {
    width: 1,
    height: 10,
    backgroundColor: Colors.border,
    marginRight: 5,
    marginLeft: 5,
  },
  pricePR: {
    fontSize: 16,
    color: "#007537",
    fontWeight: "300",
    marginTop: 5,
  },
  quantity: {
    fontSize: 13,
    color: "#7D7B7B",
    fontWeight: "300",
  },
  viewBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});
