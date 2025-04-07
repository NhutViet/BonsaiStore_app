import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Colors, fontWeight } from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AxiosInstance from "@/helper/AxiosInstance";
import { router, useLocalSearchParams } from "expo-router";
import { StylesPayment } from "../../components/StylesApp/StyleApp";
import { FlashList } from "@shopify/flash-list";
import RenderCardBankPayment from "../../components/RenderCardBankPayment";
import AntDesign from "@expo/vector-icons/AntDesign";

const Payment = () => {
  const [fullName, setFullName] = useState("name");
  const [email, setEmail] = useState("email");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [err, setErr] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [totalCart, setTotalCart] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [cardBank, setCardBank] = useState([]);
  const [detaileCardBank, setDetailCardBank] = useState([]);
  // laay total cart
  useEffect(() => {
    const getTotalPrice = async () => {
      try {
        const storedTotal = await AsyncStorage.getItem("totalCart");
        if (storedTotal) {
          setTotalCart(parseFloat(storedTotal));
        }
      } catch (error) {
        console.log("Lỗi khi lấy total:", error);
      }
    };
    getTotalPrice();
  }, []);

  // lay thong tin user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;

        const response = await AxiosInstance().get(`/users/user/${userId}`);
        console.log(response);
        if (response.status === true || response.status === "true") {
          setFullName(response.data.fullName);
          setEmail(response.data.email);
        } else {
          Alert.alert("Lỗi", "Không lấy được thông tin người dùng");
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };

    fetchUser();
  }, []);

  // lấy danh sách card theo ID user
  useEffect(() => {
    const fetchCardBank = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          console.log("Không tìm thấy userId!");
          return;
        }
        const response = await AxiosInstance().get(
          `/manageBank/bank/${userId}`
        );
        setCardBank(response.banks);
      } catch (error) {}
    };
    fetchCardBank();
    return () => {};
  }, []);

  // onchangetext dia chi va phone
  const handleAddress = (text) => {
    setAddress(text);
    setErr(false); // Khi nhập, setErr thành true
  };
  const handlePhoneNumber = (text) => {
    setPhoneNumber(text);
    setErr(false); // Khi nhập, setErr thành true
  };

  // chon phuong thuc van chuyen
  const handleChoose = (method) => {
    let fee = 0;
    if (method === "Fast") {
      fee = 15000;
    } else if (method === "COD") {
      fee = 20000;
    }
    setSelectedMethod(method);
    setShipping(fee);
    setTotal(totalCart + fee);
  };
  //  chon phuong thu thanh toan
  const handleWallet = (type) => {
    setSelectedWallet(type);
    if (type === "ATM") {
      setModalVisible(true);
    }
  };

  // xử lý thanh toán
  const handleOrder = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        Alert.alert("Lỗi", "Không tìm thấy User ID!");
        return;
      }
      if (!phoneNumber || !address) {
        setErr(true);
      } else {
        setErr(false);
      }

      if (!selectedMethod) {
        Alert.alert("Lỗi", "Vui lòng chọn phương thức vận chuyển!");
        return;
      }

      if (!selectedWallet) {
        Alert.alert("Lỗi", "Vui lòng chọn hình thức thanh toán!");
        return;
      }

      const responseCart = await AxiosInstance().get(`/cart/${userId}`);
      const cartId = responseCart._id;
      const items = responseCart.items;

      if (!cartId || !items.length) {
        Alert.alert("Lỗi", "Không tìm thấy giỏ hàng hoặc giỏ hàng trống!");
        return;
      }

      const body = {
        userId,
        cartId,
        items,
        address,
        phoneNumber,
        shippingMethod: selectedMethod,
        paymentMethod: selectedWallet,
        total,
      };

      const response = await AxiosInstance().post("/order/checkout", body);

      if (response.status === true) {
        Alert.alert("Thông báo", "Đặt hàng thành công");
        router.push("/(tabs)/Home");
      } else {
        Alert.alert("Thông báo", "Đặt hàng thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <SafeAreaView style={StylesPayment.container}>
      <Header name="left" title="Thanh toán" />
      <View style={StylesPayment.content}>
        <Text style={StylesPayment.txtInforCustomer}>Thông tin khách hàng</Text>
        <View style={StylesPayment.line} />
        <TextInput
          style={StylesPayment.input}
          value={fullName}
          onChangeText={setFullName}
          editable={isEditable}
        />
        <View style={StylesPayment.line} />
        <TextInput
          style={StylesPayment.input}
          value={email}
          onChangeText={setEmail}
          editable={isEditable}
        />
        <View style={StylesPayment.line} />
        <TextInput
          style={StylesPayment.input}
          value={address}
          onChangeText={handleAddress}
          placeholder="Địa chỉ"
          placeholderTextColor={Colors.gray}
        />
        <View style={StylesPayment.line} />
        {err && <Text style={StylesPayment.err}>Vui lòng nhập Địa chỉ</Text>}
        <TextInput
          style={StylesPayment.input}
          value={phoneNumber}
          onChangeText={handlePhoneNumber}
          placeholder="Số Điện thoại"
          placeholderTextColor={Colors.gray}
        />
        <View style={StylesPayment.line} />
        {err && (
          <Text style={StylesPayment.err}>Vui lòng nhập Số điện thoại</Text>
        )}
        <Text style={StylesPayment.txtPaymentMethod}>
          Phương thức vận chuyển
        </Text>
        <TouchableOpacity
          style={StylesPayment.btnChoose}
          onPress={() => handleChoose("Fast")}
        >
          <View>
            <Text
              style={[
                StylesPayment.txtChoose,
                selectedMethod === "Fast" && StylesPayment.txtChose,
              ]}
            >
              Giao hàng Nhanh - 15.000VND
            </Text>
            <Text style={StylesPayment.txtChoosesChedule}>
              Dự kiến giao hàng 5-7/9
            </Text>
          </View>
          {selectedMethod === "Fast" && (
            <Image
              style={StylesPayment.imageTick}
              source={require("../../assets/images/tick.png")}
            />
          )}
        </TouchableOpacity>
        <View style={StylesPayment.line} />

        <TouchableOpacity
          style={StylesPayment.btnChoose}
          onPress={() => handleChoose("COD")}
        >
          <View>
            <Text
              style={[
                StylesPayment.txtChoose,
                selectedMethod === "COD" && StylesPayment.txtChose,
              ]}
            >
              Giao hàng COD - 20.000VNĐ
            </Text>
            <Text style={StylesPayment.txtChoosesChedule}>
              Dự kiến giao hàng 4-8/9
            </Text>
          </View>
          {selectedMethod === "COD" && (
            <Image
              style={StylesPayment.imageTick}
              source={require("../../assets/images/tick.png")}
            />
          )}
        </TouchableOpacity>
        <View style={StylesPayment.line} />

        <Text style={StylesPayment.txtPaymentMethod}>Hình thức thanh toán</Text>
        <TouchableOpacity
          style={StylesPayment.btnChoose}
          onPress={() => handleWallet("CASH")}
        >
          <Text
            style={[
              StylesPayment.txtChoose,
              selectedWallet === "CASH" && StylesPayment.txtChose,
            ]}
          >
            Tiền mặt
          </Text>
          {selectedWallet === "CASH" && (
            <Image
              style={StylesPayment.imageTick}
              source={require("../../assets/images/tick.png")}
            />
          )}
        </TouchableOpacity>
        <View style={StylesPayment.line} />
        <TouchableOpacity
          style={StylesPayment.btnChoose}
          onPress={() => handleWallet("ATM")}
        >
          <Text
            style={[
              StylesPayment.txtChoose,
              selectedWallet === "ATM" && StylesPayment.txtChose,
            ]}
          >
            Tiền tài khoản
          </Text>
          {selectedWallet === "ATM" && detaileCardBank && (
            <View>
              <Text style={StylesPayment.txtChoosesChedule} numberOfLines={1}>
                {detaileCardBank.bankName} - {detaileCardBank.accountNumber}
              </Text>
              <Text style={StylesPayment.txtChoosesChedule} numberOfLines={1}>
                {detaileCardBank.fullName}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={StylesPayment.line} />
      </View>
      <View style={StylesPayment.bottom}>
        <View style={StylesPayment.viewBottom}>
          <Text style={StylesPayment.txtChoosesChedule}>Tạm tính</Text>
          <Text>{totalCart.toLocaleString()} VNĐ</Text>
        </View>
        <View style={StylesPayment.viewBottom}>
          <Text style={StylesPayment.txtChoosesChedule}>Phí vận chuyển</Text>
          <Text>{shipping.toLocaleString()}VNĐ</Text>
        </View>
        <View style={StylesPayment.viewBottom}>
          <Text style={StylesPayment.txtChoosesChedule}>Tổng cộng</Text>
          <Text style={StylesPayment.total}>{total.toLocaleString()} VNĐ</Text>
        </View>
        <TouchableOpacity
          style={StylesPayment.btnPayment}
          onPress={handleOrder}
        >
          <Text style={StylesPayment.txtPayment}>Thanh Toán</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={StylesPayment.modalContainer}>
            <View style={StylesPayment.modalContent}>
              <View style={StylesPayment.viewModelHeader}>
                <TouchableOpacity>
                  <Text style={StylesPayment.txtModel}>Thẻ ngân hàng </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={StylesPayment.btnClose}
                  onPress={() => setModalVisible(false)}
                >
                  <AntDesign name="close" size={24} color="gray" />
                </TouchableOpacity>
              </View>

              <View style={StylesPayment.viewFlashListCardBank}>
                <FlashList
                  data={cardBank}
                  renderItem={({ item }) => (
                    <RenderCardBankPayment
                      _id={item._id}
                      fullName={item.fullName}
                      bankName={item.bankName}
                      branch={item.branch}
                      accountNumber={item.accountNumber}
                      phoneNumber={item.phoneNumber}
                      idCardNumber={item.idCardNumber}
                      onSelect={(card) => {
                        setDetailCardBank(card); // 👈 lưu lại thông tin thẻ đã chọn
                        setModalVisible(false); // 👈 đóng modal
                      }}
                    />
                  )}
                  estimatedItemSize={200}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Payment;
