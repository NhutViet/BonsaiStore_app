// components/RenderHistory.js
import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { Colors } from "../constants/Colors";
import { FlashList } from "@shopify/flash-list";

const RenderHistory = ({
  address,
  phoneNumber,
  shippingMethod,
  paymentMethod,
  total,
  createdAt,
  items,
}) => {
  // Render từng sản phẩm trong items
  const renderProduct = ({ item }) => (
    <View style={styles.productContainer}>
      <Image
        source={{
          uri: item.productId.imagePR,
        }}
        style={styles.productImage}
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.productId.namePR}
        </Text>
        <Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
        <Text style={styles.productPrice}>
          Giá: {(item.productId.pricePR * item.quantity).toLocaleString()} VND
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đơn hàng</Text>
      <Text style={styles.detail}>
        Ngày đặt: {new Date(createdAt).toLocaleString()}
      </Text>
      <Text style={styles.detail}>Địa chỉ: {address}</Text>
      <Text style={styles.detail}>Số điện thoại: {phoneNumber}</Text>
      <Text style={styles.detail}>
        Phương thức vận chuyển:{" "}
        <Text style={styles.txtPrimary}>{shippingMethod}</Text>
      </Text>
      <Text style={styles.detail}>
        Phương thức thanh toán:{" "}
        <Text style={styles.txtPrimary}>{paymentMethod}</Text>
      </Text>
      <Text style={styles.detail}>
        Tổng tiền:{" "}
        <Text style={styles.txtPrimary}>{total.toLocaleString()} VND</Text>
      </Text>
      {items && items.length > 0 ? (
        <>
          <Text style={styles.productTitle}>Sản phẩm:</Text>
          <View style={{ flex: 1 }}>
            <FlashList
              data={items}
              renderItem={renderProduct}
              keyExtractor={(item) => item._id}
              estimatedItemSize={200}
            />
          </View>
        </>
      ) : (
        <Text style={styles.noItemsText}>
          Không có sản phẩm trong đơn hàng này!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 5,
    backgroundColor: Colors.while,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detail: {
    fontSize: 15,
    color: Colors.black,
    marginBottom: 5,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  productList: {
    marginTop: 5,
  },
  productContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  productDetails: {
    marginLeft: 10,
    flex: 1,
    width: "100%",
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    width: "100%",
  },
  txtPrimary: {
    color: Colors.backgroundColor,
    fontWeight: "bold",
  },
  productQuantity: {
    fontSize: 12,
    color: Colors.gray,
  },
  productPrice: {
    fontSize: 12,
    color: Colors.black,
  },
  noItemsText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 10,
    textAlign: "center",
  },
});

export default RenderHistory;
