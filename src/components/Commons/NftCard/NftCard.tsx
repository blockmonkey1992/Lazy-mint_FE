import {ethers} from "ethers";
import React, {useState, useEffect} from "react";
import styled from "styled-components";
import { NftCardType } from "../../../types/product";
import SoldOutImage from "../../../assets/images/soldout.png";
import EthereumLogo from "../../../assets/images/ethereum_logo.png";

const NftCard = (props: NftCardType) => {

  const [ImgSrc, setImgSrc] = useState<string | null>();
  const [Price, setPrice] = useState("");

  // GET Image URL FROM IPFS Stored JSON DATA;
  useEffect(() => {
    const wei : string = String(props.price);
    const weiToEther = ethers.utils.formatEther(wei);
    setPrice(weiToEther);

    (async function () {
      const res = await fetch(props.ipfsUrl);
      const resJSON = await res.json();
      const imgSrc = await resJSON.image.split("ipfs://");

      setImgSrc(`https://ipfs.io/ipfs/${imgSrc[1]}`);
    })();
  }, [props._id]);

  return (
    <NftForm className="nfts" width={props.width} onClick={props.onClick} state={props.saleState}>
      
      {props.saleState &&
        <SoldOut>
          <SoldOutImg src={SoldOutImage} alt={"Sold Out Image"}/>
        </SoldOut>
      }

      <ImgBox state={props.saleState}>
        <img src={ImgSrc} />
      </ImgBox>

      <NftInfoSection state={props.saleState}>
        <NftTitle>{props.name}</NftTitle>
        <NftSigner>{props.signer?.slice(0, 8)} ...</NftSigner>
        <NftPrice>
          <img src={EthereumLogo} /> {Price}
        </NftPrice>       
      </NftInfoSection>

    </NftForm>
  );
};

export default NftCard;

const NftForm = styled.div<{width: string, state : boolean}>`
  width: ${props => props.width};
  height: 370px;
  border-radius: 15px;
  box-shadow: rgb(0 0 0 / 7%) 0px 4px 15px;
  overflow: hidden;
  position: relative;
  :hover{
    transform: scale(1.01);
    cursor: ${props => props.state ? "not-allowed" : "pointer"};
  }
`;

const ImgBox = styled.div<{state: boolean}>`
  width: 100%;
  height: 270px;
  img {
    width: 100%;
    height: 100%;
  }
  opacity: ${props => props.state ? .1 : 1};
`;

const NftInfoSection = styled.div<{state: boolean}>`
  padding: 15px;
  background-color: white;
  opacity: ${props => props.state ? .1 : 1};
`;

const NftTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--b4-color);
`;

const NftSigner = styled.div`
  font-weight: 500;
  font-size: 15px;
  color: var(--b4-color);
  margin-top: 5px;
  margin-bottom: 10px;
`;

const SoldOut = styled.div`
    position: absolute;
    top: 50%;
    left : 50%;
    transform: translate(-50%, -90%);
`;

const SoldOutImg = styled.img`
  width: 200px;
`;

const NftPrice = styled.div`
  font-weight: 700;
  color: var(--b4-color);
  font-size: 15px;
  img {
    position: relative;
    top: -2px;
    width: 20px;
    height: 20px;
  }
`;
