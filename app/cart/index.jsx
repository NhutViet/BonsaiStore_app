import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import RenderItemCart from "../../components/RenderItemCart";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors, fontWeight } from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AxiosInstance from "../../helper/AxiosInstance";
import { router } from "expo-router";

const Cart = () => {
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const calculateTotal = (cartItems) => {
    let newTotal = cartItems.reduce(
      (sum, item) => sum + item.productId.pricePR * item.quantity,
      0
    );
    setTotal(newTotal);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          console.log("Không tìm thấy userId!");
          return;
        }
        const response = await AxiosInstance().get(`/cart/${userId}`);
        // console.log("Dữ liệu giỏ hàng:", response.items);
        if (!Array.isArray(response.items)) {
          console.error("Dữ liệu không phải mảng:", response.items);
          return;
        }
        setCart(response.items || []);
        calculateTotal(response.items || []);
      } catch (error) {
        console.log("Lỗi khi lấy giỏ hàng:", error);
      }
    };
    fetchCart();
  }, [refresh]);

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter((item) => item.productId._id !== productId);
    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleGoToPayment = async () => {
    try {
      await AsyncStorage.setItem("totalCart", total.toString());
      router.push("/payment");
    } catch (error) {
      console.log("Lỗi khi lưu total:", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header name="left" title="Giỏ hàng" />
      <View style={styles.viewFlatList}>
        {cart.length === 0 ? (
          <Text style={styles.cartEmty}>Giỏ hàng trống</Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <RenderItemCart
                id={item.productId._id}
                imagePR={item.productId.imagePR}
                namePR={item.productId.namePR}
                traitPR={item.productId.traitPR}
                pricePR={item.productId.pricePR}
                quantity={item.quantity}
                onRemove={handleRemoveItem}
              />
            )}
          />
        )}
      </View>

      <View style={styles.bottom}>
        <View style={styles.viewBottom}>
          <Text style={styles.txtTotal}>Tạm tính</Text>
          <Text style={styles.total}>{total.toLocaleString()} VNĐ</Text>
        </View>
        <TouchableOpacity style={styles.btnPayment} onPress={handleGoToPayment}>
          <Text style={styles.txtPayment}>Thanh toán</Text>
          <AntDesign name="right" size={16} color={Colors.while} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  viewFlatList: {
    marginTop: 20,
    flex: 1,
  },
  cartEmty: {
    width: "100%",
    textAlign: "center",
    fontSize: 16,
    color: Colors.gray,
    fontWeight: fontWeight.m500,
  },
  bottom: {
    marginLeft: 20,
    marginRight: 20,
  },
  viewBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txtTotal: {
    fontSize: 14,
    color: Colors.border,
    fontWeight: fontWeight.m400,
  },
  total: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: fontWeight.l500,
  },

  btnPayment: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.backgroundColor,
    height: 50,
    marginTop: 15,
    borderRadius: 8,
  },
  txtPayment: {
    fontSize: 18,
    fontWeight: fontWeight.l500,
    color: Colors.while,
  },
});

export default Cart;
