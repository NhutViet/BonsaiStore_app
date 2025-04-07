import axios from "axios";

const AxiosInstance = (token = "", contentType = "application/json") => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/",
  });
  // cmd -----> ipconfig -----> IPv4 Address (192.168.1.1)
  axiosInstance.interceptors.request.use(
    async (config) => {
      // const token = '';
      config.headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": contentType,
      };
      return config;
    },
    (err) => Promise.reject(err)
  );

  axiosInstance.interceptors.response.use(
    (res) => res.data,
    (err) => Promise.reject(err)
  );
  return axiosInstance;
};

export default AxiosInstance;
