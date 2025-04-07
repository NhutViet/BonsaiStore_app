import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Header from "../../components/Header";
import { Colors, fontWeight } from "../../constants/Colors";
import AxiosInstance from "../../helper/AxiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StylesAddBank } from "../../components/StylesApp/StyleApp";

const AddBank = () => {
  const [err, setErr] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bankName, setBankName] = useState("");
  const [branch, setBranch] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");

  const handleAddbank = async () => {
    try {
      if (!fullName.trim() || !bankName.trim() || !accountNumber.trim()) {
        setErr(true);
        return;
      }

      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.log("Không tìm thấy userId!");
        return;
      }
      const body = {
        userId: userId,
        fullName,
        bankName,
        branch: branch || "",
        accountNumber,
        phoneNumber: phoneNumber || "",
        idCardNumber: idCardNumber || "",
      };
      const response = await AxiosInstance().post("/manageBank/AddBank", body);

      if (response.status === true) {
        Alert.alert("Thông báo", "Thêm tài khoản ngân hàng thành công");
        router.push("/ManageBank");
      } else {
        Alert.alert("Thông báo", "Thêm tài khoản ngân hàng thất bại");
      }
    } catch (error) {
      console.log(
        "Lỗi khi thêm ngân hàng:",
        error.response?.data || error.message
      );
      Alert.alert("Lỗi", error.response?.data?.error || "Có lỗi xảy ra!");
    }
  };

  const handleFullName = (text) => {
    setFullName(text);
    setErr(false); // Khi nhập, setErr thành true
  };
  const handleBankName = (text) => {
    setBankName(text);
    setErr(false); // Khi nhập, setErr thành true
  };
  const handleAccountNumber = (text) => {
    setAccountNumber(text);
    setErr(false); // Khi nhập, setErr thành true
  };
  return (
    <SafeAreaView style={StylesAddBank.container}>
      <Header name="left" title="Quản lý ngân hàng" />
      <View style={StylesAddBank.content}>
        <View style={StylesAddBank.viewInput}>
          <Text
            style={[StylesAddBank.txtInput, err && StylesAddBank.txtInputErr]}
          >
            ⁎ Tên tài khoản
          </Text>
          <TextInput
            style={StylesAddBank.input}
            onChangeText={handleFullName}
            placeholder="Điền vào"
            fontSize={18}
          />
        </View>

        <View style={StylesAddBank.viewInput}>
          <Text
            style={[StylesAddBank.txtInput, err && StylesAddBank.txtInputErr]}
          >
            ⁎ Tên ngân hàng
          </Text>
          <TextInput
            style={StylesAddBank.input}
            onChangeText={handleBankName}
            placeholder="Điền vào"
            fontSize={18}
          />
        </View>

        <View style={StylesAddBank.viewInput}>
          <Text style={StylesAddBank.txtInput}>Chi nhánh</Text>
          <TextInput
            style={StylesAddBank.input}
            onChangeText={branch}
            placeholder="Điền vào"
            fontSize={18}
          />
        </View>

        <View style={StylesAddBank.viewInput}>
          <Text
            style={[StylesAddBank.txtInput, err && StylesAddBank.txtInputErr]}
          >
            ⁎ Số tài khoản
          </Text>
          <TextInput
            style={StylesAddBank.input}
            onChangeText={handleAccountNumber}
            placeholder="Điền vào"
            fontSize={18}
          />
        </View>
        <View style={StylesAddBank.viewInput}>
          <Text style={StylesAddBank.txtInput}>Số điện thoại</Text>
          <TextInput
            style={StylesAddBank.input}
            onChangeText={phoneNumber}
            placeholder="Điền vào"
            fontSize={18}
          />
        </View>
        <View style={StylesAddBank.viewInput}>
          <Text style={StylesAddBank.txtInput}>Số CCCD</Text>

          <TextInput
            style={StylesAddBank.input}
            onChangeText={idCardNumber}
            placeholder="Điền vào"
            fontSize={18}
          />
        </View>
      </View>

      <View style={StylesAddBank.bottom}>
        <TouchableOpacity
          style={StylesAddBank.btnAddBank}
          onPress={handleAddbank}
        >
          <Text style={StylesAddBank.txtAddBank}>Thêm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddBank;
