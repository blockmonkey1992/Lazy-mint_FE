import axios, { AxiosInstance } from "axios";

export const axiosInst : AxiosInstance = axios.create({
    baseURL : "http://localhost:5000/api/market/",
    withCredentials: true,
    responseType: "json",
    timeout: 10000000,
    headers : {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
    }
})