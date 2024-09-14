import http from "@/utils/request";

class AuthAPI {
  // 注册
  static signUp(data: Record<string, any>) {
    return http.post<any, LoginResult>("/auth/signup", data);
  }

  // 登录
  static signIn(data: Record<string, any>) {
    return http.post<any, LoginResult>("/auth/signin", data);
  }

  // 刷新token
  static refreshToken(headers: Record<string, any> = {}) {
    return http.post<any, LoginResult>("/auth/refresh", undefined, {
      headers,
    });
  }
}

export default AuthAPI;

/** 登录响应 */
export interface LoginResult {
  /** 访问token */
  accessToken: string;
  /** 过期时间(单位：毫秒) */
  expires?: number;
  /** 刷新token */
  refreshToken: string;
  /** token 类型 */
  tokenType: string;
}
