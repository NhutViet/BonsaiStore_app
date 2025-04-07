import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalSearchParams } from "expo-router";
import AxiosInstance from "../../helper/AxiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, fontWeight } from "../../constants/Colors";
import { router } from "expo-router";
import Header from "../../components/Header";
import { StylesDetailBank } from "../../components/StylesApp/StyleApp";

const UpdateBank = () => {
  const params = useGlobalSearchParams();
  const id = params.id;
  console.log("ID CardBank PR  >>>>>>>>>", id);
  const [err, setErr] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bankName, setBankName] = useState("");
  const [branch, setBranch] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchDetailCardBank = async () => {
      try {
        const response = await AxiosInstance().get(`/manageBank/bankID/${id}`);
        console.log("detail card >>>>>>>", response.bank);

        if (response.status === true || response.status === "true") {
          setFullName(response.bank.fullName);
          setBankName(response.bank.bankName);
          setBranch(response.bank.branch || "");
          setAccountNumber(response.bank.accountNumber);
          setPhoneNumber(response.bank.phoneNumber || "");
          setIdCardNumber(response.bank.idCardNumber || "");
        } else {
          console.log("khong tim thay card");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetailCardBank();
  }, [id]);

  const handleUpdateCard = async () => {
    try {
      const body = {
        fullName,
        bankName,
        branch: branch || "",
        accountNumber,
        phoneNumber: phoneNumber || "",
        idCardNumber: idCardNumber || "",
      };
      const response = await AxiosInstance().put(
        `/manageBank/UpdateBank/${id}`,
        body
      );

      if (response.status === true) {
        Alert.alert("Thông báo", "Sửa tài khoản ngân hàng thành công");
        setIsEditable(false);
      } else {
        Alert.alert("Thông báo", "Sửa tài khoản ngân hàng thất bại");
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
    <SafeAreaView style={StylesDetailBank.container}>
      <Header name="left" title="Quản lý ngân hàng" />
      <View style={StylesDetailBank.content}>
        <View style={StylesDetailBank.viewInput}>
          <Text
            style={[
              StylesDetailBank.txtInput,
              err && StylesDetailBank.txtInputErr,
            ]}
          >
            ⁎ Tên tài khoản
          </Text>
          <TextInput
            style={StylesDetailBank.input}
            value={fullName}
            onChangeText={handleFullName}
            editable={isEditable}
            fontSize={18}
          />
        </View>

        <View style={StylesDetailBank.viewInput}>
          <Text
            style={[
              StylesDetailBank.txtInput,
              err && StylesDetailBank.txtInputErr,
            ]}
          >
            ⁎ Tên ngân hàng
          </Text>
          <TextInput
            style={StylesDetailBank.input}
            value={bankName}
            onChangeText={handleBankName}
            editable={isEditable}
            fontSize={18}
          />
        </View>

        <View style={StylesDetailBank.viewInput}>
          <Text style={StylesDetailBank.txtInput}>Chi nhánh</Text>
          <TextInput
            style={StylesDetailBank.input}
            value={branch}
            onChangeText={setBranch}
            editable={isEditable}
            fontSize={18}
          />
        </View>

        <View style={StylesDetailBank.viewInput}>
          <Text
            style={[
              StylesDetailBank.txtInput,
              err && StylesDetailBank.txtInputErr,
            ]}
          >
            ⁎ Số tài khoản
          </Text>
          <TextInput
            style={StylesDetailBank.input}
            value={accountNumber}
            onChangeText={handleAccountNumber}
            editable={isEditable}
            fontSize={18}
          />
        </View>
        <View style={StylesDetailBank.viewInput}>
          <Text style={StylesDetailBank.txtInput}>Số điện thoại</Text>
          <TextInput
            style={StylesDetailBank.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={isEditable}
            fontSize={18}
          />
        </View>
        <View style={StylesDetailBank.viewInput}>
          <Text style={StylesDetailBank.txtInput}>Số CCCD</Text>
          <TextInput
            style={StylesDetailBank.input}
            value={idCardNumber}
            onChangeText={setIdCardNumber}
            editable={isEditable}
            fontSize={18}
          />
        </View>
      </View>

      <View style={StylesDetailBank.bottom}>
        <TouchableOpacity
          style={StylesDetailBank.btnAddBank}
          onPress={() => setIsEditable(true)}
        >
          <Text style={StylesDetailBank.txtAddBank}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={StylesDetailBank.btnAddBank}
          onPress={handleUpdateCard}
        >
          <Text style={StylesDetailBank.txtAddBank}>Đồng ý</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UpdateBank;
