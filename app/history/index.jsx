import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import AxiosInstance from "@/helper/AxiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import RenderHistory from "../../components/RenderHistory";
import { Colors } from "../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../../components/redux-help/slices/notificationSlice";

const History = () => {
  const dispatch = useDispatch();
  const { history, isLoading, isSuccess, isError, errorMessage } = useSelector(
    (state) => state.notification
  );
  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);
  return (
    <SafeAreaView style={styles.container}>
      <Header name="left" title="Lịch sử" />

      {history.length === 0 ? (
        <Text>Chưa có thông báo</Text>
      ) : (
        <View style={styles.viewFlastlist}>
          <FlashList
            data={history}
            renderItem={({ item }) => (
              <RenderHistory
                address={item.address}
                phoneNumber={item.phoneNumber}
                shippingMethod={item.shippingMethod}
                paymentMethod={item.paymentMethod}
                total={item.total}
                createdAt={item.createdAt}
                items={item.items}
              />
            )}
            estimatedItemSize={200}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.while,
  },
  viewFlastlist: {
    flex: 1,
    marginTop: 10,
  },
});
