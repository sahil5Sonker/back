import React, { useEffect, useState } from "react";
import axios from "../../../api/Axios"; // ✅ using shared Axios instance
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const AdminBestSeller = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productId, setProductId] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchBestSellers = async () => {
    try {
      const res = await axios.get("/api/product/bestseller");
      setBestsellers(res.data.products || []);
    } catch (err) {
      console.error("Best seller fetch error:", err.message);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get("/api/product/get");
      setAllProducts(res.data.products || []);
    } catch (err) {
      console.error("All products fetch error:", err.message);
    }
  };

  const addBestSeller = async () => {
    if (!productId) return alert("Please select a product");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/product/bestseller/create",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        alert("Best seller added!");
        setProductId("");
        fetchBestSellers();
      } else {
        alert(res.data.message || "Failed to add best seller");
      }
    } catch (err) {
      console.error("Add best seller error:", err.message);
      alert("Failed to add best seller");
    }
  };

  const deleteBestSeller = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`/api/product/bestseller/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        alert("Best seller removed");
        fetchBestSellers();
      } else {
        alert("Failed to remove best seller");
      }
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  useEffect(() => {
    fetchBestSellers();
    fetchAllProducts();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" mb={3}>
        Admin: Manage Best Sellers
      </Typography>

      {/* Add Best Seller Section */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 2, sm: 3 },
          border: "1px solid #ccc",
          borderRadius: 2,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="h6" mb={2}>
          Add Best Seller Product
        </Typography>
        <TextField
          select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          fullWidth
          SelectProps={{ native: true }}
          sx={{ mb: 2 }}
        >
          <option value="">Select a product</option>
          {allProducts.map((prod) => {
            const isAlready = bestsellers.some((b) => b._id === prod._id);
            return (
              <option key={prod._id} value={prod._id} disabled={isAlready}>
                {prod.title} {isAlready ? "(Already Best Seller)" : ""}
              </option>
            );
          })}
        </TextField>
        <Button
          variant="contained"
          onClick={addBestSeller}
          sx={{
            backgroundColor: "#febd2f",
            color: "#173334",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#fcd667",
            },
          }}
          fullWidth
        >
          Add Best Seller
        </Button>
      </Box>

      {/* Best Seller Product Grid */}
      <Grid container spacing={3}>
        {bestsellers.map((prod) => (
          <Grid item xs={12} sm={6} md={4} key={prod._id}>
            <Card
              sx={{
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={`${axios.defaults.baseURL}/${prod.image}`}
                alt={prod.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {prod.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ₹{prod.price}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => deleteBestSeller(prod._id)}
                >
                  Remove
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminBestSeller;
