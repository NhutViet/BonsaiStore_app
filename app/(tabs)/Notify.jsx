import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AxiosInstance from "@/helper/AxiosInstance";
import { FlashList } from "@shopify/flash-list";
import RenderNotification from "../../components/RenderNotification";
import { Colors, fontWeight } from "../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../components/redux-help/slices/notificationSlice";

const Notify = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading, isSuccess, isError, errorMessage } =
    useSelector((state) => state.notification);
  useEffect(() => {
    // Gọi API để lấy thông báo khi component mount
    dispatch(fetchNotifications());
  }, [dispatch]);
  return (
    <SafeAreaView style={styles.container}>
      <Header name={"left"} title={"Thông báo"} />
      <View style={styles.content}>
        {notifications.length === 0 ? (
          <Text style={styles.NotificationEmty}>Không có thông báo</Text>
        ) : (
          <View style={{ flex: 1, marginTop: 30 }}>
            <FlashList
              data={notifications}
              renderItem={({ item }) => (
                <RenderNotification
                  title={item.title}
                  message={item.message}
                  total={item.total}
                  createdAt={item.createdAt}
                />
              )}
              estimatedItemSize={200}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    marginLeft: 30,
    marginRight: 30,
    flex: 1,
    marginTop: 10,
  },
  NotificationEmty: {
    width: "100%",
    textAlign: "center",
    fontSize: 16,
    color: Colors.gray,
    fontWeight: fontWeight.m500,
  },
});
