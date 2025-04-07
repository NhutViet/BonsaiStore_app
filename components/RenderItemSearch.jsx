import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { router } from "expo-router";

const RenderItemSearch = (props) => {
  const { _id, imagePR, namePR, pricePR, quantity } = props;
  const handlePress = () => {
    // Điều hướng đến trang chi tiết sản phẩm và truyền ID
    router.push(`/details/${_id}`);
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image style={styles.imagePR} source={{ uri: imagePR }} />
      <View style={{ width: 250 }}>
        <Text style={styles.txtTitle} numberOfLines={1}>
          {namePR}
        </Text>
        <Text style={styles.txtTitle} numberOfLines={1}>
          Giá: {pricePR.toLocaleString()} VNĐ
        </Text>
        <Text style={styles.txtTitle}>Số lượng: {quantity}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemSearch;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 20,
    flex: 1,
  },
  imagePR: {
    width: 77,
    height: 77,
    marginRight: 20,
  },
  txtTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000000",
    marginTop: 10,
  },
});
