import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CheckBox } from "react-native-web";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useDispatch } from "react-redux";

import { Colors } from "../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AxiosInstance from "../helper/AxiosInstance";

const RenderItemCart = (props) => {
  const { id, imagePR, namePR, traitPR, pricePR, quantity, onRemove } = props;
  const [modalVisible, setModalVisible] = useState(false);

  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const handleIncrease = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.error("Không tìm thấy userId!");
        return;
      }

      await AxiosInstance().post(`/cart/add`, {
        userId,
        productId: id,
        quantity: 1, // Tăng số lượng lên 1
      });

      setCurrentQuantity((prev) => prev + 1); // Cập nhật số lượng trên UI ngay lập tức
    } catch (error) {
      console.error(
        "Lỗi khi tăng số lượng:",
        error.response?.data || error.message
      );
    }
  };

  const handleDecrease = async () => {
    if (currentQuantity > 1) {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          console.error("Không tìm thấy userId!");
          return;
        }

        await AxiosInstance().post(`/cart/update`, {
          userId,
          productId: id,
          quantity: currentQuantity - 1, // Giảm số lượng đi 1
        });

        setCurrentQuantity((prev) => prev - 1); // Cập nhật số lượng trên UI ngay lập tức
      } catch (error) {
        console.error(
          "Lỗi khi giảm số lượng:",
          error.response?.data || error.message
        );
      }
    }
  };

  const handleRemove = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.error("Không tìm thấy userId!");
        return;
      }

      await AxiosInstance().delete(`/cart/remove/${userId}/${id}`);

      if (onRemove) {
        onRemove(id); // Gọi hàm cập nhật giỏ hàng từ `Cart.js`
      }

      Alert.alert("Thông báo", "Xóa sản phẩm thành công!");
      setModalVisible(false);
    } catch (error) {
      console.error(
        "Lỗi khi xóa sản phẩm:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <TouchableOpacity>
      <View style={styles.Container}>
        <Image style={styles.image} source={{ uri: imagePR }} />
        <View style={{ width: 300 }}>
          <Text style={styles.namePR} numberOfLines={1}>
            {namePR}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={styles.pricePR}>{pricePR.toLocaleString()} VNĐ</Text>
            <View style={styles.line} />
            <Text style={styles.traitPR}>{traitPR}</Text>
          </View>

          <View style={styles.viewResutl}>
            <View style={styles.viewQuantityPR}>
              <TouchableOpacity onPress={handleDecrease}>
                <AntDesign name="minussquareo" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.txtQuantity}>{currentQuantity}</Text>
              <TouchableOpacity onPress={handleIncrease}>
                <AntDesign name="plussquareo" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.delete}>Xoá</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.titleHeaderModal}>
                Xác nhận xoá tất cả đơn hàng?
              </Text>
              <Text style={styles.titleConform}>
                Thao tác này sẽ không thể khôi phục.
              </Text>
              <TouchableOpacity style={styles.btnAccept} onPress={handleRemove}>
                <Text style={styles.txtAccept}>Đồng ý</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancel}>Huỷ bỏ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemCart;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: 77,
    height: 85,
    marginRight: 15,
  },
  line: {
    width: 1,
    height: 12,
    backgroundColor: Colors.border,
    marginLeft: 30,
    marginRight: 30,
  },
  namePR: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  pricePR: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007537",
  },
  traitPR: {
    fontSize: 14,
    fontWeight: "400",
    color: "#7D7B7B",
  },
  viewResutl: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewQuantityPR: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  txtQuantity: {
    marginLeft: 20,
    marginRight: 20,
    fontSize: 16,
    fontWeight: "400",
  },
  delete: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    textDecorationLine: "underline",

    marginRight: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    height: 203,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  titleHeaderModal: {
    fontSize: 16,
    fontWeight: "500",
    color: "#252A31",
  },
  titleConform: {
    fontSize: 14,
    fontWeight: "400",
    color: "#7D7B7B",
    marginTop: 15,
    marginBottom: 15,
  },
  btnAccept: {
    width: 295,
    height: 50,
    backgroundColor: "#007537",
    justifyContent: "center",
    alignItems: "center",
  },
  txtAccept: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  cancel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#221F1F",
    textDecorationLine: "underline",
    marginTop: 15,
    marginBottom: 15,
  },
});
