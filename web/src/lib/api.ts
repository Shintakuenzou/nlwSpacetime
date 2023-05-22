import axios from "axios";

export const apis = axios.create({
  baseURL: "http://192.168.15.10:3333",
});
