import { createDefineMock } from "vite-plugin-mock-dev-server";

export const defineMock = createDefineMock((mock) => {
  mock.url = import.meta.env.VITE_APP_PROXY_PREFIX + mock.url;
});
