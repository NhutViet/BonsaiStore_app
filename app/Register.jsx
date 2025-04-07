import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import AxiosInstance from "@/helper/AxiosInstance";
import { Link, router } from "expo-router";

const Register = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailUser, setEmailUser] = useState("");
  const [passwordUser, setPasswordUser] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const goBack = () => {
    router.replace("/");
  };

  const handleRegister = async () => {
    const avata = avata || "";
    try {
      const body = {
        fullName,
        email: emailUser,
        phoneNumber,
        password: passwordUser,
        avata: avata,
      };
      const response = await AxiosInstance().post("/users/register", body);

      if (response.status === "true") {
        Alert.alert("Thông báo", "Đăng ký thành công!");
        router.replace("/");
      } else {
        Alert.alert("Thông báo", response.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error.response || error.message);
      Alert.alert(
        "Thông báo",
        error.response.message || "Đăng ký không thành công. Vui lòng thử lại!"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.imgLogin}
        source={require("../assets/images/imgregister.png")}
      />
      <Text style={styles.titleWelcome}>Đăng ký</Text>
      <Text style={styles.titleLogin}>Tạo tài khoản</Text>
      <View style={styles.viewLogin}>
        <View style={styles.inputText}>
          <TextInput
            style={styles.textInput}
            placeholder="Họ tên"
            onChangeText={setFullName}
          />
        </View>
        <View style={styles.inputText}>
          <TextInput
            style={styles.textInput}
            placeholder="E-mail"
            onChangeText={setEmailUser}
          />
        </View>
        <View style={styles.inputText}>
          <TextInput
            style={styles.textInput}
            placeholder="Số điện thoại"
            onChangeText={setPhoneNumber}
          />
        </View>
        <View style={styles.inputText}>
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            onChangeText={setPasswordUser}
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
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={styles.txtTitle}>
            Để đăng ký tài khoản, bạn đồng ý{" "}
            <Text style={styles.txtTitleGreen}>Terms & Conditions</Text> and{" "}
            <Text style={styles.txtTitleGreen}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.btnLogin} onPress={handleRegister}>
        <Text style={styles.txtLogin}>Đăng ký</Text>
      </TouchableOpacity>

      <View style={styles.viewOr}>
        <View style={styles.line} />
        <Text style={styles.txtOr}>Hoặc</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.viewLoginSocial}>
        <Image
          style={styles.imgSocial}
          source={require("@/assets/images/logos_gg.png")}
        />
        <Image
          style={styles.imgSocial}
          source={require("@/assets/images/logos_facebook.png")}
        />
      </View>

      <Text style={styles.txtNoAccount}>
        Tôi đã có tài khoản
        <Pressable style={styles.txtRegister} onPress={goBack}>
          <Text style={styles.txtRegister}> Đăng nhập</Text>
        </Pressable>
      </Text>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  imgLogin: {
    width: "100%",
    height: 250,
  },
  titleWelcome: {
    fontWeight: "700",
    fontSize: 30,
    color: "#000",
  },
  titleLogin: {
    fontWeight: "400",
    fontSize: 18,
    color: "#000",
    marginTop: 10,
  },
  viewLogin: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
  },
  txtInput: {
    width: 300,
    height: 46,
    borderWidth: 1,
    borderColor: "#8b8b8b",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  inputText: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8B8B8B",
    borderRadius: 8,
    marginTop: 20,
    paddingHorizontal: 10,
    height: 50,
    width: "100%",
  },
  textInput: {
    flex: 1,
    color: "#000",
    height: 48,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  txtTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  txtTitleGreen: {
    color: "#009245",
    textDecorationLine: "underline",
  },
  btnLogin: {
    width: 350,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007537",
    borderRadius: 15,
  },
  txtLogin: {
    fontWeight: "700",
    fontSize: 20,
    color: "#fff",
  },
  viewOr: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    width: 130,
    height: 1,
    backgroundColor: "#8c8c8c",
  },
  txtOr: {
    fontWeight: "500",
    fontSize: 12,
    color: "#000",
    marginLeft: 10,
    marginRight: 10,
  },
  viewLoginSocial: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  imgSocial: {
    width: 32,
    height: 32,
    marginRight: 20,
    marginLeft: 20,
  },
  txtNoAccount: {
    fontWeight: "400",
    fontSize: 12,
    color: "#000",
    marginTop: 20,
  },
  txtRegister: {
    color: "#009245",
    fontSize: 12,
  },
});
