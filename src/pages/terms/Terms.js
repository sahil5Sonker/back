import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import axios from "../../api/Axios"; // ✅ Use centralized Axios instance

const Terms = () => {
  const [terms, setTerms] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await axios.get("/api/terms/getterms");
        setTerms(res.data);
      } catch (error) {
        console.error("Failed to fetch Terms & Conditions", error);
      }
    };

    fetchTerms();
  }, []);

  if (!terms) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box
        sx={{
          backgroundColor: "#173334",
          color: "#febd2f",
          borderRadius: 3,
          textAlign: "center",
          py: 5,
          px: 3,
          mb: 4,
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          {terms.title}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="body1" sx={{ color: "gray", whiteSpace: "pre-line" }}>
          {terms.content}
        </Typography>
      </Paper>
    </Container>
  );
};

export default Terms;
