import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Fade,
  ThemeProvider,
  createTheme,
  alpha,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import api from "../../api/Axios";
import { AppContext } from "../../context/AppState"; // <-- Import context

const theme = createTheme({
  palette: {
    primary: {
      main: "#173334",
      light: "#2A4E4F",
    },
    secondary: {
      main: "#FEBD2F",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
    h4: {
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
          textTransform: "none",
          padding: "10px 0",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 10px rgba(23, 51, 52, 0.2)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "16px",
          "& .MuiOutlinedInput-root": {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#173334",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#173334",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

const Login = () => {
  const { setUser } = useContext(AppContext); // Access context
  const [loginData, setLoginData] = useState({ email: "", password: "" }); // Renamed local state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/user/login-user", loginData);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);

        setUser(res.data.user); // Set global user
        setSuccess(true);

        setTimeout(() => {
          setAnimate(false);
          setTimeout(() => {
            navigate(
              res.data.user.role === 1 ? "/admin-dashboard" : "/profile"
            );
          }, 500);
        }, 1500);
      } else {
        setError("Login failed! No token received.");
      }
    } catch (error) {
      setError(error.response?.data?.msg || "Login failed!");
    }
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.05
          )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        }}
      >
        <Navbar />
        <Container maxWidth="sm">
          <Fade in={animate} timeout={800}>
            <Paper
              elevation={6}
              sx={{
                padding: { xs: 3, sm: 4 },
                marginTop: 8,
                textAlign: "center",
                borderRadius: "24px",
                overflow: "hidden",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "6px",
                  height: "100%",
                  background: theme.palette.secondary.main,
                },
              }}
            >
              <Box mb={4}>
                <Typography
                  variant="h4"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    position: "relative",
                    display: "inline-block",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "40px",
                      height: "3px",
                      backgroundColor: theme.palette.secondary.main,
                      borderRadius: "10px",
                    },
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={2}>
                  Please log in to access your account
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: theme.palette.primary.main }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                    },
                  }}
                />
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: theme.palette.primary.main }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: theme.palette.primary.light }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                    },
                  }}
                />

                <Box sx={{ textAlign: "right", mb: 2 }}>
                  <Link
                    to="/forgot-password"
                    style={{
                      color: theme.palette.primary.main,
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    borderRadius: "12px",
                    padding: "12px 0",
                    fontSize: "1rem",
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Box
                  mt={3}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box
                    sx={{
                      height: "1px",
                      backgroundColor: alpha("#000", 0.1),
                      flexGrow: 1,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ px: 2, color: "text.secondary" }}
                  >
                    OR
                  </Typography>
                  <Box
                    sx={{
                      height: "1px",
                      backgroundColor: alpha("#000", 0.1),
                      flexGrow: 1,
                    }}
                  />
                </Box>

                <Typography variant="body2" mt={3} color="text.secondary">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    style={{
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Create Account
                  </Link>
                </Typography>
              </form>
            </Paper>
          </Fade>

          <Snackbar
            open={success}
            autoHideDuration={2000}
            onClose={() => setSuccess(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            TransitionComponent={Fade}
          >
            <Alert
              severity="success"
              variant="filled"
              sx={{
                width: "100%",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                "& .MuiAlert-icon": { fontSize: "1.25rem" },
              }}
            >
              Login Successful! Redirecting you...
            </Alert>
          </Snackbar>

          <Snackbar
            open={!!error}
            autoHideDuration={3000}
            onClose={() => setError("")}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            TransitionComponent={Fade}
          >
            <Alert
              severity="error"
              variant="filled"
              sx={{
                width: "100%",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                "& .MuiAlert-icon": { fontSize: "1.25rem" },
              }}
            >
              {error}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
      <Footer />
    </ThemeProvider>
  );
};

export default Login;
