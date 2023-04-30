import { axiosInst } from "./axiosInstance";
import { ProductType } from "../../types/product";
import { AxiosResponse } from "axios";

export const getAllProducts  = async (page : number) : Promise<AxiosResponse<ProductType[]>> => {
    try {
        const res = await axiosInst.get<ProductType[]>(`/pages/${page}`);
        return res;
    } catch(err) {
        throw err;
    }
}

export const getOneProducts = async (_id : string) : Promise<AxiosResponse<ProductType>> => {
    try {
        const res = await axiosInst.get(`${_id}`);
        return res;
    } catch (err) {
        throw err;
    }
}

export const onSale_lazyMint = async (params : ProductType) : Promise<AxiosResponse<ProductType>> => {
    try {
        const res = await axiosInst.post(`/onsale/lazymint`, params);
        return res;
    } catch (err) {
        throw err;
    }
}

export const offSale = async (params : { 
    _id : string,
    buyer : string
    }) : Promise<AxiosResponse<ProductType>> => {
    try {
        const res = await axiosInst.patch("/offsale", params);
        return res;
    } catch (err) {
        throw err;
    }
}

export const myNfts = async (id : string) : Promise<AxiosResponse<ProductType[]>> => {
    try {
        const res = await axiosInst.get(`/user/${id}`);
        return res;
    } catch (err) {
        throw err;
    }
}