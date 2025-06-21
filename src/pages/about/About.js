import React, { useEffect, useContext, useState } from "react";
import { Container, Typography, Box, Grid, Paper } from "@mui/material";
import api from "../../api/Axios"; // ✅ Custom Axios instance
import { AppContext } from "../../context/AppState"; // ✅ App context

const About = () => {
  const { aboutData, setAboutData } = useContext(AppContext);
  const [error, setError] = useState(null); // ✅ Local error state

  useEffect(() => {
   const fetchAbout = async () => {
  try {
    const res = await api.get("/api/about/getabout");
    console.log("API Response:", res.data); // ✅ Log the response
    setAboutData(res.data);
  } catch (err) {
    console.error("API fetch error:", err); // ✅ Log the error
    setError("Something went wrong while fetching data.");
  }
};

    if (!aboutData) {
      fetchAbout();
    }
  }, [aboutData, setAboutData]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!aboutData) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Hero Section */}
      <Box sx={{ backgroundColor: "#febd2f", color: "#173334", borderRadius: 3, textAlign: "center", py: 5, px: 3, mb: 4 }}>
        <Typography variant="h3" fontWeight="bold">{aboutData.title}</Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>{aboutData.description}</Typography>
      </Box>

      {/* Vision & Mission */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: "#173334", color: "#febd2f" }}>
            <Typography variant="h5" fontWeight="bold">🌱 Our Vision</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{aboutData.vision}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: "#173334", color: "#febd2f" }}>
            <Typography variant="h5" fontWeight="bold">🎯 Our Mission</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{aboutData.mission}</Typography>
          </Paper>
        </Grid>

        {/* Our Story */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: "#febd2f", color: "#173334" }}>
            <Typography variant="h5" fontWeight="bold">📖 Our Story</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{aboutData.story}</Typography>
          </Paper>
        </Grid>

        {/* Why Choose Us */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: "#173334", color: "#febd2f" }}>
            <Typography variant="h5" fontWeight="bold">⭐ Why Choose Us?</Typography>
            <ul>
              {aboutData.whyChooseUs.map((point, index) => (
                <li key={index}>
                  <Typography variant="body1">{point}</Typography>
                </li>
              ))}
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;
