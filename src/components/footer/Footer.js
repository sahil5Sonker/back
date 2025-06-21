import React, { useEffect, useContext } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  IconButton,
  Paper,
  Link,
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
import { AppContext } from "../../context/AppState";
import api from "../../api/Axios"; // ✅ Central Axios instance

export default function Footer() {
  const goldColor = "#febd2f";
  const tealColor = "#173334";

  const { footerData, setFooterData } = useContext(AppContext);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await api.get("/api/footer/getfooter");
        setFooterData(res.data);
      } catch (err) {
        setError("Failed to load footer");
      }
    };

    if (!footerData) {
      fetchFooter();
    }
  }, [footerData, setFooterData]);

  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!footerData) return <Typography>Loading footer...</Typography>;

  return (
    <Paper
      elevation={6}
      sx={{
        mt: 10,
        bgcolor: tealColor,
        color: "white",
        borderRadius: "0",
        boxShadow: "0px -4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={5} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h4"
              fontWeight={800}
              gutterBottom
              sx={{ color: goldColor, fontFamily: "Poppins, Roboto" }}
            >
              {footerData.companyName}
            </Typography>
            <Typography
              variant="body1"
              color="grey.300"
              sx={{ mb: 3, fontSize: "0.95rem", lineHeight: 1.6 }}
            >
              {footerData.companyTagline}
            </Typography>
            <Box>
              {footerData.socialLinks && (
                <>
                  {[
                    ["facebook", FacebookIcon],
                    ["twitter", TwitterIcon],
                    ["instagram", InstagramIcon],
                    ["linkedin", LinkedInIcon],
                  ].map(([platform, Icon], index) => (
                    <IconButton
                      key={index}
                      href={footerData.socialLinks[platform]}
                      target="_blank"
                      sx={{
                        color: "white",
                        mx: 0.5,
                        "&:hover": {
                          transform: "scale(1.2)",
                          color: goldColor,
                          transition: "all 0.3s ease-in-out",
                        },
                      }}
                    >
                      <Icon />
                    </IconButton>
                  ))}
                </>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 700, mb: 2, letterSpacing: "0.5px" }}
            >
              Quick Links
            </Typography>
            <List dense>
              {[
                { label: "New Arrivals", to: "/new-arrivals" },
                { label: "Return Policy", to: "/return" },
                { label: "Terms & Conditions", to: "/terms" },
                { label: "Contact Us", to: "/contact" },
              ].map(({ label, to }, index) => (
                <ListItem key={index} disablePadding>
                  <RouterLink
                    to={to}
                    style={{
                      textDecoration: "none",
                      color: "white",
                      fontWeight: 500,
                      marginBottom: "10px",
                    }}
                  >
                    <Typography
                      sx={{
                        "&:hover": {
                          color: goldColor,
                          ml: 1,
                          transition: "all 0.3s ease-in-out",
                        },
                      }}
                    >
                      {label}
                    </Typography>
                  </RouterLink>
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <List dense>
              <ListItem disablePadding sx={{ alignItems: "flex-start", mb: 1 }}>
                <LocationIcon sx={{ mr: 1 }} />
                <Typography variant="body2">{footerData.address}</Typography>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
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

        <Divider sx={{ bgcolor: "grey.700", my: 5 }} />

        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="grey.400">
              © {new Date().getFullYear()} {footerData.companyName}. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              display="flex"
              justifyContent={{ xs: "center", md: "flex-end" }}
              flexWrap="wrap"
              gap={2}
            >
              {footerData.legalLinks?.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  underline="hover"
                  sx={{
                    color: "white",
                    "&:hover": {
                      color: goldColor,
                      transition: "all 0.3s ease-in-out",
                    },
                  }}
                >
                  {link.title}
                </Link>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
