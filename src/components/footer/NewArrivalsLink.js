// src/pages/NewArrivals.jsx
import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import api from "../../api/Axios"; // ✅ Centralized Axios instance

const NewArrivals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await api.get("/api/product/new-arrivals");
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching new arrivals:", error.message);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="body1">
        <RouterLink
          to="/new-arrivals"
          style={{
            color: "inherit",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          New Arrivals
        </RouterLink>
      </Typography>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
        {products.length === 0 ? (
          <p>No new arrival products found.</p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                width: "200px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={
                  product.image.startsWith("http")
                    ? product.image
                    : `${api.defaults.baseURL}${product.image}`
                }
                alt={product.title}
                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "4px" }}
              />
              <h3 style={{ margin: "10px 0 5px" }}>{product.title}</h3>
              <p style={{ fontWeight: "bold", color: "#173334" }}>₹{product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewArrivals;
