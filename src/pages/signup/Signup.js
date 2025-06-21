import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import axios from "../../api/Axios"; // ✅ use axios instance
import { AppContext } from "../../context/AppState";
import Footer from "../../components/footer/Footer";

// ✅ Theme setup
const theme = createTheme({
  palette: {
    primary: {
      main: "#173334",
    },
    secondary: {
      main: "#febd2f",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            transition: "all 0.3s ease-in-out",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#febd2f",
              borderWidth: "2px",
            },
          },
        },
      },
    },
  },
});

// ✅ Country codes
const countryCodes = {
  India: "+91",
  "United Kingdom": "+44",
  Canada: "+1",
  Australia: "+61",
  Germany: "+49",
  France: "+33",
  China: "+86",
  Japan: "+81",
  Brazil: "+55",
  Mexico: "+52",
  Russia: "+7",
  Nigeria: "+234",
  "South Africa": "+27",
  Egypt: "+20",
  Spain: "+34",
  Italy: "+39",
};

const Signup = () => {
  const [user, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: "+91",
    password: "",
    confirmPassword: "",
    country: "India",
    region: "",
  });

  const { setUser } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.country && countryCodes[user.country]) {
      setUserForm((prev) => ({
        ...prev,
        countryCode: countryCodes[user.country],
      }));
    }
  }, [user.country]);

  const handleChange = (e) => {
    setUserForm({ ...user, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  // Basic form validation
  if (user.password !== user.confirmPassword) {
    setError("Passwords do not match!");
    setLoading(false);
    return;
  }

  if (user.password.length < 6) {
    setError("Password must be at least 6 characters long!");
    setLoading(false);
    return;
  }

  const formattedPhone = user.phoneNumber.replace(/\D/g, "");

  if (formattedPhone.length < 10 || formattedPhone.length > 15) {
    setError("Phone number must be between 10-15 digits.");
    setLoading(false);
    return;
  }

  const userData = {
    ...user,
    phoneNumber: formattedPhone,
  };

  try {
    const res = await axios.post("/api/user/create-user", userData);
    if (res.data.success) {
      setUser(res.data.user); // Save user to context
      await handleSuccessFlow(); // Async success sequence
    }
  } catch (err) {
    setError(err.response?.data?.msg || "Signup failed! Please try again.");
  }

  setLoading(false);
};
const handleSuccessFlow = async () => {
  setSuccess(true);
  await new Promise((r) => setTimeout(r, 3000));

  setSuccess(false);
  setShowThankYou(true);
  await new Promise((r) => setTimeout(r, 3000));

  navigate('/profile');
};


  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 64px)",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(135deg, rgba(23,51,52,0.05) 0%, rgba(254,189,47,0.1) 100%)`,
          padding: 2,
        }}
      >
        {showThankYou ? (
          <Paper
            elevation={10}
            sx={{
              padding: 4,
              maxWidth: 600,
              width: "100%",
              textAlign: "center",
              borderRadius: "20px",
              animation: "slideIn 0.5s ease-out",
              "@keyframes slideIn": {
                "0%": {
                  opacity: 0,
                  transform: "translateY(-20px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            <Typography variant="h3" color="secondary" fontWeight="bold">
              Thank You!
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mb: 3 }}>
              Your account has been created successfully.
            </Typography>
            <Box
              component="img"
              src="/welcome-image.png"
              alt="Welcome"
              sx={{ width: "60%", height: "auto", mb: 3 }}
            />
            <Typography>Redirecting you to the profile page...</Typography>
          </Paper>
        ) : (
          <Paper
            elevation={10}
            sx={{
              padding: 4,
              maxWidth: 600,
              width: "100%",
              textAlign: "center",
              borderRadius: "20px",
              background: "white",
              animation: "slideRight 0.5s ease-out",
              "@keyframes slideRight": {
                "0%": {
                  opacity: 0,
                  transform: "translateX(-20px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateX(0)",
                },
              },
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              fontWeight="bold"
              color="primary"
            >
              Create Your Account
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={user.firstName}
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={user.lastName}
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  required
                />
              </Box>

              <TextField
                label="Email"
                name="email"
                type="email"
                value={user.email}
                fullWidth
                margin="normal"
                onChange={handleChange}
                required
              />

              <FormControl
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                }}
              >
                <InputLabel id="country-label">Country</InputLabel>
                <Select
                  labelId="country-label"
                  name="country"
                  value={user.country}
                  onChange={handleChange}
                  label="Country"
                  required
                >
                  {Object.keys(countryCodes).map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <TextField
                  label="Code"
                  value={user.countryCode}
                  InputProps={{ readOnly: true }}
                  sx={{ width: "30%" }}
                />
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={user.phoneNumber}
                  fullWidth
                  onChange={handleChange}
                  required
                  helperText="Enter digits only"
                />
              </Box>

              <TextField
                label="Region/State"
                name="region"
                value={user.region}
                fullWidth
                margin="normal"
                onChange={handleChange}
                required
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={user.password}
                fullWidth
                margin="normal"
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={user.confirmPassword}
                fullWidth
                margin="normal"
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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

              <Box mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    borderRadius: "30px",
                    py: 1.5,
                    backgroundColor: "#173334",
                    "&:hover": {
                      backgroundColor: "#0c1c1d",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Box>

              <Typography variant="body2" mt={2}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#febd2f",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Login here
                </Link>
              </Typography>
            </form>
          </Paper>
        )}

        {/* Success Snackbar Alert */}
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="success"
            sx={{ 
              width: "100%", 
              backgroundColor: "#4caf50", 
              color: "white",
              fontSize: "16px",
              fontWeight: "bold"
            }}
            onClose={() => setSuccess(false)}
          >
            🎉 Account created successfully! Welcome aboard!
          </Alert>
        </Snackbar>

        {/* Error Snackbar Alert */}
        <Snackbar
          open={!!error}
          autoHideDuration={5000}
          onClose={() => setError("")}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity="error" 
            sx={{ 
              width: "100%",
              fontSize: "16px"
            }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
      <Footer />
    </ThemeProvider>
  );
};

export default Signup;