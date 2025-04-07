import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import AxiosInstance from "@/helper/AxiosInstance";
import RenderItemPR from "@/components/RenderItemPR";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { StylesHome } from "../../components/StylesApp/StyleApp";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductPlant,
  getproductUtensils,
  getproductPot,
} from "../../components/redux-help/slices/ProductSlice";

const Home = () => {
  const {
    productsPlant,
    productsUtensils,
    productsPot,
    token,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [showPlant, setShowPlant] = useState(false);
  const [showUtensils, setShowUtensils] = useState(false);
  const [showPot, setShowPot] = useState(false);

  const handleShowPlant = () => {
    setShowPlant(!showPlant);
  };

  const handleShowUtensils = () => {
    setShowUtensils(!showUtensils);
  };

  const handleShowPot = () => {
    setShowPot(!showPot);
  };

  // đổ dữ liệu với type plant(cây)
  useEffect(() => {
    dispatch(getProductPlant());
  }, [dispatch]);

  // đổ dữ liệu với type utensils(dụng cụ)
  useEffect(() => {
    dispatch(getproductUtensils());
  }, [dispatch]);

  // đổ dữ liệu với type pot(chậu hoa)
  useEffect(() => {
    dispatch(getproductPot());
  }, [dispatch]);

  const renderProductList = (data, showMore, handleShowMore, title) => (
    <View>
      <Text style={StylesHome.txtContentHeader}>{title}</Text>
      <View style={{ flex: 1 }}>
        <FlashList
          data={showMore ? data : data.slice(0, 4)}
          renderItem={({ item }) => (
            <RenderItemPR
              _id={item._id}
              imagePR={item.imagePR}
              namePR={item.namePR}
              traitPR={item.traitPR}
              pricePR={item.pricePR}
              quantity={item.quantity}
            />
          )}
          numColumns={2}
          estimatedItemSize={200}
        />
      </View>
      <TouchableOpacity onPress={handleShowMore} style={StylesHome.btnSeeMore}>
        <Text style={StylesHome.txtSeeMore}>
          {showMore ? "Thu gọn" : `Xem thêm ${title}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <ScrollView style={StylesHome.container}>
      <View style={StylesHome.header}>
        <View style={StylesHome.titleHeader}>
          <Text style={StylesHome.txtTitleHeader}>
            Planta - toả sáng {"\n"}không gian nhà bạn
          </Text>
          <TouchableOpacity onPress={() => router.push("/cart")}>
            <Image
              style={StylesHome.imgTitleHeader}
              source={require("@/assets/images/cart.png")}
            />
          </TouchableOpacity>
        </View>

        <Image
          style={StylesHome.headerImg}
          source={require("@/assets/images/img_Home.png")}
          resizeMode="contain"
        />
        <Pressable
          style={StylesHome.btnImgHeader}
          onPress={() => {
            router.push("/category");
          }}
        >
          <Text style={StylesHome.txtBtnHeader}>Xem hàng mới về</Text>
          <AntDesign name="arrowright" size={20} color="#007537" />
        </Pressable>
      </View>

      <View style={StylesHome.content}>
        {renderProductList(
          productsPlant,
          showPlant,
          handleShowPlant,
          "Cây trồng"
        )}
        {renderProductList(
          productsUtensils,
          showUtensils,
          handleShowUtensils,
          "Dụng cụ"
        )}
        {renderProductList(
          productsPot,
          showPot,
          handleShowPot,
          "Chậu cây trồng"
        )}
      </View>
    </ScrollView>
  );
};

export default Home;
