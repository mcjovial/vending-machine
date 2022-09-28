import axios from "axios";
// const token = localStorage.getItem("token");

var httpClient = axios.create({
  baseURL: "https://vendering.herokuapp.com/api"
});

// httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// console.log(httpClient.defaults.headers, token);


export default httpClient;