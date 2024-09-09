import { CacheEnum } from "@/enums/CacheEnum";
import { ResultEnum } from "@/enums/ResultEnum";
import axios, { type AxiosResponse } from "axios";
import qs from "qs";

// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_PROXY_PREFIX,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  responseType: "json",
  timeout: 50000,
  paramsSerializer: (params) => {
    return qs.stringify(params);
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(CacheEnum.ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    console.log("🚀 ~ response:", response);
    // 检查配置的响应类型是否为二进制类型（'blob' 或 'arraybuffer'）, 如果是，直接返回响应对象
    if (
      response.config.responseType === "blob" ||
      response.config.responseType === "arraybuffer"
    ) {
      return response;
    }

    const { code, data, msg } = response.data;
    if (code === ResultEnum.SUCCESS) {
      return data;
    }

    console.info(msg || "系统出错");
    return Promise.reject(new Error(msg || "System Error"));
  },
  (error) => {
    console.log("🚀 ~ error:", error);
    if (error.response) {
      // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      console.log(error.response);
    } else if (error.request) {
      // 请求已经成功发起，但没有收到响应
      // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
      // 而在node.js中是 http.ClientRequest 的实例
      console.log(error.request);
    } else {
      // 发送请求时出了点问题
      console.log(error.message);
    }
    return Promise.reject(new Error(error.message));
  }
);

// 导出 axios 实例
export default http;
