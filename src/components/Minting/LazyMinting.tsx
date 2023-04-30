import {useState, useRef} from "react";
import {useRecoilValue} from "recoil";
import {AccountState, ProviderState} from "../../states/account";
import {NFTStorage, File} from "nft.storage";
import {nftContract_data} from "../../states/data/contract_abi";
import {ethers} from "ethers";
import {onSale_lazyMint} from "../../api/market/market";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {ProductType, LazyMintingVoucherType} from "../../types/product";
import PlusIcon from "../../assets/icons/plus_icon.svg";
import Button from "../Commons/Button/Button";

const LazyMinting = () => {
  const imgInputRef = useRef<HTMLInputElement>();
  const provider = useRecoilValue(ProviderState);
  const account = useRecoilValue(AccountState);
  const navigator = useNavigate();

  const [ImgFile, setImgFile] = useState<File | null>();
  const [PreviewImg, setPreviewImg] = useState<string>("");
  const [Name, setName] = useState<string>("");
  const [Description, setDescription] = useState<string>("");
  const [Price, setPrice] = useState<string>("");
  const [LoadingFlag, setLoadingFlag] = useState<boolean>(false);

  // @ NFT Storage Initialize
  const nftStorage : NFTStorage = new NFTStorage({
    token: process.env.REACT_APP_NFTSTORAGE_TOKEN,
  });

  // @ Upload NFT.storage IPFS
  const uploadToIPFS = async () : Promise<string> => {
    const metaData = await nftStorage.store({
      name: Name,
      description: Description,
      image: new File([ImgFile], ImgFile.name, {type: ImgFile.type}),
    });

    let metaUri = metaData.url.split("ipfs://")[1];

    return `https://ipfs.io/ipfs/${metaUri}`;
  };

  // @Lazy Minting
  const handleSubmit = async () => {
    // @ Check Exceptions
    if (!ImgFile || !Name || !Description || !Price) {
      alert("모든 정보를 입력해주세요.");
      return false;
    }

    setLoadingFlag(true);

    const signer = await provider.getSigner();

    // @ wei String Value Handling;
    const BN_number = ethers.utils.parseEther(Price); // 입력값 -> wei
    const String_Number = BN_number.toString(); // wei -> string

    const nftContract = await new ethers.Contract(
      nftContract_data.address,
      nftContract_data.abi,
      signer
    );

    // @ 1. Image Upload To IPFS
    const ipfsUrl: string = await uploadToIPFS();

    // @ 2. Create Voucher (Name, Description, IPFS Url, Price)를 포함해 msgHash 생성
    const voucher: LazyMintingVoucherType = [Name, Description, ipfsUrl, String_Number];

    // @ 3. Call MsgHash Function
    const msgHashTx = await nftContract.functions.getMsgHash(voucher);

    // @ 4. Sign To Data
    let signature;

    try {  
      const getSignature = await window.ethereum.request({
        method: "personal_sign",
        params: [account, msgHashTx._msgHash],
      });

      signature = getSignature;

    } catch (error) {
      window.location.reload();
      return;
    }

    // @ 5. Save Into Database
    const param: ProductType = {
      tokenId: null,
      name: Name,
      description: Description,
      ipfsUrl: ipfsUrl,
      price: Number(String_Number),
      sig: signature,
      signer: account,
    };

    const response = await onSale_lazyMint(param);

    if (response.status !== 201) {
      alert(
        "일시적으로 서버가 정상동작하지 않습니다. 잠시후 다시 시도해주세요."
      );
      setLoadingFlag(false);
    };

    console.log(voucher);

    console.log(signature)

    setLoadingFlag(false);
    navigator("/");
  }

  // @ Image Preview Handling
  const handleImgAdd = (e: { target: HTMLInputElement }) => {
    setImgFile(e.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setPreviewImg(String(reader.result));
    };
  };

  return (
    <div className="container">
      <Guide>
        [안내문구]<br />
        Lazy Minting 방식은 Creator가 Gas 비용을 부담하지 않는 방식으로
        서명하면 IPFS에 있는 데이터를 통해 NFT MarketPlace에 등록되게 됩니다.

        Minting된 NFT를 구매하면 생성자는 등록한 지갑을 통해 금액을 전달받고,
        NFT가 민팅되어 구매자의 EOA로 전달됩니다.
      </Guide>

      <ContentBox>
        {/* File Uplaoder */}
        <div>
          <Label>NFT Image</Label>

          <ImgBox state={PreviewImg} onClick={() => imgInputRef.current.click()}>

            {PreviewImg ? (
              <img src={PreviewImg} />
            ) : (
              <NoImgBox>
                <img src={PlusIcon} />
                <p>파일 선택</p>
              </NoImgBox>
            )}
            
          </ImgBox>

          <input
            type="file"
            accept="image/*"
            onChange={handleImgAdd}
            ref={imgInputRef}
            style={{ display: "none" }}
          />
        </div>

        {/* 기본정보 입력창 <Name, Description, uri, price> */}
        <NftInfoBox>
          <Label>Name</Label>
          <InfoInput
            type="text"
            placeholder="Write Your NFT Name"
            value={Name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <Label>Description</Label>
          <InfoTextarea
            placeholder="Write Your NFT Description"
            value={Description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />

          <Label>Price</Label>
          <InfoInput
            type="number"
            placeholder="Write Your NFT Price (COIN)"
            value={Price}
            onChange={(e) => setPrice(e.currentTarget.value)}
          />
        </NftInfoBox>
      </ContentBox>


      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <Button
          onClick={handleSubmit}
          label="Create NFT"
          loading={LoadingFlag}
        />
      </div>
      
    </div>
  );
};

export default LazyMinting;

const ContentBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const NftInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 100px;
`;

const Guide = styled.div`
  text-align: center;
  font-size: 20px;
  margin-top: 4rem;
  margin-bottom: 80px;
  line-height: 1.1;
`;

const Label = styled.label`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const ImgBox = styled.div<{state : string}>`
  width: 300px;
  height: 270px;
  border: ${props => props.state ? "": "1px solid var(--b1-color)"};
  border-radius: 10px;
  margin-top: 10px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
`;

const NoImgBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  img {
    width: 30px;
    height: 30px;
  }
  p {
    color: var(--b3-color);
    margin-top: 10px;
  }
`;

const InfoInput = styled.input`
  width: 300px;
  padding: 10px;
  font-size: 15px;
  font-weight: 400;
  border-radius: 5px;
  border: 1px solid var(--b1-color);
  margin-bottom: 20px;
`;

const InfoTextarea = styled.textarea`
  resize: none;
  padding: 10px;
  font-size: 15px;
  font-weight: 400;
  border-radius: 5px;
  border: 1px solid var(--b1-color);
  height: 200px;
  margin-bottom: 20px;
`;
