import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import AxiosInstance from "@/helper/AxiosInstance";
import { ScrollView } from "react-native";
import { FlashList } from "@shopify/flash-list";
import RenderItemPR from "@/components/RenderItemPR";
import { StylesCategory } from "../../components/StylesApp/StyleApp";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  getProductByCategory,
} from "../../components/redux-help/slices/ProductSlice";

const CategoryProduct = () => {
  const {
    categories,
    productsByCategory,
    token,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [selectID, setSelectID] = useState("67d310d437f14339142107b0");
  const [product, setProduct] = useState([]);

  // lấy danh sách categories
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Lấy danh sách sản phẩm theo danh mục
  useEffect(() => {
    if (selectID) {
      dispatch(getProductByCategory(selectID));
    }
  }, [selectID, dispatch]);

  const handleSelectCategory = (id) => {
    setSelectID(id); // Cập nhật ID của danh mục đã chọn
  };
  const RenderItemCategory = ({ item }) => {
    const isSelected = item._id === selectID;

    return (
      <TouchableOpacity
        style={[
          StylesCategory.btnCategory,
          isSelected && StylesCategory.btnCategorySelected,
        ]}
        onPress={() => handleSelectCategory(item._id)}
      >
        <Text
          style={[
            StylesCategory.btnText,
            isSelected && StylesCategory.btnTextSelected,
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={StylesCategory.container}>
      <View style={StylesCategory.content}>
        <Header name="left" title="Sản phẩm" icon="shoppingcart" />

        <ScrollView
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={StylesCategory.viewContent}
        >
          <View style={{ flex: 1 }}>
            <FlatList
              horizontal
              data={categories}
              renderItem={RenderItemCategory}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={{ flex: 1, marginTop: 20 }}>
            <FlashList
              data={productsByCategory}
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CategoryProduct;
