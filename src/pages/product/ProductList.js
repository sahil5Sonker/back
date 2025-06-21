import React, { useEffect, useState, useContext } from "react";
import axios from "../../api/Axios";
import { AppContext } from "../../context/AppState";
import ProductCard from "../../components/productcard/ProductCard"; // Assume this renders individual product cards
import { Grid, Typography, Container } from "@mui/material";
import { toast } from "react-toastify";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const { setCart } = useContext(AppContext);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/product/get");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err.message);
      toast.error("Failed to load products");
    }
  };

  // Add product to cart
  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/cart/addcart",
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Product added to cart!");
        if (setCart) {
          setCart((prev) => [...(prev || []), res.data.cartItem]);
        }
      } else {
        toast.error(res.data.msg || "Something went wrong");
      }
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      toast.error("Failed to add product to cart.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        All Products
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductsPage;
