import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Box, Container, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { AppContext } from "../../context/AppState";
import api from "../../api/Axios"; // ✅ Import global axios instance

const CategoryList = () => {
  const { categories, setCategories } = useContext(AppContext); // use global state
  const primaryColor = "#173334";

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/category/get"); // Use the custom axios instance here
      const data = res.data;
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Box sx={{ background: "#fff", py: 6, px: { xs: 4, sm: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: primaryColor,
              fontWeight: 700,
              display: "inline-block",
              position: "relative",
              pb: 1,
            }}
          >
            Categories
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: "40%",
                right: "60%",
                transform: "translateX(-50%)",
                width: "1160px",
                height: "1px",
                backgroundColor: "#d3d3d3",
                borderRadius: "2px",
              }}
            />
          </Typography>
        </Box>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{
            "@media (min-width:1200px)": {
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gridAutoRows: "auto",
              gridAutoFlow: "row dense",
              "& > :nth-of-type(n+6)": { gridColumn: "span 1" },
              "& > :nth-of-type(6)": { gridColumnStart: 1 },
              "& > :nth-of-type(6), & > :nth-of-type(7), & > :nth-of-type(8), & > :nth-of-type(9)": {
                gridRowStart: 2,
              },
              "& > :nth-of-type(10)": { display: "none" },
            },
          }}
        >
          {categories.map((cat, index) => (
            <Grid item key={cat._id} xs={6} sm={4} md={3} lg={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/categories/${cat._id}`} style={{ textDecoration: "none" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.08)",
                          boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                        },
                      }}
                    >
                      <img
                        src={
                          cat.image
                            ? `${
                                window.location.origin.includes("localhost")
                                  ? "http://localhost:5000"
                                  : "https://back-4-sjcm.onrender.com"
                              }/uploads/category/${cat.image}`
                            : "/placeholder.png"
                        }
                        alt={cat.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: primaryColor,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                        maxWidth: "120px",
                      }}
                    >
                      {cat.name}
                    </Typography>
                  </Box>
                </Link>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CategoryList;
