import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AxiosInstance from "@/helper/AxiosInstance";
import { Colors, fontWeight } from "../../constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { StylesEditinformation } from "../../components/StylesApp/StyleApp";

const EditInfomation = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avata, setAvata] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  // lay thong tin
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
          setPhoneNumber(response.data.phoneNumber);
          setAvata(response.data.avata);
          setPassword(response.data.password);
          setAddress(response.data.address);
        } else {
          Alert.alert("Lỗi", "Không lấy được thông tin người dùng");
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };

    fetchUser();
  }, []);

  const handleEditInformation = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;
      const body = {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        avata: avata,
        address: address,
      };
      const response = await AxiosInstance().put(
        `/users/update/${userId}`,
        body
      );

      if (response.status === true) {
        Alert.alert("Thông bao", "Sửa thông tin thành công");
        setIsEditable(false);
      } else {
        Alert.alert("Thông bao", "Sửa thông tin thất bại");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Hàm kiểm tra nếu có thay đổi
  const checkChanges = (newFullName, newEmail, newPassword, newPhoneNumber) => {
    if (
      newFullName !== fullName ||
      newEmail !== email ||
      newPassword !== password ||
      newPhoneNumber !== phoneNumber
    ) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  };

  return (
    <SafeAreaView style={StylesEditinformation.contianer}>
      <Header name="left" title="Chỉnh sửa thông tin" />
      <View style={StylesEditinformation.header}>
        <Image style={StylesEditinformation.avata} source={{ uri: avata }} />
        <Text style={StylesEditinformation.txtContent}>
          Thông tin sẽ được lưu cho lần mua kế tiếp.{"\n"} Bấm vào thông tin chi
          tiết để chỉnh sửa.
        </Text>
      </View>
      <View style={StylesEditinformation.viewInput}>
        <TextInput
          style={StylesEditinformation.input}
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            checkChanges(text, email, password, phoneNumber);
          }}
          editable={isEditable}
        />
        <View style={StylesEditinformation.line} />
        <TextInput
          style={StylesEditinformation.input}
          value={email}
          onChangeText={setEmail}
          editable={isEditable}
        />
        <View style={StylesEditinformation.line} />
        <View style={StylesEditinformation.inputPassWord}>
          <TextInput
            value={password}
            style={StylesEditinformation.input}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => {
              setIsPasswordVisible(!isPasswordVisible);
            }}
          >
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color="#828282"
            />
          </TouchableOpacity>
        </View>
        <View style={StylesEditinformation.line} />
        <TextInput
          style={StylesEditinformation.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Số điện thoại"
          editable={isEditable}
        />
        <View style={StylesEditinformation.line} />

        <TextInput
          style={StylesEditinformation.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Địa chỉ"
          editable={isEditable}
        />
        <View style={StylesEditinformation.line} />
      </View>
      <View style={StylesEditinformation.bottom}>
        <TouchableOpacity
          onPress={() => {
            setIsEditable(true);
          }}
          style={
            isEditable
              ? StylesEditinformation.btnAccept
              : StylesEditinformation.btnEdit
          }
        >
          <Text style={StylesEditinformation.txtEdit}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            StylesEditinformation.btnEdit,
            {
              backgroundColor: isButtonEnabled
                ? Colors.backgroundColor
                : Colors.gray,
            },
          ]}
          onPress={handleEditInformation}
        >
          <Text style={StylesEditinformation.txtEdit}>Đồng ý</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditInfomation;
