import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

export const ProviderState = atom <any>({
    key : "ethers_provider",
    default : null,
    dangerouslyAllowMutability: true
})

export const AccountState = atom <string | null> ({
    key : "ethers_account",
    default : null,
})