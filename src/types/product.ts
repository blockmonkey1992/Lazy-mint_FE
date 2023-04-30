export interface ProductType {
    tokenId: number | null;
    name: string;
    description: string;
    ipfsUrl: string | any;
    price: number;
    saleState?: boolean;
    buyer?: string | null;
    _id?: string;
    sig?: string;
    signer?: string;
}

export interface NftCardType extends ProductType {
    width?: string | null;
    onClick?: () => void;
}

export type LazyMintingVoucherType = [string, string, string, string];

  