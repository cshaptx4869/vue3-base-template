import { defineMock } from "./base";

export default defineMock([
  {
    url: "/user/list",
    method: ["GET"],
    body: {
      code: 200,
      data: [
        { id: 1, username: "tom", age: 20 },
        { id: 2, username: "jerry", age: 18 },
      ],
      msg: "一切ok",
    },
  },
]);
