import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Divider,
  Avatar,
  IconButton,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Snackbar,
  Alert,
  Slide,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../../components/navbar/Navbar";

// import Footer from "../../layouts/Footer";
import {
  Logout,
  ShoppingCart,
  Edit,
  Save,
  Close,
  Person,
  Email,
  Phone,
  Flag,
  LocationOn,
  Visibility,
  VisibilityOff,
  Favorite,
  SupportAgent,
  ReceiptLong,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Footer from "../../layouts/Footer";
import { AppContext } from "../../context/AppState";


// Custom theme with the specified colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#173334",
      light: "#254546",
      dark: "#0e2020",
      contrastText: "#fff",
    },
    secondary: {
      main: "#FEBD2F",
      light: "#fed45f",
      dark: "#e5a819",
      contrastText: "#173334",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#173334",
      secondary: "#4a6566",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
});

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.12)",
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  margin: "auto",
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  fontSize: 40,
  fontWeight: "bold",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
  border: `3px solid ${theme.palette.primary.main}`,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 3),
  transition: "all 0.3s ease",
}));

// Sample country list
const countries = [
  {
    code: "US",
    name: "United States",
    regions: ["California", "New York", "Texas"],
  },
  {
    code: "CA",
    name: "Canada",
    regions: ["Ontario", "Quebec", "British Columbia"],
  },
  {
    code: "UK",
    name: "United Kingdom",
    regions: ["England", "Scotland", "Wales"],
  },
  {
    code: "AU",
    name: "Australia",
    regions: ["New South Wales", "Victoria", "Queensland"],
  },
  { code: "IN", name: "India", regions: ["Maharashtra", "Karnataka", "Delhi"] },
];

