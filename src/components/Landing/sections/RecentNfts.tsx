import React, {useState, useEffect} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";
import {getAllProducts} from "../../../api/market/market";
import {ProductType} from "../../../types/product";
import { useNavigate} from "react-router-dom";
import NftCard from "../../Commons/NftCard/NftCard";
import "swiper/css";
import "swiper/css/pagination";

const RecentNfts = () => {
  const [Products, setProducts] = useState<ProductType[]>([]);
  const navi = useNavigate();

  useEffect(() => {
    (async function () {
      const result = await getAllProducts(1);
      setProducts(result.data);
    })();
  }, []);

  return (
    <section className="landing__section--margin">
      <h1 className="landing__title">New NFTs</h1>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {Products?.map((item, idx) => (
            !item.saleState && (
                <SwiperSlide key={idx}>
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
                      onClick={() => navi(`/nft/${item._id}`)}
                    />
                </SwiperSlide>
            ) 
        ))}
      </Swiper>
    </section>
  );
};

export default RecentNfts;
