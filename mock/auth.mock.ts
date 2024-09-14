import { defineMock } from "./base";

export default defineMock([
  {
    url: "/auth/signin",
    method: ["POST"],
    body: {
      code: 200,
      data: {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        tokenType: "Bearer",
      },
      msg: "一切ok",
    },
  },
  {
    url: "/auth/signup",
    method: ["POST"],
    body: {
      code: 200,
      data: {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        tokenType: "Bearer",
      },
      msg: "一切ok",
    },
  },
  {
    url: "/auth/refresh",
    method: ["POST"],
    body: {
      code: 200,
      data: {
        accessToken: "accessToken",
        tokenType: "Bearer",
      },
      msg: "一切ok",
    },
  },
]);