const Profile = () => {
  const navigate = useNavigate();
   const { user, setUser } = useContext(AppContext); // ✅ Use global state
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [editedUser, setEditedUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    region: "",
    phoneNumber: "",
    countryCode: "+1",
  });
  const [formErrors, setFormErrors] = useState({
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);

        // Initialize edited user data
        setEditedUser({
          firstName: res.data.user.firstName || "",
          lastName: res.data.user.lastName || "",
          email: res.data.user.email || "",
          password: "",
          confirmPassword: "",
          country: res.data.user.country || "",
          region: res.data.user.region || "",
          phoneNumber: res.data.user.phoneNumber || "",
          countryCode: res.data.user.countryCode || "+1",
        });

        // Set available regions based on country
        if (res.data.user.country) {
          const countryObj = countries.find(
            (c) => c.name === res.data.user.country
          );
          if (countryObj) {
            setAvailableRegions(countryObj.regions);
          }
        }

        // Fetch cart and orders data
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

 



  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
     setUser(null); // ✅ clear context
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    // Reset password fields and errors
    setEditedUser((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
    }));
    setFormErrors({
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      const countryObj = countries.find((c) => c.name === value);
      setAvailableRegions(countryObj ? countryObj.regions : []);
      setEditedUser((prev) => ({
        ...prev,
        country: value,
        region: "", // Reset region when country changes
      }));
    } else if (name === "countryCode" || name === "phoneNumber") {
      if (name === "phoneNumber" && value !== "" && !/^\d*$/.test(value)) {
        // Only allow digits in phone number
        return;
      }
      setEditedUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "password") {
      setEditedUser((prev) => ({
        ...prev,
        password: value,
      }));

      // Validate password
      if (value && value.length < 8) {
        setFormErrors((prev) => ({
          ...prev,
          password: "Password must be at least 8 characters",
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          password: "",
        }));
      }

      // Check if passwords match
      if (editedUser.confirmPassword && value !== editedUser.confirmPassword) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else if (editedUser.confirmPassword) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
    } else if (name === "confirmPassword") {
      setEditedUser((prev) => ({
        ...prev,
        confirmPassword: value,
      }));

      // Check if passwords match
      if (value && value !== editedUser.password) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
    } else {
      setEditedUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    };

    // Validate passwords if either field has a value
    if (editedUser.password || editedUser.confirmPassword) {
      if (editedUser.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
        isValid = false;
      }

      if (editedUser.password !== editedUser.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    // Validate phone number
    if (editedUser.phoneNumber && !/^\d+$/.test(editedUser.phoneNumber)) {
      errors.phoneNumber = "Phone number must contain only digits";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Format the data according to your backend requirements
      const userData = {
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        email: editedUser.email,
        country: editedUser.country,
        region: editedUser.region,
        phoneNumber: editedUser.phoneNumber,
        countryCode: editedUser.countryCode,
      };

      // Only include password if it's being changed
      if (editedUser.password) {
        userData.password = editedUser.password;
      }

      await axios.put("http://localhost:5000/api/user/profile", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local user state
      setUser((prev) => ({
  ...prev,
  firstName: editedUser.firstName,
  lastName: editedUser.lastName,
  country: editedUser.country,
  region: editedUser.region,
  phoneNumber: editedUser.phoneNumber,
  countryCode: editedUser.countryCode,
}));

      setOpenEditDialog(false);
      setNotification({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to update profile. Please try again.",
        severity: "error",
      });
    }
  };



  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress sx={{ color: "#173334" }} />
      </Box>
    );

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Section */}
          <StyledPaper
            sx={{
              p: 4,
              textAlign: "center",
              mb: 4,
              background: `linear-gradient(135deg, rgba(254,189,47,0.1) 0%, rgba(23,51,52,0.05) 100%)`,
            }}
          >
            <ProfileAvatar>
              {user?.firstName?.charAt(0).toUpperCase() ||
                user?.lastName?.charAt(0).toUpperCase() ||
                "U"}
            </ProfileAvatar>
            <Typography
              variant="h5"
              sx={{ mt: 2, fontWeight: "bold", color: "primary.main" }}
            >
              {`${user?.firstName || ""} ${user?.lastName || ""}`}
            </Typography>
            <Typography color="text.secondary">{user?.email}</Typography>

            <Grid
              container
              spacing={2}
              sx={{ mt: 2, justifyContent: "center" }}
            >
              <Grid item>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Phone
                    fontSize="small"
                    sx={{ mr: 1, color: "primary.main" }}
                  />
                  <Typography variant="body2">
                    {user?.countryCode && user?.phoneNumber
                      ? `${user.countryCode} ${user.phoneNumber}`
                      : "No phone added"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Flag
                    fontSize="small"
                    sx={{ mr: 1, color: "primary.main" }}
                  />
                  <Typography variant="body2">
                    {user?.country || "Country not specified"}
                  </Typography>
                </Box>
              </Grid>
              {user?.region && (
                <Grid item>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOn
                      fontSize="small"
                      sx={{ mr: 1, color: "primary.main" }}
                    />
                    <Typography variant="body2">{user.region}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <ActionButton
                variant="contained"
                color="secondary"
                startIcon={<Edit />}
                onClick={handleOpenEditDialog}
                sx={{ color: "primary.main" }}
              >
                Edit Profile
              </ActionButton>
              <ActionButton
                variant="outlined"
                color="primary"
                startIcon={<Logout />}
                onClick={handleLogout}
              >
                Logout
              </ActionButton>
            </Box>
          </StyledPaper>
        </motion.div>

        <Grid container spacing={4}>
          {/* Orders Section */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <StyledPaper
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/orders")}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <ReceiptLong sx={{ mr: 1, color: "secondary.main" }} />{" "}
                  {/* ✅ Orders Icon */}
                  <Typography variant="h6" color="primary.main">
                    My Orders
                  </Typography>
                </Box>
              </StyledPaper>
            </motion.div>
          </Grid>

          {/* Wishlist Section */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <StyledPaper
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/wishlist")}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Favorite sx={{ mr: 1, color: "secondary.main" }} />{" "}
                  {/* ✅ Wishlist Icon */}
                  <Typography variant="h6" color="primary.main">
                    My Wishlist
                  </Typography>
                </Box>
              </StyledPaper>
            </motion.div>
          </Grid>

          {/* Customer Support & Help Section */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <StyledPaper
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/support")}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <SupportAgent sx={{ mr: 1, color: "secondary.main" }} />{" "}
                  {/* ✅ Support Icon */}
                  <Typography variant="h6" color="primary.main">
                    Customer Support & Help
                  </Typography>
                </Box>
              </StyledPaper>
            </motion.div>
          </Grid>

          {/* Cart Section */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StyledPaper
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/cart")} // ✅ Navigate to Cart Page
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <ShoppingCart sx={{ mr: 1, color: "secondary.main" }} />{" "}
                  {/* ✅ Cart Icon */}
                  <Typography variant="h6" color="primary.main">
                    My Cart
                  </Typography>
                </Box>

               
                
              </StyledPaper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
        <Footer/>

      {/* Edit Profile Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: "background.paper",
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white", pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Edit sx={{ mr: 1 }} />
              Edit Your Profile
            </Box>
            <IconButton onClick={handleCloseEditDialog} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ py: 1 }}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  color="primary.main"
                  sx={{ mb: 2, display: "flex", alignItems: "center" }}
                >
                  <Person sx={{ mr: 1 }} /> Personal Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={editedUser.firstName}
                  onChange={handleEditChange}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={editedUser.lastName}
                  onChange={handleEditChange}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleEditChange}
                  variant="outlined"
                  disabled
                  helperText="Email cannot be changed"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Password Information */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  color="primary.main"
                  sx={{ mb: 2, mt: 2, display: "flex", alignItems: "center" }}
                >
                  Password
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Leave blank if you don't want to change your password
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={editedUser.password}
                  onChange={handleEditChange}
                  variant="outlined"
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={editedUser.confirmPassword}
                  onChange={handleEditChange}
                  variant="outlined"
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Location Information */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  color="primary.main"
                  sx={{ mb: 2, mt: 2, display: "flex", alignItems: "center" }}
                >
                  <LocationOn sx={{ mr: 1 }} /> Location
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Country</InputLabel>
                  <Select
                    name="country"
                    value={editedUser.country}
                    onChange={handleEditChange}
                    label="Country"
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.name}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  disabled={!editedUser.country}
                >
                  <InputLabel>Region</InputLabel>
                  <Select
                    name="region"
                    value={editedUser.region}
                    onChange={handleEditChange}
                    label="Region"
                  >
                    {availableRegions.map((region) => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  color="primary.main"
                  sx={{ mb: 2, mt: 2, display: "flex", alignItems: "center" }}
                >
                  <Phone sx={{ mr: 1 }} /> Contact
                </Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Country Code</InputLabel>
                  <Select
                    name="countryCode"
                    value={editedUser.countryCode}
                    onChange={handleEditChange}
                    label="Country Code"
                  >
                    <MenuItem value="+1">+1 (US/CA)</MenuItem>
                    <MenuItem value="+44">+44 (UK)</MenuItem>
                    <MenuItem value="+61">+61 (AU)</MenuItem>
                    <MenuItem value="+91">+91 (IN)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={editedUser.phoneNumber}
                  onChange={handleEditChange}
                  variant="outlined"
                  error={!!formErrors.phoneNumber}
                  helperText={formErrors.phoneNumber}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
          <Button onClick={handleCloseEditDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            variant="contained"
            color="primary"
            startIcon={<Save />}
          ></Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseNotification} sx={{ width: "100%" }}></Alert>
      </Snackbar>
    </ThemeProvider>
  );
};
export default Profile;
