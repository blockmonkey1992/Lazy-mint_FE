import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ethers} from "ethers";
import {useRecoilState} from "recoil";
import {AccountState, ProviderState} from "../../../states/account";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Logo from "../../../assets/images/mc_logo.png";
import WalletIcon from "../../../assets/icons/header_wallet_icon.svg";
import CoinIcon from "../../../assets/icons/coin_icon.svg";

const Header = () => {
  const [Provider, setProvider] = useRecoilState(ProviderState);
  const [Account, setAccount] = useRecoilState(AccountState);
  const [Balance, setBalance] = useState<string>();

  useEffect(() => {
    connectMetamask();
    if (Account) {
      getBalance();
    }
  }, [Account]);

  const location = useLocation();
  const url = location.pathname;
  const navi = useNavigate();

  // @ Connect Metamask & Network Handle;
  const connectMetamask = async () => {
    // Check Metamask Installed
    if (!window.ethereum) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    // Inject Provider
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const account: string[] = await provider.send("eth_requestAccounts", []);

    // Check Network & Fit Network
    const {chainId} = await provider.getNetwork();

    if (chainId !== 5) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{chainId: "0x5"}],
      });
    }

    setProvider(provider);
    setAccount(account[0]);
  };
  
  // @ Get Users Balance;
  const getBalance = async () => {
    const balance = await Provider.getBalance(Account);
    const formatBalance = ethers.utils.formatEther(balance);
    setBalance(formatBalance);
  };

  return (
    <Header_Component>

      {/* LeftHeader */}
      <LogoBox onClick={() => navi("/")}>
        <img src={Logo} />
        <div style={{ marginLeft: "20px" }}>Test Version 0.1</div>
      </LogoBox>

      {/* MiddleHeader */}
      <HeaderCategory>
        <Link to="/marketplace">
          <button className={url == "/marketplace" ? "active" : ""}>
            Marketplace
          </button>
        </Link>
        <Link to="/lazymint">
          <button className={url == "/lazymint" ? "active" : ""}>
            Mint NFT
          </button>
        </Link>
        <Link to={`/my/${Account}`}>
          <button className={url == `/my/${Account}` ? "active" : ""}>My Page</button>
        </Link>
        <div>
          <button onClick={() => window.open("https://goerlifaucet.com/", "_blank")}>Faucet</button>
        </div>
        <div>
          <button onClick={() => window.open("https://goerli.etherscan.io/address/0x5a5eb29B037fA4b56D121e2E73D642d544B5Dce6#code", "_blank")}>Contract</button>
        </div>
      </HeaderCategory>

      {/* RightHEader */}
      <MyInfo>
        {Account ? (
          <>
            <div>
              <img src={WalletIcon} />
              <p>{Account.slice(0, 8)} ...</p>
            </div>
            <div>
              <img src={CoinIcon} />
              <p>
                {Balance?.length >= 8 ? `${Balance.slice(0, 8)} ...` : Balance}
              </p>
            </div>
          </>
        ) : (
          <WalletConnectBtn onClick={connectMetamask}>
            <img src={WalletIcon} /> Connect To Metamask
          </WalletConnectBtn>
        )}
      </MyInfo>
    </Header_Component>
  );
};

export default Header;

const Header_Component = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 80px !important;
  z-index: 99;
  background-color: white;
  filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.15));
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 65px;
  }
  :hover {
    transform: scale(1.01);
    cursor: pointer;
  }
`;

const WalletConnectBtn = styled.button`
  background-color: white;
  border: 1px solid lightgray;
  padding: 10px;
  font-weight: 600;
`;

const HeaderCategory = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 40%;
  button {
    border: none;
    color: var(--b4-color);
    font-weight: 900;
    font-size: 25px;
    background-color: white;
    cursor: pointer;
    &.active {
      color: var(--b2-color);
    }
  }
`;

const MyInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    p {
      font-size: 15px;
      font-weight: 400;
      color: var(--b4-color);
      margin-bottom: 0 !important;
      margin-left: 10px;
    }
  }
  div:last-child {
    margin-left: 30px;
    img {
      width: 35px;
    }
  }
`;
