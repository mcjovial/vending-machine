import axios from "axios";
const token = localStorage.getItem("token");

var httpClient = axios.create({
  baseURL: "http://localhost:4000/api"
});

httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
console.log(httpClient.defaults.headers, token);


export default httpClient;