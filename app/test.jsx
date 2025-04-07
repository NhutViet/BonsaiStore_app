import React, { useEffect, useState } from "react";
import { View, Text, Button, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

// npm install expo-auth-session react-native-web

// Cho phép WebBrowser tự động đóng sau khi đăng nhập
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState(null);

  // Tạo request đăng nhập bằng Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    // expoClientId:
    //   "550765995121-df499mh3p5oe6avvsiphnb59ae8nj1cb.apps.googleusercontent.com", // Thay bằng Client ID trên Google Console
    iosClientId:
      "141046510402-36fnm4466atl2s17k6g5gl2krjrin34f.apps.googleusercontent.com",
    androidClientId: "",
    webClientId:
      "141046510402-4hnpiguf0fim3t4aaubrpsk7vqn1h594.apps.googleusercontent.com",
  });

  // Xử lý khi có phản hồi từ Google
  useEffect(() => {
    if (response?.type === "success") {
      fetchUserInfo(response.authentication.accessToken);
    }
  }, [response]);

  // Lấy thông tin người dùng từ Google API
  async function fetchUserInfo(token) {
    const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();
    console.log("User info:", user);
    setUserInfo(user);
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {userInfo ? (
        <View>
          <Image
            source={{ uri: userInfo.picture }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text>Welcome, {userInfo.name}!</Text>
          <Button title="Đăng xuất" onPress={() => setUserInfo(null)} />
        </View>
      ) : (
        <Button
          title="Đăng nhập bằng Google"
          disabled={!request}
          onPress={() => promptAsync()}
        />
      )}
    </View>
  );
}
