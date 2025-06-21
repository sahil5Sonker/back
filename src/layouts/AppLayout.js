import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

const AppLayout = () => {
  return (
    <div>
      <Header />
      <Navbar />

       <Outlet /> {/* This renders the matching nested route (like Home) */}
      <Footer />
    </div>
  );
};

export default AppLayout;
