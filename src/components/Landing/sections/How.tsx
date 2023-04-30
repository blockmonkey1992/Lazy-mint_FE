import React from "react";
import styled from "styled-components";

const How = () => {
  return (
    <section className="landing__section--margin">
      <h1 className="landing__title">How to Use</h1>
      <ChapterForm>
        <div>
          <p>
            1. 지갑에 연결을 진행해주세요.(Metamask)
            만약 지갑이 없다면 <a href="https://metamask.io/download/" 
                              target="_blank" 
                              style={{color:"blue", textDecoration: "underline" }} >여기</a>를 클릭해 다운로드를 진행해주세요.
          </p>
        </div>
        <div>
          <p>
            2. 상단의 Mint NFT 버튼을 눌러 NFT를 민팅하고 Marketplace에서 당신의 NFT를 확인해 볼 수 있습니다.
          </p>
        </div>
        <div>
          <p>
            3. Marketplace에서 원하는 NFT를 구매 할 수 있습니다. 만약 Goerli Ethereum이 없다면, Faucet버튼을 눌러 Coin을 받고 진행해주세요.
          </p>
        </div>
        <div>
          <p>
            4. My Page에서 등록한 NFT목록과 당신의 수익금을 확인할 수 있습니다.
          </p>
        </div>
      </ChapterForm>
    </section>
  );
};

export default How;

const ChapterForm = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  div {
    width: 200px;
    height: 140px;
    p {
      font-size: 15px;
      font-weight: 500;
      line-height: 1.45;
    }
  }
`;
