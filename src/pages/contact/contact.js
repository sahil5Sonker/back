import React, { useState, useContext } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { AppContext } from "../../context/AppState"; // ✅ Import context
import api from "../../api/Axios"; // ✅ Centralized API instance

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useContext(AppContext); // ✅ Example of using context (if needed)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    try {
      const res = await api.post("/api/contact/getuser", formData); // ✅ use central API instance
      setSuccess(res.data.msg);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send message");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ color: "#febd2f", fontWeight: "bold", textAlign: "center", mb: 3 }}>
        Contact Us
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required fullWidth />
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} required fullWidth />
        <TextField label="Message" name="message" value={formData.message} onChange={handleChange} required multiline rows={4} fullWidth />

        <Button type="submit" variant="contained" sx={{ backgroundColor: "#173334", color: "#febd2f" }}>
          Send Message
        </Button>
      </Box>
    </Container>
  );
};

export default Contact;
