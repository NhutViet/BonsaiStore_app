import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  useGlobalSearchParams,
  useSearchParams,
} from "expo-router/build/hooks";
import AxiosInstance from "../../helper/AxiosInstance";
import Header from "../../components/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StylesDetail } from "../../components/StylesApp/StyleApp";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetail } from "../../components/redux-help/slices/ProductSlice";

const DetailCart = () => {
  const { product, token, isLoading, isSuccess, isError, errorMessage } =
    useSelector((state) => state.product);
  const dispatch = useDispatch();
  const params = useGlobalSearchParams();
  const id = params.id;
  console.log("ID Detail PR  >>>>>>>>>", id);

  const [detailPR, setDetailPR] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetail(id));
    }
  }, [id, dispatch]);

  // useEffect(() => {
  //   const fetchDetailPR = async () => {
  //     try {
  //       const response = await AxiosInstance().get(`/products/detail/${id}`);
  //       if (response.status === "true" || response.status === true) {
  //         setDetailPR(response.product);
  //       } else {
  //         console.log("Không tìm thấy sản phẩm");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchDetailPR();
  // }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Lấy token
      const userId = await AsyncStorage.getItem("userId"); // Lấy userId

      if (!token || !userId) {
        Alert.alert("Lỗi", "Bạn cần đăng nhập trước khi thêm vào giỏ hàng!");
        return;
      }

      const body = {
        userId: userId,
        productId: id, // ID sản phẩm
        quantity: quantity, // Mặc định 1 sản phẩm
      };

      const response = await AxiosInstance().post("/cart/add", body);
      if (response.status === true) {
        Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ hàng!");
        setQuantity(1);
      } else {
        Alert.alert("Lỗi", "Không thể thêm sản phẩm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <SafeAreaView style={StylesDetail.container}>
      <Header name="left" title="Chi tiết sản phẩm" icon="shoppingcart" />

      <ScrollView style={StylesDetail.content}>
        <View style={StylesDetail.product}>
          <Image
            style={StylesDetail.imgPR}
            resizeMode="contain"
            source={{
              uri: product.imagePR,
            }}
          />

          <TouchableOpacity style={StylesDetail.iconLetf}>
            <AntDesign name="left" size={24} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity style={StylesDetail.iconRight}>
            <AntDesign name="right" size={24} color={"#000"} />
          </TouchableOpacity>
        </View>
        <View style={StylesDetail.infoPR}>
          <TouchableOpacity style={StylesDetail.btnPlant}>
            <Text style={StylesDetail.txtPlant}>{product.type}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={StylesDetail.btnPlant}>
            <Text style={StylesDetail.txtPlant}>{product.traitPR}</Text>
          </TouchableOpacity>
        </View>

        <Text style={StylesDetail.txtPrice}>{product.pricePR} VNĐ</Text>

        <View style={StylesDetail.viewDetailPR}>
          <Text style={StylesDetail.txtHeaderViewDetailPR}>
            Chi tiết sản phẩm
          </Text>
          <View style={StylesDetail.line}></View>

          <View style={StylesDetail.viewtxtViewDetailPR}>
            <Text style={StylesDetail.txtViewDetailPR}>Kích cỡ</Text>
            <Text style={StylesDetail.txtViewDetailPR}>Nhỏ</Text>
          </View>
          <View style={StylesDetail.line}></View>

          <View style={StylesDetail.viewtxtViewDetailPR}>
            <Text style={StylesDetail.txtViewDetailPR}>Xuất xứ</Text>
            <Text style={StylesDetail.txtViewDetailPR}>Châu Phi</Text>
          </View>
          <View style={StylesDetail.line}></View>

          <View style={StylesDetail.viewtxtViewDetailPR}>
            <Text style={StylesDetail.txtViewDetailPR}>Tình trạng</Text>
            <Text style={StylesDetail.txtViewDetailPR}>
              Còn {product.quantity} sp
            </Text>
          </View>
          <View style={StylesDetail.line}></View>
        </View>

        <View style={StylesDetail.viewtxtViewDetailPR}>
          <Text style={StylesDetail.txtViewDetailPR}>Đã chọn 0 sản phẩm</Text>
          <Text style={StylesDetail.txtViewDetailPR}>Giá sản phẩm</Text>
        </View>
        <View style={StylesDetail.viewResutl}>
          <View style={StylesDetail.viewQuantityPR}>
            <TouchableOpacity onPress={decreaseQuantity}>
              <AntDesign name="minussquareo" size={24} color="black" />
            </TouchableOpacity>
            <Text style={StylesDetail.txtQuantity}>{quantity}</Text>
            <TouchableOpacity onPress={increaseQuantity}>
              <AntDesign name="plussquareo" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={StylesDetail.txtResutl}>{product.pricePR} VNĐ</Text>
        </View>
        <TouchableOpacity style={StylesDetail.btnBuy} onPress={handleAddToCart}>
          <Text style={StylesDetail.txtBuy}>Mua</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailCart;
