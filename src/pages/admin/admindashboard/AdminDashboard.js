import React, { useState } from "react";
import AdminCategory from "./AdminCategory";
import AdminProducts from "./AdminProducts";
import AdminSpecial from "./AdminSpecial";
import AdminAllUser from "./AdminAllUser";
import AdminBestSeller from "./AdminBestSeller";
import AdminFooter from "./adminfooter/AdminFooter";
import AdminImage from "./AdminImage";  // Import AdminImage
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const [section, setSection] = useState("category");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderSection = () => {
    switch (section) {
      case "category":
        return <AdminCategory />;
      case "special":
        return <AdminSpecial />;
      case "products":
        return <AdminProducts />;
      case "users":
        return <AdminAllUser />;
      case "bestseller":
        return <AdminBestSeller />;
      case "footer":
        return <AdminFooter />;
      case "image":  // New case for the image upload section
        return <AdminImage />;
      default:
        return null;
    }
  };

  const sections = [
    { key: "category", label: "Categories" },
    { key: "special", label: "Specials" },
    { key: "products", label: "Products" },
    { key: "users", label: "Users" },
    { key: "bestseller", label: "Best Sellers" },
    { key: "footer", label: "Footer" },
    { key: "image", label: "Image Upload" },  // New button for the image upload section
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
          gap: 2,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{ fontWeight: "bold", color: "#173334" }}
        >
          Admin Dashboard
        </Typography>

        {/* Navigation Buttons */}
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {sections.map((item) => (
            <Button
              key={item.key}
              variant={section === item.key ? "contained" : "outlined"}
              onClick={() => setSection(item.key)}
              sx={{
                flexGrow: { xs: 1, sm: 0 },
                backgroundColor: section === item.key ? "#febd2f" : "transparent",
                color: "#173334",
                borderColor: "#febd2f",
                fontWeight: 600,
                minWidth: "100px",
                "&:hover": {
                  backgroundColor: "#fcd667",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* Motion Effect Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
            {renderSection()}
          </Paper>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default AdminDashboard;
