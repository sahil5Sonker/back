import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Container,
  Box,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Grid,
  Paper,
  Toolbar,
  keyframes,
  useMediaQuery,
  useTheme,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle,
  KeyboardArrowDown,
  ChevronRight,
} from "@mui/icons-material";
import api from "../../api/Axios"; // adjust path as needed

// Animations
const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const fadeInAnimation = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const SearchBox = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#173334",
  border: "1px solid rgba(254, 189, 47, 0.3)",
  borderRadius: "5px",
  padding: "10px 15px",
  width: "60%",
  maxWidth: "500px",
  margin: "0 auto",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    maxWidth: "350px",
  },
}));

const CategoryButton = styled(Button)(({ theme, active }) => ({
  color: "#febd2f",
  textTransform: "none",
  fontSize: "0.8rem",
  position: "relative",
  margin: theme.spacing(0, 1),
  padding: theme.spacing(1, 2),
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    width: active ? "80%" : "0%",
    height: "2px",
    backgroundColor: "#febd2f",
    transition: "all 0.3s ease",
    transform: "translateX(-50%)",
  },
  "&:hover": {
    backgroundColor: "transparent",
    "&::after": {
      width: "80%",
    },
  },
}));

const MegaMenuContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  backgroundColor: "#ffffff",
  boxShadow: "0px 8px 16px rgba(0,0,0,0.1)",
  zIndex: 1300,
  animation: `${fadeInAnimation} 0.3s ease-in-out`,
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    position: "fixed",
    top: "auto",
    maxHeight: "60vh",
    overflowY: "auto",
  },
}));

const ProductCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(254, 189, 47, 0.1)",
  },
}));

