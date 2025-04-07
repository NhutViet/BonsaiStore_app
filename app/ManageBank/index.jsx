import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, fontWeight } from "../../constants/Colors";
import { Link, router } from "expo-router";
import AddBank from "./AddBank";
import Header from "../../components/Header";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AxiosInstance from "../../helper/AxiosInstance";
import RenderItemCardBank from "../../components/RenderItemCardBank";
import { StylesManageBank } from "../../components/StylesApp/StyleApp";

const Managebank = () => {
  const [cardBank, setCardBank] = useState([]);

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
  return (
    <SafeAreaView style={StylesManageBank.container}>
      <Header name="left" title="Quản lý thẻ ngân hàng" />
      <View style={StylesManageBank.content}>
        <FlashList
          data={cardBank}
          renderItem={({ item }) => (
            <RenderItemCardBank
              _id={item._id}
              fullName={item.fullName}
              bankName={item.bankName}
              branch={item.branch}
              accountNumber={item.accountNumber}
              phoneNumber={item.phoneNumber}
              idCardNumber={item.idCardNumber}
            />
          )}
          estimatedItemSize={200}
        />
      </View>

      <View style={StylesManageBank.bottom}>
        <TouchableOpacity
          style={StylesManageBank.btnAddBank}
          onPress={() => router.push("ManageBank/AddBank")}
        >
          <Text style={StylesManageBank.txtAddBank}>Thêm ngân hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Managebank;
