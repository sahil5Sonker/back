import React, { useEffect, useContext, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link } from "react-router-dom";
import { AppContext } from "../../../context/AppState";
import api from "../../../api/Axios";

const BestSeller = () => {
  const { bestSellers, setBestSellers } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/product/bestseller"); // ✅ Use central API
      setBestSellers(res.data.products || []);
    } catch (err) {
      console.error("Error fetching best sellers:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bestSellers.length === 0) {
      fetchBestSellers();
    }
  }, []);

  const renderProductCard = (product) => (
    <Card
      key={product._id}
      sx={{
        maxWidth: 220,
        borderRadius: "15px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        position: "relative",
        transition: "0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <IconButton
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            backgroundColor: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            "&:hover": { backgroundColor: "#febd2f" },
          }}
        >
          <FavoriteBorderIcon fontSize="small" />
        </IconButton>

        <CardMedia
          component="img"
          height="180"
          image={`${api.defaults.baseURL}/${product.image}`} // ✅ Use baseURL from API
          alt={product.title}
        />
      </Box>

      <CardContent sx={{ px: 2, pb: 2 }}>
        <Typography
          component="h2"
          variant="subtitle2"
          sx={{ fontWeight: 700, mb: 0.5 }}
          noWrap
        >
          {product.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 400 }}>
            ₹{product.price}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Link
            to={`/product/${product._id}`}
            style={{
              textDecoration: "none",
              display: "inline-block",
              backgroundColor: "#febd2f",
              color: "#173334",
              fontWeight: 600,
              fontSize: "0.8rem",
              padding: "6px 14px",
              borderRadius: "20px",
              textAlign: "center",
            }}
          >
            View Product
          </Link>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <Typography sx={{ px: 4, py: 6 }}>Loading Best Sellers...</Typography>;
  }

  return (
    <Box sx={{ px: 4, py: 6, backgroundColor: "#f0f8f5" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h5" sx={{ color: "#173334", fontWeight: 700 }}>
          All Best Selling Products
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {bestSellers.length > 0 ? (
          bestSellers.map((product) => (
            <Grid item xs={6} sm={4} md={3} lg={2.4} key={product._id}>
              {renderProductCard(product)}
            </Grid>
          ))
        ) : (
          <Typography>No best sellers available.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default BestSeller;