function Navbar() {
  const [categories, setCategories] = useState([]);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [ setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/product/get");
      const data = res.data.products || [];

      setAllProducts(data);

      // Enrich categories with their matching products
      setCategories((prevCats) =>
        prevCats.map((cat) => ({
          ...cat,
          products: data.filter(
            (prod) =>
              prod.category?._id === cat._id ||
              prod.category === cat._id
          ),
        }))
      );
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  fetchProducts();
}, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await api.get(`/api/product/search?query=${value}`);
      setSuggestions(res.data.slice(0, 5)); // ✅ response from axios
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  // Fetch categories & products from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/category/get");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleMouseEnter = (menuName) => {
    if (!isScrolling && !isMobile) {
      setHoveredMenu(menuName);
    }
  };

  const handleMouseLeave = () => {
    if (!isScrolling) {
      setHoveredMenu(null);
    }
  };

  // Handle expand/collapse for mobile accordion menu
  const handleExpandCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      if (Math.abs(currentScrollPos - scrollPosition) > 20) {
        setHoveredMenu(null);
      }
      setScrollPosition(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      setIsScrolling(true);
      setHoveredMenu(null);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Close mega menu when screen size changes
  useEffect(() => {
    setHoveredMenu(null);
  }, [isMobile]);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  // Group products into rows for table display
  const getProductRows = (products, columnsPerRow = 4) => {
    if (!products || products.length === 0) return [];

    const rows = [];
    for (let i = 0; i < products.length; i += columnsPerRow) {
      rows.push(products.slice(i, i + columnsPerRow));
    }
    return rows;
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#173334" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer}
              sx={{ display: { md: "none" } }}
            >
              <MenuIcon sx={{ color: "#febd2f" }} />
            </IconButton>

            {/* <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "#febd2f",
                textDecoration: "none",
                flexGrow: { xs: 1, md: 0 },
                textAlign: { xs: "center", md: "left" },
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              TheAgriGoods
            </Typography> */}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              gutterBottom
              sx={{
                color: "#febd2f",
                fontFamily: "Poppins, Roboto",
                fontWeight: 700,
                letterSpacing: ".1rem",
                textDecoration: "none",
                flexGrow: { xs: 1, md: 0 },
                textAlign: { xs: "center", md: "left" },
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              TheAgriGoods
            </Typography>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexGrow: 1,
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "30px",
                  backgroundColor: "#febd2f",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                  width: "100%",
                  maxWidth: "420px",
                  px: 2,
                  py: 1,
                  transition: "all 0.3s ease",
                }}
              >
                <SearchIcon sx={{ color: "#173334", mr: 1 }} />
                <input
                  type="text"
                  placeholder="Search for products…"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onBlur={() => setTimeout(() => setSuggestions([]), 200)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    width: "100%",
                    fontSize: "16px",
                    color: "#173334",
                  }}
                />
              </Box>

              {suggestions.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "110%",
                    backgroundColor: "#ffffff",
                    zIndex: 10,
                    width: "100%",
                    maxWidth: "420px",
                    borderRadius: "12px",
                    mt: 1,
                    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                    animation: "fadeDown 0.3s ease",
                    overflow: "hidden",
                    "@keyframes fadeDown": {
                      from: { opacity: 0, transform: "translateY(-10px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  {suggestions.map((product) => (
                    <NavLink
                      key={product._id}
                      to={`/product/${product._id}`}
                      onClick={() => setSearchTerm("")}
                      style={{
                        display: "block",
                        padding: "12px 16px",
                        color: "#173334",
                        textDecoration: "none",
                        fontSize: "15px",
                        borderBottom: "1px solid #f0f0f0",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#febd2f")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      {product.title}
                    </NavLink>
                  ))}
                </Box>
              )}
            </Box>

            <Box
              sx={{ display: "flex", alignItems: "center", color: "#febd2f" }}
            >
              <Tooltip title="My Cart">
                <IconButton
                  sx={{
                    color: "#febd2f",
                    animation: `${bounceAnimation} 1s infinite ease-in-out`,
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCartIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Profile">
                <IconButton
                  component={NavLink} // ✅ Link to Signup Page
                  to="/profile"
                  sx={{
                    color: "#febd2f",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>

        {/* Desktop Categories Bar */}
        <Container maxWidth="xl" sx={{ display: { xs: "none", md: "block" } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              py: 1,
            }}
          >
            {categories.map((category) => (
              <Box
                key={category._id}
                onMouseEnter={() => handleMouseEnter(category._id)}
                onMouseLeave={handleMouseLeave}
                sx={{ position: "relative" }}
              >
                <CategoryButton
                  component={NavLink}
                  to={`/categories/${category._id}`}
                  active={hoveredMenu === category._id}
                  endIcon={
                    <KeyboardArrowDown
                      sx={{
                        transform:
                          hoveredMenu === category._id
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  }
                >
                  {category.name}
                </CategoryButton>
              </Box>
            ))}
          </Box>
        </Container>
      </AppBar>

      {/* Mega Menu Dropdown */}
      {hoveredMenu && (
        <MegaMenuContainer
          onMouseEnter={() => handleMouseEnter(hoveredMenu)}
          onMouseLeave={handleMouseLeave}
        >
          <Container maxWidth="xl" sx={{ py: 4 }}>
            {categories.find((cat) => cat._id === hoveredMenu) && (
              <Grid container spacing={3}>
                {/* Category Info */}
                <Grid item xs={12} md={3} sx={{ mb: { xs: 2, md: 0 } }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#173334",
                      fontWeight: 600,
                      mb: 2,
                      borderBottom: "2px solid #febd2f",
                      pb: 1,
                      display: "inline-block",
                    }}
                  >
                    {categories.find((cat) => cat._id === hoveredMenu).name}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#555", mb: 3 }}>
                    Browse our selection of premium quality agricultural
                    products designed for modern farming needs.
                  </Typography>
                </Grid>

                {/* Products in Table Format */}
                <Grid item xs={12} md={9}>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ border: "1px solid #eee" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#f8f8f8" }}>
                          <TableCell
                            colSpan={4}
                            sx={{
                              borderBottom: "2px solid #173334",
                              color: "#173334",
                              fontWeight: 600,
                            }}
                          >
                            Featured Products
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getProductRows(
                          categories.find((cat) => cat._id === hoveredMenu)
                            .products
                        ).map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((product) => (
                              <ProductCell key={product._id}>
                                <NavLink
                                  to={`/product/${product._id}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "#173334",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    padding: "8px",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: "0.9rem",
                                      transition: "color 0.2s ease",
                                      "&:hover": { color: "#febd2f" },
                                    }}
                                  >
                                    {product.title}
                                  </Typography>
                                </NavLink>
                              </ProductCell>
                            ))}
                            {/* Fill empty cells to maintain grid structure */}
                            {[...Array(4 - row.length)].map((_, index) => (
                              <TableCell key={`empty-${index}`}></TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}
          </Container>
        </MegaMenuContainer>
      )}

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 300 },
            backgroundColor: "#173334",
          },
        }}
      >
        <List sx={{ bgcolor: "#173334", height: "100%" }}>
          <ListItem>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#febd2f",
                fontFamily: "monospace",
                letterSpacing: ".1rem",
              }}
            >
              TheAgriGoods
            </Typography>
          </ListItem>
          <Divider sx={{ backgroundColor: "rgba(254, 189, 47, 0.2)" }} />

          {/* Search in mobile menu */}
          <ListItem>
            <SearchBox sx={{ width: "100%" }}>
              <SearchIcon sx={{ color: "#febd2f", marginRight: "8px" }} />
              <input
                type="text"
                placeholder="Search…"
                style={{
                  border: "none",
                  outline: "none",
                  color: "#febd2f",
                  background: "transparent",
                  width: "100%",
                }}
              />
            </SearchBox>
          </ListItem>

          <ListItem button component={Link} to="/" onClick={toggleDrawer}>
            <ListItemText primary="Home" sx={{ color: "#febd2f" }} />
          </ListItem>

          {/* Mobile Categories Accordion */}
          {categories.map((category) => (
            <React.Fragment key={category._id}>
              <ListItem
                button
                onClick={() => handleExpandCategory(category._id)}
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": { backgroundColor: "rgba(254, 189, 47, 0.1)" },
                }}
              >
                <ListItemText
                  primary={category.name}
                  sx={{ color: "#febd2f" }}
                />
                <KeyboardArrowDown
                  sx={{
                    color: "#febd2f",
                    transform:
                      expandedCategory === category._id
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </ListItem>

              <Collapse
                in={expandedCategory === category._id}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {category.products?.map((product) => (
                    <ListItem
                      button
                      key={product._id}
                      component={Link}
                      to={`/product/${product._id}`}
                      onClick={toggleDrawer}
                      sx={{ pl: 4 }}
                    >
                      <ChevronRight
                        sx={{ color: "#febd2f", fontSize: "0.8rem", mr: 1 }}
                      />
                      <ListItemText
                        primary={product.title}
                        sx={{
                          color: "#febd2f",
                          "& .MuiTypography-root": {
                            fontSize: "0.9rem",
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}

          <Divider sx={{ backgroundColor: "rgba(254, 189, 47, 0.2)", my: 1 }} />

          <ListItem button component={Link} to="/cart" onClick={toggleDrawer}>
            <ListItemText primary="My Cart" sx={{ color: "#febd2f" }} />
            <ShoppingCartIcon sx={{ color: "#febd2f", ml: 1 }} />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/profile"
            onClick={toggleDrawer}
          >
            <ListItemText primary="My Profile" sx={{ color: "#febd2f" }} />
            <AccountCircle sx={{ color: "#febd2f", ml: 1 }} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
