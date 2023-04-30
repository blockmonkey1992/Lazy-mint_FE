import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from "styled-components";
import { ethers } from 'ethers'
import { myNfts } from '../../api/market/market'
import { ProductType } from '../../types/product'
import NftCard from '../Commons/NftCard/NftCard'
import EthereumLogo from "../../assets/images/ethereum_logo.png";
import { useRecoilValue } from 'recoil';
import { AccountState, ProviderState } from '../../states/account';
import { nftContract_data } from '../../states/data/contract_abi';

interface MyNfts {
    tokenId : string;
    tokenURI : string;
    imgURI : string;
}

const My = () => {
    const [TotalEarned, setTotalEarned] = useState<string | null>(null);
    const [SignedNft, setSignedNft] = useState<ProductType[] | null>(null);
    const [MyNfts, setMyNfts] = useState<MyNfts[] | null>(null);
    const account = useRecoilValue(AccountState);
    const provider = useRecoilValue(ProviderState);
    const { id } = useParams();
    const navi = useNavigate();



    useEffect(() => {
        // @ GET Signed NFTs FROM Backend & wei Price Handling
        (async function(){
            // @ Get NFTs filtered by Signer
            const result = await myNfts(id);

            // @ Compute Total Earned;
            const filtered = result.data.filter((item:ProductType) => item.saleState);
            
            let sum : number = 0;

            filtered.map((item: ProductType) => {
                const wei : string = String(item.price);
                const weiToEther = ethers.utils.formatEther(wei);
                sum += Number(weiToEther);
            })
            
            setSignedNft(result.data);
            setTotalEarned(String(sum.toFixed(18)));
        })();

        // @ GET My NFTs FROM Smart Contract
        (async function() {
            if(provider) {

                const signer = await provider.getSigner();

                const nftContract = await new ethers.Contract(
                    nftContract_data.address,
                    nftContract_data.abi,
                    signer
                );
    
                const nfts = await nftContract.functions.getNFTsbyOwner(account);

                let result : MyNfts[] = [];

                for(let i=0; i < nfts[0].length; i++) {
                    const tokenId = nfts[0][i].tokenId.toString();
                    const tokenURI = nfts[0][i].tokenURI;

                    const res = await fetch(tokenURI);
                    const json = await res.json();
                    const imgURL = await json.image.split("ipfs://");

                    result.push({
                        tokenId, 
                        tokenURI, 
                        imgURI : `https://ipfs.io/ipfs/${imgURL[1]}`
                    });
                }
                setMyNfts(result);
            }
        })();


    }, [account])
    
    return (
        <MyPageContainer>
            <div className="container">

                {/* My NFTs */}
                    {/* Head Box */}
                    <TitleBox>
                        <h1 className="landing__title">My NFTs</h1>
                    </TitleBox>

                    {/* NFTs */}
                    <MyNFTCardContainer>
                        {MyNfts?.length ?
                            <>
                                {MyNfts?.map((item, idx) => (
                                    <div key={idx}>
                                    <div style={{ textAlign: "center", fontWeight: "800", marginBottom: "5px" }}>
                                        Token ID : {item.tokenId}
                                    </div>
                                    <MyNFTCard img={item.imgURI} onClick={() => window.open(item.tokenURI, "_blank")} />
                                    </div>
                                ))}
                            </>

                        :

                        <>
                            소유한 NFT가 없습니다.
                        </>
                        }
                    </MyNFTCardContainer>


                {/* Created NFTs */}
                    {/* Head Box */}
                    <TitleBox>
                        <h1 className="landing__title">Created NFTs</h1>
                        <EarnedSpan> 
                            <NftPrice>
                                Total Earned :  <img src={EthereumLogo} />  {TotalEarned}
                            </NftPrice>  
                        </EarnedSpan>
                    </TitleBox>

                    {/* NFTs */}
                    <SignedNftBox>
                        {SignedNft?.length ?
                        <>
                            {SignedNft?.map((item : ProductType, idx: number)=> (
                                    <NftCardBox key={idx}>
                                        <NftCard 
                                            _id={item._id}
                                            tokenId={item.tokenId}
                                            name={item.name}
                                            description={item.description}
                                            ipfsUrl={item.ipfsUrl}
                                            price={item.price}
                                            signer={item.signer}
                                            sig={item.sig}
                                            saleState={item.saleState}
                                            buyer={item.buyer}
                                            width="300px"
                                            onClick={() => {
                                                if(!item.saleState){
                                                    navi(`/nft/${item._id}`);
                                                }
                                            }}
                                        />
                                    </NftCardBox>
                            ))}
                        </>
                    
                        :

                        <>
                            생성한 NFT가 없습니다.
                        </>
                        
                        }

                    </SignedNftBox>
                </div>
        </MyPageContainer>
    )
}

export default My

const MyPageContainer = styled.div`
    padding: 5rem;
`;

const SignedNftBox = styled.div`
    display: flex;
    overflow-x: scroll;
    padding : 25px;
`;

const NftCardBox = styled.div`
    margin : 15px;
`;

const TitleBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const EarnedSpan = styled.span`
    font-style: italic;
    font-size: 18px;
    margin-right: 2rem;
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

const MyNFTCardContainer = styled.div`
    display: flex;
    padding : 25px;
    margin-bottom: 25px;
    overflow-x: scroll;
`;

const MyNFTCard = styled.div<{img : string}>`
    border: 1px solid lightgray;
    width: 200px;
    height: 220px;
    background-image: url(${props => props.img});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    overflow: hidden;

    display: flex;
    justify-content: space-around;
    align-items: end;
    margin : 15px;
    :hover {
        cursor: pointer;
        transform: scale(1.01);
    }
`;

