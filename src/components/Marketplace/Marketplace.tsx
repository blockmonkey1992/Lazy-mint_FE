import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {getAllProducts} from "../../api/market/market";
import {ProductType} from "../../types/product";
import NftCard from "../Commons/NftCard/NftCard";
import Arrow_icon from "../../assets/icons/arrow_icon.svg";

function MarketPlace() {
  const [PageNum, setPageNum] = useState<number>(1);
  const [Products, setProducts] = useState<ProductType[]>();
  const [NextPageFlag, setNextPageFlag] = useState<boolean>(false);

  const navi = useNavigate();

  // @ PAGING
  useEffect(() => {
    (async function () {
      const result = await getAllProducts(PageNum);
      const NextResult = await getAllProducts(PageNum + 1);
      
      setProducts(result.data);

      NextResult.data.length ? setNextPageFlag(false) : setNextPageFlag(true);
    })();
  }, [PageNum]);

  return (
    <>
    {/* NFT List */}
      <NftSection>
        <>
          {Products?.map((item, idx) => (
            <div key={idx}>
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
                onClick={() => {
                  if(!item.saleState){
                      navi(`/nft/${item._id}`);
                  }
                }}
                width="350px"
              />
            </div>
            )
          )}
        </>
      </NftSection>

      {/* Page Button */}
      <BtnSection>

        <PrevBtn PageNum={PageNum} onClick={() => setPageNum(PageNum - 1)}>
          <img src={Arrow_icon} />
          <button>Prev</button>
        </PrevBtn>

        <NextBtn NextPageFlag={NextPageFlag} onClick={() => setPageNum(PageNum + 1)}>
          <button>Next</button>
          <img src={Arrow_icon} />
        </NextBtn>

      </BtnSection>
    </>
  );
}

export default MarketPlace;

const NftSection = styled.section`
  margin-top: 100px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 1800px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 1350px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(1, 1fr);
  }
  .nfts {
    margin: auto;
    margin-bottom: 50px;
  }
`;

const BtnSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    :hover {
      button {
        border: 1px solid white;
        background-color: white;
        color: var(--b4-color);
      }
    }
    button {
      border: 1px solid var(--b4-color);
      color: white;
      background-color: var(--b4-color);
      font-weight: 900;
      font-size: 25px;
      height: 50px;
      width: 100px;
      border-radius: 10px;
    }
    img {
      width: 50px;
      height: 50px;
    }
  }
  margin-bottom: 20px;
`;

const PrevBtn = styled.div<{PageNum: number}>`
  visibility: ${(props) => (props.PageNum == 1 ? "hidden" : "visible")};
  img {
    transform: rotate(180deg);
    margin-right: 20px;
  }
  margin-right: 50px;
`;

const NextBtn = styled.div<{NextPageFlag: boolean}>`
  visibility: ${(props) => (props.NextPageFlag ? "hidden" : "visible")};
  img {
    margin-left: 20px;
  }
  margin-left: 50px;
`;