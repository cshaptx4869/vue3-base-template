import http from "@/utils/request";

class UserAPI {
  // test get api
  static getList(params = {}) {
    return http.get("/user/list", {
      params,
    });
  }
}

export default UserAPI;
