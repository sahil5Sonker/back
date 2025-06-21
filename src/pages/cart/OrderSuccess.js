import React, { useContext } from "react";
import { AppContext } from "../../context/AppState";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const OrderSuccess = () => {
  const { user } = useContext(AppContext); // ✅ Get user from context
  const navigate = useNavigate();

 const handleViewOrders = () => {
    navigate("/Allordersucess");
  };


  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <h2>🎉 Order Placed Successfully!</h2>
      <p style={{ fontSize: "1.1rem", marginTop: "10px" }}>
        Thank you{user?.firstName ? `, ${user.firstName}` : ""}! Your order has been placed and is being processed.
      </p>
      <p style={{ marginBottom: "30px" }}>
        We’ll notify you once it ships. You can track your order anytime from your account.
      </p>
      <Button
        onClick={handleViewOrders}
        LinkComponent={"/ordersucess"}
        variant="contained"
        sx={{ backgroundColor: "#173334", color: "#fff", px: 4, py: 1 }}
      >
        View My Orders
      </Button>
    </div>
  );
};

export default OrderSuccess;
