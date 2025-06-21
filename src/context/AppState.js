import React, { createContext, useState } from "react";

export const AppContext = createContext();

const AppState = ({ children }) => {
  const [aboutData, setAboutData] = useState(null);
  const [profile,setProfile]= useState(null);
  const [user, setUser] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [userAdmin, setUserAdmin] = useState(null);
  const [tokenAdmin, setTokenAdmin] = useState(null);
  const [cart, setCart] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [bestSellerPreview, setBestSellerPreview] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [specialOfferPreview, setSpecialOfferPreview] = useState([]);

  return (
    <AppContext.Provider
      value={{
           user, setUser,
           profile,setProfile,
        aboutData,
        setAboutData,
        footerData,
        setFooterData,
        userAdmin,
        setUserAdmin,
        tokenAdmin,
        setTokenAdmin,
        cart,
        setCart,
        checkoutData,
        setCheckoutData,
        orders,
        setOrders,
        categories,
        setCategories,
        contactMessages,
        setContactMessages,
        carouselImages,
        setCarouselImages,
        bestSellers,
        setBestSellers,
        bestSellerPreview,
        setBestSellerPreview,
        specialOffers,
        setSpecialOffers,
        specialOfferPreview,
        setSpecialOfferPreview,
        // login krna ha
        
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppState;
