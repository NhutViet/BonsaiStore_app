import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import AxiosInstance from "@/helper/AxiosInstance";
import { FlashList } from "@shopify/flash-list";
import RenderItemSearch from "../../components/RenderItemSearch";
import Header from "../../components/Header";
import { StylesSearch } from "../../components/StylesApp/StyleApp";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState([]); // Khởi tạo với mảng rỗng

  useEffect(() => {
    const fetchProductsTree = async () => {
      try {
        const response = await AxiosInstance().get(
          `/products/search?keyword=${keyword}`
        );

        setSearch(response);
      } catch (e) {
        console.log(e);
      }
    };

    if (keyword.trim()) {
      fetchProductsTree();
    } else {
      setSearch([]); // Xóa kết quả tìm kiếm khi từ khóa trống
    }

    return () => {};
  }, [keyword]);

  return (
    <SafeAreaView style={StylesSearch.container}>
      <Header name="left" title="Tìm kiếm" />
      <View style={StylesSearch.content}>
        <View style={StylesSearch.viewInput}>
          <TextInput
            placeholder="Tìm kiếm"
            onChangeText={(text) => setKeyword(text)}
            value={keyword}
            style={{ flex: 1 }}
          />
          {keyword ? (
            <TouchableOpacity onPress={() => setKeyword("")}>
              <AntDesign name="closecircle" size={20} color="gray" />
            </TouchableOpacity>
          ) : (
            <AntDesign name="search1" size={24} color="black" />
          )}
        </View>

        {search.length === 0 ? (
          <Text style={StylesSearch.searchEmty}>Chưa tìm kiếm sản phẩm</Text>
        ) : (
          <View style={{ flex: 1 }}>
            <FlashList
              data={search}
              keyExtractor={(item) => item._id.toString()} // Đặt đúng keyExtractor
              renderItem={({ item }) => (
                <RenderItemSearch
                  _id={item._id}
                  imagePR={item.imagePR}
                  namePR={item.namePR}
                  pricePR={item.pricePR}
                  quantity={item.quantity}
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

export default Search;
