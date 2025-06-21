import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../../api/Axios"; // ✅ Centralized API instance

const Return = () => {
  const [policyText, setPolicyText] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await api.get("/api/return/getpolicy");
        setPolicyText(res.data.policyText);
      } catch (error) {
        console.error("Failed to fetch policy:", error);
      }
    };

    fetchPolicy();

    // Check Admin Role
    const role = localStorage.getItem("role");
    setIsAdmin(role === "1");
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        "/api/return-policy",
        { policyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
    } catch (error) {
      console.error("Error updating policy:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight="bold" align="center" color="#173334">
        Return & Refund Policy
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        {isAdmin ? (
          <>
            <TextField
              label="Edit Return Policy"
              multiline
              rows={6}
              fullWidth
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleUpdate}
              sx={{ backgroundColor: "#febd2f", color: "#173334" }}
            >
              Update Policy
            </Button>
          </>
        ) : (
          <Typography variant="body1">{policyText}</Typography>
        )}
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Policy Updated Successfully!</Alert>
      </Snackbar>
    </Container>
  );
};

export default Return;
