import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import AxiosInstance from "@/helper/AxiosInstance";
import { Link, Redirect, router, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StylesLogin } from "../components/StylesApp/StyleApp";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  loginWithGoogle,
} from "../components/redux-help/slices/AuthSlice";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const Index = () => {
  const { user, token, isLoading, isSuccess, isError, errorMessage } =
    useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailUser, setEmailUser] = useState("");
  const [passwordUser, setPasswordUser] = useState("");

  // Cấu hình Google Sign-In với expo-auth-session
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "141046510402-4hnpiguf0fim3t4aaubrpsk7vqn1h594.apps.googleusercontent.com",
    iosClientId:
      "141046510402-36fnm4466atl2s17k6g5gl2krjrin34f.apps.googleusercontent.com",
    androidClientId:
      "141046510402-e0kthbit58nesdidvniu3opr0j9h75to.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  // Kiểm tra token khi ứng dụng khởi động
  useEffect(() => {
    const checkUser = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken && user) {
        router.push("/(tabs)/Home");
      }
    };
    checkUser();
  }, [user]);

  // Xử lý đăng nhập Google
  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();
      console.log("Google Login Result:", result);
    } catch (error) {
      console.error("Google Sign-In Error in handleGoogleLogin:", error);
      Alert.alert("Thông báo", "Đăng nhập bằng Google thất bại!");
    }
  };

  // Xử lý phản hồi từ Google Sign-In
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      const idToken = authentication.idToken;
      console.log("Google ID Token:", idToken);

      if (!idToken) {
        console.error("Không lấy được idToken từ Google!");
        Alert.alert("Thông báo", "Không lấy được idToken từ Google!");
        return;
      }

      // Gửi idToken đến Redux để xử lý
      dispatch(loginWithGoogle({ googleAccessToken: idToken }));
    } else if (response?.type === "error") {
      console.error("Google Sign-In Error in useEffect:", response);
      Alert.alert("Thông báo", "Đăng nhập bằng Google thất bại!");
    } else if (response?.type) {
      console.log("Google Sign-In Response:", response);
    }
  }, [response]);

  // Đăng nhập thông thường
  const handleLogin = () => {
    if (!emailUser || !passwordUser) {
      Alert.alert("Thông báo", "Vui lòng nhập email và mật khẩu!");
      return;
    }
    console.log("Dữ liệu gửi đi:", {
      email: emailUser,
      password: passwordUser,
    });
    dispatch(loginUser({ email: emailUser, password: passwordUser }));
  };
  // Xử lý trạng thái đăng nhập từ Redux
  useEffect(() => {
    console.log("Login 78: Kiểm tra Redux state:", {
      user,
      isSuccess,
      isError,
      errorMessage,
    });

    if (isSuccess && user && token) {
      router.push("/(tabs)/Home");
      Alert.alert("Thông báo", "Đăng nhập thành công");
    }

    if (isError) {
      console.log("Lỗi đăng nhập:", errorMessage);
      Alert.alert("Thông báo", errorMessage || "Đăng nhập thất bại!");
    }
  }, [isSuccess, isError, user, token]);
  return (
    <View style={StylesLogin.container}>
      <Image
        style={StylesLogin.imgLogin}
        source={require("@/assets/images/imgLogin.png")}
      />
      <Text style={StylesLogin.titleWelcome}>Chào mừng bạn</Text>
      <Text style={StylesLogin.titleLogin}>Đăng nhập tài khoản</Text>
      <View style={StylesLogin.viewLogin}>
        <View style={StylesLogin.inputText}>
          <TextInput
            style={StylesLogin.textInput}
            placeholder="Nhập eamil hoặc số điện thoại"
            onChangeText={setEmailUser}
          />
        </View>
        <View style={StylesLogin.inputText}>
          <TextInput
            style={StylesLogin.textInput}
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

        <View style={StylesLogin.viewForgotPass}>
          <View style={StylesLogin.viewRememberAccount}>
            <Octicons name="verified" size={24} color="#949090" />
            <Text style={StylesLogin.rememberAccount}>Nhớ tài khoản</Text>
          </View>
          <Text>Forgot Password ?</Text>
        </View>
      </View>
      <TouchableOpacity style={StylesLogin.btnLogin} onPress={handleLogin}>
        <Text style={StylesLogin.txtLogin}>Đăng nhập</Text>
      </TouchableOpacity>

      <View style={StylesLogin.viewOr}>
        <View style={StylesLogin.line} />
        <Text style={StylesLogin.txtOr}>Hoặc</Text>
        <View style={StylesLogin.line} />
      </View>

      <View style={StylesLogin.viewLoginSocial}>
        <TouchableOpacity onPress={handleGoogleLogin}>
          <Image
            style={StylesLogin.imgSocial}
            source={require("@/assets/images/logos_gg.png")}
          />
        </TouchableOpacity>
        <Image
          style={StylesLogin.imgSocial}
          source={require("@/assets/images/logos_facebook.png")}
        />
      </View>

      <Text style={StylesLogin.txtNoAccount}>
        Bạn không có tài khoản{" "}
        <Link href={"/Register"}>
          <Text style={StylesLogin.txtRegister}>Tạo tài khoán</Text>
        </Link>
      </Text>
    </View>
  );
};

export default Index;
