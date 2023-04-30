import {ethers} from "ethers";
import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {getOneProducts, offSale} from "../../api/market/market";
import {AccountState, ProviderState} from "../../states/account";
import {nftContract_data} from "../../states/data/contract_abi";
import styled from "styled-components";
import {ProductType} from "../../types/product";
import {LazyMintingVoucherType} from "../../types/product";
import Button from "../Commons/Button/Button";
import EthereumLogo from "../../assets/images/ethereum_logo.png";

const NftDetail = () => {
  const account = useRecoilValue(AccountState);
  const provider = useRecoilValue(ProviderState);
  const params = useParams();
  const navi = useNavigate();
  const [Nft, setNft] = useState<ProductType>();
  const [EthPrice, setEthPrice] = useState("");
  const [ImgSrc, setImgSrc] = useState<string | null>();
  const [LoadingFlag, setLoadingFlag] = useState<boolean>(false);

  // @ Get product & handle wei Price;
  useEffect(() => {
    (async function () {
      const res = await getOneProducts(params.id);
      const wei: string = String(res.data.price);
      const weiToEther = ethers.utils.formatEther(wei);
      setNft(res.data);
      setEthPrice(weiToEther);
    })();
  }, []);

  // @ GET Image URL FROM IPFS;
  useEffect(() => {
    if (Nft?.ipfsUrl) {
      (async function () {
        const res = await fetch(Nft.ipfsUrl);
        const resJSON = await res.json();
        const imgSrc = await resJSON.image.split("ipfs://");
        setImgSrc(`https://ipfs.io/ipfs/${imgSrc[1]}`);
      })();
      }
  }, [Nft]);

  // @ Buy NFT (Tx to RedeemNFT Function);
  const handleBuy = async () => {
    setLoadingFlag(true);
    // @ 1.Get Signer & Contract
    const signer = await provider.getSigner();

    const nftContract = await new ethers.Contract(
      nftContract_data.address,
      nftContract_data.abi,
      signer
    );

    let redeemNFT_Result;
    let estimatedGasLimit;
    let errState: boolean;

    // @ 2.Check Transaction Static Call To Check ERR without Gas;
    const voucher: LazyMintingVoucherType = [
      Nft.name,
      Nft.description,
      Nft.ipfsUrl,
      String(Nft.price),
    ];

    // @ 3. Call Static & Estimate Gas;
    try {
      const estimatedGasLimit = await nftContract.estimateGas.redeemNFT(
        account,
        Nft.signer,
        Nft.sig,
        voucher,
        {
          value: Number(Nft.price),
        }
      );

      await nftContract.callStatic.redeemNFT(
        account,
        Nft.signer,
        Nft.sig,
        voucher,
        {
          gasLimit: estimatedGasLimit,
          value: Number(Nft.price),
        }
      );
    } catch (err) {
      setLoadingFlag(false);
      errState = true;
    }

    // @ ERR From Estimate Gas & Static Call
    if (errState) {
      alert(
        `현재 트랜잭션은 정상처리가 불가능합니다. 잠시후 다시 시도해주십시오. ${errState}`
      );
    }

    // @ 4. Transaction;
    if (!errState) {
      try {
        redeemNFT_Result = await nftContract.functions.redeemNFT(
          account,
          Nft.signer,
          Nft.sig,
          voucher,
          {
            gasLimit: estimatedGasLimit,
            value: Number(Nft.price),
          }  
        );
        // Show Etherscan
        window.open(
          `https://goerli.etherscan.io/tx/${redeemNFT_Result.hash}`,
          "_blank"
        );
      } catch (err) {
        // Wallet Connect Refused
        window.location.reload();
      }

      // @ Call Backend to Update "saleState"
      try {
        await offSale({_id: Nft._id, buyer: account});
      } catch (err) {
        setLoadingFlag(false);
        throw err;
      }
      
      setLoadingFlag(false);
      navi("/marketplace");
    }
  };



  return (
    <div className="container">
      {Nft?.name && (
        <>
          <DetailComponent>
            {/* Image Section */}
            <div>
              <Label>NFT Image</Label>
              <ImgBox onClick={() => window.open(`${ImgSrc}`, "_blank")}>
                <img src={ImgSrc} />
              </ImgBox>
            </div>

            {/* Descriptions */}
            <DescriptionBox>
              <Label>Name</Label>
              <Content>{Nft.name}</Content>

              <Label>Description</Label>
              <Content>{Nft.description}</Content>

              <Label>Creator</Label>
              <Content>{Nft.signer}</Content>
              <Label>Price</Label>
              <Content className="price">
                <img src={EthereumLogo} /> {EthPrice}
              </Content>
            </DescriptionBox>
          </DetailComponent>
          <div style={{textAlign: "center"}}>
            <Button label="Buy now" loading={LoadingFlag} onClick={handleBuy} />
          </div>
        </>
      )}
    </div>
  );
};

export default NftDetail;

const DetailComponent = styled.div`
  display: flex;
  margin-top: 100px;
  justify-content: center;
  margin-bottom: 20px;
`;

const ImgBox = styled.div`
  width: 300px;
  height: 270px;
  border: 1px solid var(--b1-color);
  border-radius: 10px;
  margin-top: 10px;
  overflow: hidden;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
`;

const DescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 100px;
`;

const Label = styled.label`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Content = styled.div`
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 400;

  &.price {
    img {
      position: relative;
      top: -2px;
      width: 20px;
      height: 20px;
    }
  }
`;
