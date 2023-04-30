import { ethers } from "ethers";
import { atom } from "recoil";

export const NFTContract = atom<ethers.Contract | null>({
    key : "nft_contract",
    default : null
})

export const FactoryContract = atom<ethers.Contract | null>({
    key : "factory_contract",
    default : null
})

export const TradeContract = atom<ethers.Contract | null>({
    key : "trade_contract",
    default : null
})