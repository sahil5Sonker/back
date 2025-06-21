import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
  Fade,
  Zoom,
  Container,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import { styled, keyframes } from "@mui/material/styles";
import api from "../../api/Axios";

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Styled Components
const MainContainer = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(254, 189, 47, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(23, 51, 52, 0.05) 0%, transparent 50%)
    `,
    pointerEvents: "none",
  },
});

const HeaderSection = styled(Box)({
  background: "linear-gradient(135deg, #173334 0%, #2a5a5c 100%)",
  color: "white",
  padding: "60px 0 40px",
  marginBottom: "40px",
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #febd2f 0%, #f5a623 100%)",
  },
});

const CategoryTitle = styled(Typography)({
  fontWeight: "800",
  fontSize: "3rem",
  textAlign: "center",
  background: "linear-gradient(135deg, #ffffff 0%, #febd2f 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: `${shimmer} 3s ease-in-out infinite`,
  backgroundSize: "200px 100%",
  marginBottom: "16px",
});

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

const ProductCard = styled(Card)({
  borderRadius: "24px",
  overflow: "hidden",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(254, 189, 47, 0.1)",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  position: "relative",
  animation: `${fadeInUp} 0.6s ease-out`,
  "&:hover": {
    transform: "translateY(-12px) scale(1.02)",
    boxShadow: "0 25px 50px rgba(23, 51, 52, 0.2)",
    "& .product-image": {
      transform: "scale(1.1)",
    },
    "& .action-buttons": {
      opacity: 1,
      transform: "translateY(0)",
    },
    "& .view-button": {
      background: "linear-gradient(135deg, #173334 0%, #2a5a5c 100%)",
      color: "#febd2f",
      transform: "translateY(-2px)",
    },
  },
});

const ProductImage = styled(CardMedia)({
  height: "200px",
  transition: "all 0.5s ease",
  position: "relative",
});

const ActionButtons = styled(Box)({
  position: "absolute",
  top: "12px",
  right: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  opacity: 0,
  transform: "translateY(-10px)",
  transition: "all 0.3s ease",
});

const ActionButton = styled(IconButton)({
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  width: "40px",
  height: "40px",
  color: "#173334",
  "&:hover": {
    backgroundColor: "#febd2f",
    transform: "scale(1.1)",
  },
});

const ProductContent = styled(CardContent)({
  padding: "20px",
  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
});

const ProductTitle = styled(Typography)({
  fontWeight: "700",
  fontSize: "1.1rem",
  color: "#173334",
  marginBottom: "8px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const ProductPrice = styled(Typography)({
  fontWeight: "800",
  fontSize: "1.3rem",
  color: "#febd2f",
  marginBottom: "16px",
  textShadow: "0 2px 4px rgba(254, 189, 47, 0.3)",
});

const ViewButton = styled(Link)({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "#febd2f",
  color: "#173334",
  fontWeight: "700",
  fontSize: "0.9rem",
  padding: "10px 20px",
  borderRadius: "50px",
  textDecoration: "none",
  transition: "all 0.3s ease",
  border: "2px solid transparent",
  "&:hover": {
    textDecoration: "none",
  },
});

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "60vh",
  flexDirection: "column",
  gap: "20px",
});

const CategoryProducts = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const fetchCategory = async () => {
    try {
      const res = await api.get(`/api/category/${id}`);
      const categoryData = res.data.category || res.data;
      console.log("Fetched category data:", categoryData);
      setCategory(categoryData);
    } catch (err) {
      console.error("Error loading category:", err.message);
      setError("Failed to load category. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <MainContainer>
        <LoadingContainer>
          <CircularProgress size={60} sx={{ color: "#febd2f" }} />
          <Typography variant="h6" sx={{ color: "#173334" }}>
            Loading amazing products...
          </Typography>
        </LoadingContainer>
      </MainContainer>
    );
  }

  if (error) {
    return (
      <MainContainer>
        <Container>
          <Box textAlign="center" py={8}>
            <Typography variant="h5" color="error" gutterBottom>
              {error}
            </Typography>
            <ViewButton as="button" onClick={() => window.location.reload()}>
              Try Again
            </ViewButton>
          </Box>
        </Container>
      </MainContainer>
    );
  }

  const renderProductCard = (product, index) => (
    <Zoom in timeout={300 + index * 100} key={product._id}>
      <ProductCard>
        <Box position="relative">
          <ProductImage
            component="img"
            image={`${api.defaults.baseURL}/${product.image}`}
            alt={product.title}
            className="product-image"
          />
          <ActionButtons className="action-buttons">
            <ActionButton onClick={() => toggleFavorite(product._id)}>
              {favorites.has(product._id) ? 
                <FavoriteIcon sx={{ color: "#e74c3c" }} /> : 
                <FavoriteBorderIcon />
              }
            </ActionButton>
            <ActionButton>
              <ShoppingCartIcon />
            </ActionButton>
          </ActionButtons>
        </Box>

        <ProductContent>
          <ProductTitle variant="h6">
            {product.title}
          </ProductTitle>

          <ProductPrice>
            ₹{product.price}
          </ProductPrice>

          <ViewButton to={`/product/${product._id}`} className="view-button">
            <VisibilityIcon fontSize="small" />
            View Product
          </ViewButton>
        </ProductContent>
      </ProductCard>
    </Zoom>
  );

  return (
    <MainContainer>
      <HeaderSection>
        <BackButton onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </BackButton>
        <Container>
          <Fade in timeout={800}>
            <Box>
              <CategoryTitle>
                {category?.name || "Category"}
              </CategoryTitle>
              <Typography 
                variant="h6" 
                textAlign="center" 
                sx={{ opacity: 0.9, fontWeight: 300 }}
              >
                Discover {category?.products?.length || 0} amazing products
              </Typography>
            </Box>
          </Fade>
        </Container>
      </HeaderSection>

      <Container sx={{ pb: 6, position: "relative", zIndex: 1 }}>
        {category?.products && category.products.length > 0 ? (
          <Grid container spacing={3}>
            {category.products.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                {renderProductCard(product, index)}
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography variant="h5" sx={{ color: "#173334", mb: 2 }}>
              No products found in this category
            </Typography>
            <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
              Check back later for new arrivals!
            </Typography>
          </Box>
        )}
      </Container>
    </MainContainer>
  );
};

export default CategoryProducts;