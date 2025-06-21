import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import api from "../../api/Axios"; // ✅ custom axios
import { AppContext } from "../../context/AppState"; // ✅ context

const AdminLogin = () => {
  const { setUserAdmin, setTokenAdmin } = useContext(AppContext); // ✅ use context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/user/login-user", {
        email,
        password,
      });

      const data = res.data;
      console.log("Login Response:", data);

      if (data.user && (data.user.role === "1" || data.user.role === 1)) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        setUserAdmin(data.user);        // ✅ set in context
        setTokenAdmin(data.token);      // ✅ set in context
        navigate("/admin-dashboard");
      } else {
        alert("Access denied: Not an admin");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid credentials or server error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          Admin Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Admin Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Admin Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2, bgcolor: "#173334", ":hover": { bgcolor: "#145555" } }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
