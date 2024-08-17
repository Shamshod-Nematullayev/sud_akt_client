import axios from "axios";
import { host } from "./APIRouters";

const api = axios.create({
  baseURL: host,
});

export default api;
