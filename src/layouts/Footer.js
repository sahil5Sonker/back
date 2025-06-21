import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { AppContext } from "../context/AppState"; // ✅ global state
import api from "../api/Axios"; // ✅ axios instance

export default function Footer() {
  const goldColor = "#febd2f";
  const tealColor = "#173334";
  const { footerData, setFooterData } = useContext(AppContext); // ✅ use global state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await api.get("/api/footer/getfooter");
        setFooterData(res.data);
      } catch (err) {
        setError("Unable to load footer data.");
        console.error("Footer fetch error:", err);
      }
    };

    if (!footerData) {
      fetchFooter();
    }
  }, [footerData, setFooterData]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!footerData) return <Typography>Loading footer...</Typography>;

  return (
    <Paper elevation={2} sx={{ mt: 8, bgcolor: tealColor, color: goldColor }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Top Section */}
        <Grid container spacing={4} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection="column">
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".1rem",
                  color: goldColor,
                  textDecoration: "none",
                  textAlign: { xs: "center", md: "left" },
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                {footerData.companyName}
              </Typography>
              <Typography variant="subtitle1" color="#ffffff" sx={{ mb: 2 }}>
                {footerData.companyTagline}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Join our newsletter
              </Typography>
              <Box display="flex">
                <TextField
                  variant="outlined"
                  placeholder="Your email"
                  size="small"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      color: "white",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    ml: 1,
                    px: 3,
                    bgcolor: goldColor,
                    color: tealColor,
                    "&:hover": {
                      bgcolor: tealColor,
                      color: goldColor,
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.12)", my: 3 }} />

        {/* Bottom Sections */}
        <Grid container spacing={4} sx={{ py: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Shop
            </Typography>
            <List disablePadding>
              <ListItem disablePadding sx={{ pb: 0.5 }}>
                <RouterLink
                  to="/new-arrivals"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  New Arrivals
                </RouterLink>
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Connect With Us
            </Typography>
            <Box sx={{ mb: 2 }}>
              <IconButton
                href={footerData.socialLinks.facebook}
                target="_blank"
                color="inherit"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                href={footerData.socialLinks.twitter}
                target="_blank"
                color="inherit"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                href={footerData.socialLinks.instagram}
                target="_blank"
                color="inherit"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                href={footerData.socialLinks.linkedin}
                target="_blank"
                color="inherit"
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
            <List disablePadding>
              <ListItem disablePadding sx={{ pb: 0.5 }}>
                <LocationIcon sx={{ mr: 1 }} />
                <Typography variant="body2">{footerData.address}</Typography>
              </ListItem>
              <ListItem disablePadding sx={{ pb: 0.5 }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="body2">{footerData.email}</Typography>
              </ListItem>
              <ListItem disablePadding>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body2">{footerData.phone}</Typography>
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.12)", my: 3 }} />

        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body2" color="grey.400">
              © {new Date().getFullYear()} {footerData.companyName}. All rights
              reserved.
            </Typography>
          </Grid>
          <Grid item>
            <Box display="flex" gap={3}>
              {footerData.legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                  }}
                >
                  {link.title}
                </a>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
