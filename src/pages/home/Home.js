import React from "react";
import ImageCarousel from "./ImageCarousel";
import CategoryList from "../category/CategoryList";
import BestSellerPreview from "./bestseller/BestSellerPreview";
import SpecialOfferPreview from "./specialoffer/SpeicalOfferPreview";
//  import ProductList from "../product/ProductList";

const Home = () => {
  return (
    <>
      <ImageCarousel />
      <CategoryList />
      {/* <ProductList/> */}
      <SpecialOfferPreview /> {/* ✅ new preview section */}
      <BestSellerPreview /> {/* ✅ Show products on home page */}
    </>
  );
};

export default Home;
