import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/Axios"; // ✅ Axios instance
import { AppContext } from "../../context/AppState"; // ✅ Context

const CheckoutForm = () => {
  const { user } = useContext(AppContext); // ✅ Access user
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    paymentType: "COD",
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  });

  // ✅ Auto-fill user info if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const { paymentType, firstName, address, city, state, zip } = formData;
    if (!paymentType || !firstName || !address || !city || !state || !zip) {
      alert("Please fill all required fields.");
      return;
    }

    const confirmOrder = window.confirm("Are you sure you want to place this order?");
    if (!confirmOrder) return;

    try {
      const res = await api.post("/api/check/checkout", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        alert("Order placed successfully!");
        navigate("/ordersucess");
      } else {
        alert(res.data.msg || "Checkout failed.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong during checkout.");
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2 style={{ textAlign: "center" }}>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <label>Payment Type:</label>
        <select
          name="paymentType"
          value={formData.paymentType}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="COD">Cash On Delivery</option>
          <option value="ONLINE">Online Payment</option>
        </select>

        <input type="text" name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleChange} style={inputStyle} />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} style={inputStyle} />
        <input type="text" name="address" placeholder="Address *" value={formData.address} onChange={handleChange} style={inputStyle} />
        <input type="text" name="address2" placeholder="Address Line 2" value={formData.address2} onChange={handleChange} style={inputStyle} />
        <input type="text" name="city" placeholder="City *" value={formData.city} onChange={handleChange} style={inputStyle} />
        <input type="text" name="state" placeholder="State *" value={formData.state} onChange={handleChange} style={inputStyle} />
        <input type="text" name="zip" placeholder="Zip Code *" value={formData.zip} onChange={handleChange} style={inputStyle} />

        <button type="submit" style={submitStyle}>
          Place Order
        </button>
      </form>
    </div>
  );
};

const formContainerStyle = {
  maxWidth: "500px",
  margin: "0 auto",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "8px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const submitStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default CheckoutForm;
