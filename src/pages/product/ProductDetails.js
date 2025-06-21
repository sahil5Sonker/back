import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Fade,
  IconButton,
  Chip,
  Rating,
} from "@mui/material";
import { ShoppingCart, Remove, ArrowBack, LocalShipping } from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import api from "../../api/Axios";

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const MainContainer = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f1419 0%, #173334 50%, #1a4a4d 100%)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(254, 189, 47, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(254, 189, 47, 0.08) 0%, transparent 50%)
    `,
    pointerEvents: "none",
  },
});

const ProductCard = styled(Box)({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "32px",
  padding: "0",
  boxShadow: "0 30px 80px rgba(0, 0, 0, 0.3)",
  border: "1px solid rgba(254, 189, 47, 0.3)",
  overflow: "hidden",
  transition: "all 0.4s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 40px 100px rgba(0, 0, 0, 0.4)",
  },
});

const ImageSection = styled(Box)({
  position: "relative",
  background: "linear-gradient(145deg, #173334 0%, #2a5a5c 100%)",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(45deg, transparent 30%, rgba(254, 189, 47, 0.1) 70%)",
    pointerEvents: "none",
  },
});

const ProductImage = styled("img")({
  width: "100%",
  height: "400px",
  objectFit: "cover",
  transition: "all 0.5s ease",
  "&:hover": {
    transform: "scale(1.08) rotate(1deg)",
  },
});

const InfoSection = styled(Box)({
  padding: "30px",
  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    background: "linear-gradient(180deg, #febd2f 0%, #f5a623 100%)",
  },
});

const AnimatedTitle = styled(Typography)({
  background: "linear-gradient(135deg, #173334 0%, #2a5a5c 50%, #febd2f 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: "800",
  fontSize: "2rem",
  marginBottom: "12px",
  animation: `${shimmer} 3s ease-in-out infinite`,
  backgroundSize: "200px 100%",
});

const PriceTag = styled(Box)({
  display: "inline-flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #febd2f 0%, #f5a623 100%)",
  color: "#173334",
  borderRadius: "50px",
  padding: "12px 24px",
  fontSize: "1.8rem",
  fontWeight: "bold",
  marginBottom: "20px",
  animation: `${pulse} 2s ease-in-out infinite`,
  boxShadow: "0 8px 25px rgba(254, 189, 47, 0.4)",
});

const ActionButton = styled(Button)(({ variant }) => ({
  borderRadius: "50px",
  padding: "16px 40px",
  fontSize: "1.1rem",
  fontWeight: "700",
  textTransform: "none",
  minWidth: "200px",
  marginRight: "12px",
  marginBottom: "12px",
  transition: "all 0.3s ease",
  ...(variant === "add" && {
    background: "linear-gradient(135deg, #febd2f 0%, #f5a623 100%)",
    color: "#173334",
    "&:hover": {
      background: "linear-gradient(135deg, #f5a623 0%, #e89611 100%)",
      transform: "translateY(-3px) scale(1.05)",
      boxShadow: "0 15px 35px rgba(254, 189, 47, 0.5)",
    },
  }),
  ...(variant === "remove" && {
    background: "linear-gradient(135deg, #173334 0%, #2a5a5c 100%)",
    color: "#febd2f",
    border: "2px solid #febd2f",
    "&:hover": {
      background: "linear-gradient(135deg, #2a5a5c 0%, #173334 100%)",
      transform: "translateY(-3px) scale(1.05)",
      boxShadow: "0 15px 35px rgba(23, 51, 52, 0.5)",
    },
  }),
}));

// const FloatingButton = styled(IconButton)({
//   position: "absolute",
//   backgroundColor: "rgba(255, 255, 255, 0.9)",
//   backdropFilter: "blur(10px)",
//   color: "#173334",
//   width: "56px",
//   height: "56px",
//   animation: `${float} 3s ease-in-out infinite`,
//   "&:hover": {
//     backgroundColor: "#febd2f",
//     transform: "scale(1.1)",
//   },
// });

const BackButton = styled(IconButton)({
  position: "absolute",
  top: "20px",
  left: "20px",
  backgroundColor: "rgba(254, 189, 47, 0.9)",
  color: "#173334",
  width: "56px",
  height: "56px",
  animation: `${float} 3s ease-in-out infinite`,
  "&:hover": {
    backgroundColor: "#febd2f",
    transform: "scale(1.1)",
    boxShadow: "0 8px 25px rgba(254, 189, 47, 0.4)",
  },
});

const FeatureChip = styled(Chip)({
  margin: "4px",
  background: "rgba(254, 189, 47, 0.1)",
  color: "#173334",
  border: "1px solid rgba(254, 189, 47, 0.3)",
  "&:hover": {
    background: "rgba(254, 189, 47, 0.2)",
    transform: "translateY(-2px)",
  },
});

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/product/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product:", error.message);
      } finally {
        setLoading(false);
      }
    };

    const checkCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/api/cart/getcart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items = res.data?.data?.products || [];
        const isInCart = items.some((item) => item.product._id === id);
        setInCart(isInCart);
      } catch (error) {
        console.error("Failed to check cart:", error.message);
      }
    };

    fetchProduct();
    checkCart();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/api/cart/addcart",
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200 || res.status === 201) {
        setInCart(true);
      }
    } catch (err) {
      console.error("Error adding to cart:", err.message);
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.delete(`/api/cart/deletcart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setInCart(false);
      }
    } catch (err) {
      console.error("Error removing from cart:", err.message);
    }
  };

  if (loading) {
    return (
      <MainContainer display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size={80} sx={{ color: "#febd2f" }} />
      </MainContainer>
    );
  }

  if (!product) {
    return (
      <MainContainer display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h5" color="#febd2f">Product not found</Typography>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <BackButton onClick={() => window.history.back()}>
        <ArrowBack />
      </BackButton>

      <Box sx={{ padding: "40px 20px", position: "relative", zIndex: 1 }}>
        <Fade in timeout={1000}>
          <ProductCard sx={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
              {/* Image Section */}
              <Box flex="1">
                <ImageSection>
                  <ProductImage
                    src={`${api.defaults.baseURL}/${product.image}`}
                    alt={product.title}
                  />
                </ImageSection>
              </Box>

              {/* Info Section */}
              <Box flex="1">
                <InfoSection>
                  <AnimatedTitle variant="h3">
                    {product.title}
                  </AnimatedTitle>

                  <Box display="flex" alignItems="center" mb={3}>
                    <Rating value={4.8} precision={0.1} readOnly sx={{ color: "#febd2f" }} />
                    <Typography variant="body2" sx={{ ml: 1, color: "#666" }}>
                      (4.8) • 2,847 reviews
                    </Typography>
                  </Box>

                  <PriceTag>
                    ₹{product.price}
                  </PriceTag>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "#555",
                      lineHeight: 1.8,
                      mb: 3,
                      fontSize: "1.1rem",
                    }}
                  >
                    {product.description}
                  </Typography>

                  <Box mb={3}>
                    <Typography variant="h6" sx={{ color: "#173334", mb: 2 }}>
                      Features:
                    </Typography>
                    <Box>
                      <FeatureChip icon={<LocalShipping />} label="Free Shipping" />
                      <FeatureChip label="Premium Quality" />
                      <FeatureChip label="24/7 Support" />
                      <FeatureChip label="Easy Returns" />
                    </Box>
                  </Box>

                  <Box>
                    {inCart ? (
                      <ActionButton
                        variant="remove"
                        onClick={handleRemoveFromCart}
                        startIcon={<Remove />}
                      >
                        Remove from Cart
                      </ActionButton>
                    ) : (
                      <ActionButton
                        variant="add"
                        onClick={handleAddToCart}
                        startIcon={<ShoppingCart />}
                      >
                        Add to Cart
                      </ActionButton>
                    )}
                  </Box>
                </InfoSection>
              </Box>
            </Box>
          </ProductCard>
        </Fade>
      </Box>
    </MainContainer>
  );
};

export default ProductDetails;