import http from "@/utils/request";

class UserAPI {
  // test get api
  static getList(params: Record<string, any> = {}) {
    return http.get("/user/list", {
      params,
      fetchOptions: {
        auth: true,
      },
    });
  }
}

export default UserAPI;
