import { HeaderEnum } from "@/enums/HeaderEnum";
import { ResultEnum } from "@/enums/ResultEnum";
import i18n from "@/lang";
import router from "@/router";
import { useAuthStore } from "@/store";
import { deepMerge, guid, ksort } from "@/utils";
import axios from "axios";
import { MD5 } from "crypto-js";
import Qs from "qs";

// 接口签名
const API_SAFE = true;
const API_KEY = "8oJliIOB2gKLFHec0jmM7Z5S9Y4UdQnP";
// 启用 refreshToken
const ENABLED_REFRESH_TOKEN = true;
// 请求重试队列，每一项将是一个待执行的函数形式
let requests: Array<() => void> = [];
// 是否正在刷新token的标记
let isRefreshing = false;

// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_PROXY_PREFIX,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  responseType: "json",
  timeout: 50000,
  // 自定义请求选项
  fetchOptions: {
    // 鉴权
    auth: false,
  },
  paramsSerializer: (params) => {
    return Qs.stringify(params);
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 引用token
    if (config.fetchOptions?.auth) {
      const authStore = useAuthStore();
      config.headers[HeaderEnum.ACCESS_TOKEN] = authStore.accessToken;
    }

    // 生成接口签名
    if (API_SAFE) {
      if (config.params === undefined) {
        config.params = {};
      }
      // nonce参数用于防止重发攻击
      config.params.nonce = guid(16);
      // timestamp参数用于解决nonce随请求次数无限增多的问题
      config.params.timestamp = Date.now();
      // 将所有请求参数按照字典排序
      const signParams = ksort(deepMerge(config.data, config.params));
      // 将排序后的参数数组按照 key1=val1&key2=val2 的形式组成字符串，将字符串与API_KEY连接，用md5加密一次(32位小写)，得到sign
      let signStr = "";
      for (const key in signParams) {
        signStr += `${key}=${
          typeof signParams[key] === "object"
            ? JSON.stringify(signParams[key])
            : signParams[key]
        }&`;
      }
      signStr += API_KEY;
      config.headers[HeaderEnum.SIGN] = MD5(signStr).toString();
      // console.log(signStr);
    }

    // 国际化标识
    config.headers[HeaderEnum.I18N] = i18n.global.locale.value;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    console.log("🚀 ~ response:", response);

    // 检查配置的响应类型是否为二进制类型（'blob' 或 'arraybuffer'）, 如果是，直接返回响应对象
    if (
      response.config.responseType === "blob" ||
      response.config.responseType === "arraybuffer"
    ) {
      return response;
    }

    // 服务器返回的数据
    const { code, data, msg } = response.data;
    if (code === ResultEnum.SUCCESS) {
      return data;
    } else if (code === ResultEnum.ACCESS_TOKEN_INVALID) {
      // 短token无效或过期
      const authStore = useAuthStore();
      if (!ENABLED_REFRESH_TOKEN || !authStore.refreshToken) {
        authStore.signOut();
        router.replace("/login");
        return Promise.reject(new Error(msg || "access token invalid"));
      } else {
        return new Promise((resolve, reject) => {
          // 将resolve放进重试队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push(() => resolve(http.request(response.config)));
          // 刷新短token
          if (!isRefreshing) {
            isRefreshing = true;
            authStore
              .refresh({
                [HeaderEnum.REFRESH_TOKEN]: authStore.refreshToken,
              })
              .then(() => {
                requests.forEach((request) => request());
              })
              .catch(() => {
                // 捕获长token失效的reject
                authStore.signOut();
                router.replace("/login");
              })
              .finally(() => {
                requests = [];
                isRefreshing = false;
              });
          }
        });
      }
    } else if (code === ResultEnum.REFRESH_TOKEN_INVALID) {
      // 长token无效或过期
      return Promise.reject(new Error(msg || "refresh token invalid"));
    } else {
      // 其他错误
      console.error(msg || "系统出错");
      return Promise.reject(new Error(msg || "System Error"));
    }
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
