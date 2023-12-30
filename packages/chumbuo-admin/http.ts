import axios from "axios";

const http = axios.create({
  responseType: "json",
});

http.interceptors.response.use(
  (response) => response,
  (error) => error
);

export default http;
