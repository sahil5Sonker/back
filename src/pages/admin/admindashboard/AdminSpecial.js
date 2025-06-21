import React, { useEffect, useState } from "react";
import axios from "../../../api/Axios"; // Adjust path based on your project structure
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Grid,
} from "@mui/material";

const AdminSpecial = () => {
  const [specials, setSpecials] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [productId, setProductId] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountExpiry, setDiscountExpiry] = useState("");

  const fetchSpecialOffers = async () => {
    try {
      const res = await axios.get("/api/product/get?type=specialoffer");
      setSpecials(res.data.products || []);
    } catch (err) {
      console.error("Fetch specials error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get("/api/product/get");
      setAllProducts(res.data.products || []);
    } catch (err) {
      console.error("Fetch products error:", err.message);
    }
  };

  const createOffer = async () => {
    if (!productId || !discount || !discountExpiry) {
      alert("Please fill all fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/product/specialoffer/create",
        {
          productId,
          discount,
          discountExpiry,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Special offer added!");

      setProductId("");
      setDiscount("");
      setDiscountExpiry("");
      fetchSpecialOffers();
    } catch (err) {
      console.error("Create offer error:", err.message);
      alert("Failed to create offer.");
    }
  };

  const removeOffer = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`/api/product/specialoffer/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchSpecialOffers();
    } catch (err) {
      console.error("Delete offer error:", err.message);
      alert("Failed to remove offer.");
    }
  };

  useEffect(() => {
    fetchSpecialOffers();
    fetchAllProducts();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Admin: Manage Special Offers
      </Typography>

      {/* Create Form */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add Special Offer
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
          {allProducts.map((product) => {
            const isAlreadySpecial = specials.some(
              (s) => s._id === product._id
            );
            return (
              <option
                key={product._id}
                value={product._id}
                disabled={isAlreadySpecial}
              >
                {product.title} {isAlreadySpecial ? "(Already in Special)" : ""}
              </option>
            );
          })}
        </TextField>

        <TextField
          label="Discount %"
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Expiry Date"
          type="date"
          value={discountExpiry}
          onChange={(e) => setDiscountExpiry(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" onClick={createOffer}>
          Add Offer
        </Button>
      </Box>

      {/* Special Offers List */}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : specials.length === 0 ? (
        <Typography>No special offers available.</Typography>
      ) : (
        <Grid container spacing={3}>
          {specials.map((prod) => (
            <Grid item xs={12} sm={6} md={4} key={prod._id}>
              <Card sx={{ borderRadius: "12px", boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={`${axios.defaults.baseURL}/${prod.image}`}
                  alt={prod.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {prod.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Discount: {prod.discount}%<br />
                    Expiry:{" "}
                    {prod.discountExpiry
                      ? new Date(prod.discountExpiry).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button
                      onClick={() => removeOffer(prod._id)}
                      variant="contained"
                      color="error"
                      size="small"
                    >
                      Remove Offer
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminSpecial;
