import axios from "axios";

var httpClient = axios.create({
  baseURL: "https://vendering.herokuapp.com/api"
});

export default httpClient;