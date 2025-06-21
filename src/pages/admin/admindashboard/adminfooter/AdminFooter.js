import React, { useEffect, useState } from "react";
import {  TextField, Button, Typography, Grid, Paper, Snackbar, Alert, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminShopLinks from "./AdminShoplinks";

export default function AdminFooter() {
  const [footerData, setFooterData] = useState({
    companyName: "",
    companyTagline: "",
    address: "",
    email: "",
    phone: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: ""
    },
    legalLinks: []
  });

  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Fetch existing footer data
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/footer/getfooter");
        if (!res.ok) throw new Error("Cannot load footer data");
        const data = await res.json();
        setFooterData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFooter();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in footerData.socialLinks) {
      setFooterData({ ...footerData, socialLinks: { ...footerData.socialLinks, [name]: value } });
    } else {
      setFooterData({ ...footerData, [name]: value });
    }
  };

  // ✅ Add new legal link
  const handleAddLegalLink = () => {
    if (!newLink.title || !newLink.url) return;
    setFooterData({
      ...footerData,
      legalLinks: [...footerData.legalLinks, newLink]
    });
    setNewLink({ title: "", url: "" });
  };

  // ✅ Remove legal link
  const handleRemoveLegalLink = (index) => {
    const updatedLinks = footerData.legalLinks.filter((_, i) => i !== index);
    setFooterData({ ...footerData, legalLinks: updatedLinks });
  };

  // ✅ Submit update
// ✅ Correct version
const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token"); // assume admin token
    const res = await fetch("http://localhost:5000/api/footer/updatefooter", {   // 👈 assign result
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(footerData)
    });
    if (!res.ok) throw new Error("Update failed");
    setMessage("Footer updated successfully");
  } catch (err) {
    setError(err.message);
  }
};


  return (<>
   <Paper sx={{ p: 4, maxWidth: "800px", margin: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>Admin Footer Management</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}><TextField fullWidth label="Company Name" name="companyName" value={footerData.companyName} onChange={handleChange} /></Grid>
        <Grid item xs={12}><TextField fullWidth label="Company Tagline" name="companyTagline" value={footerData.companyTagline} onChange={handleChange} /></Grid>
        <Grid item xs={12}><TextField fullWidth label="Address" name="address" value={footerData.address} onChange={handleChange} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="Email" name="email" value={footerData.email} onChange={handleChange} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="Phone" name="phone" value={footerData.phone} onChange={handleChange} /></Grid>

        {/* Social Links */}
        <Grid item xs={12}><Typography variant="h6">Social Links</Typography></Grid>
        {["facebook", "twitter", "instagram", "linkedin"].map((platform) => (
          <Grid item xs={6} key={platform}>
            <TextField fullWidth label={platform.charAt(0).toUpperCase() + platform.slice(1)} name={platform} value={footerData.socialLinks[platform]} onChange={handleChange} />
          </Grid>
        ))}

        {/* Legal Links */}
        <Grid item xs={12}><Typography variant="h6" sx={{ mt: 2 }}>Legal Links</Typography></Grid>
        {footerData.legalLinks.map((link, index) => (
          <Grid item xs={12} key={index} sx={{ display: "flex", alignItems: "center" }}>
            <TextField sx={{ flexGrow: 1, mr: 1 }} label="Title" value={link.title} disabled />
            <TextField sx={{ flexGrow: 2, mr: 1 }} label="URL" value={link.url} disabled />
            <IconButton onClick={() => handleRemoveLegalLink(index)} color="error"><DeleteIcon /></IconButton>
          </Grid>
        ))}

        {/* Add new link */}
        <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
          <TextField sx={{ flexGrow: 1, mr: 1 }} label="New Link Title" value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} />
          <TextField sx={{ flexGrow: 2, mr: 1 }} label="New Link URL" value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} />
          <Button variant="contained" onClick={handleAddLegalLink}>Add</Button>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>Update Footer</Button>
        </Grid>
      </Grid>

      {/* Success + Error messages */}
      <Snackbar open={!!message} autoHideDuration={3000} onClose={() => setMessage("")}>
        <Alert severity="success">{message}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Paper>
    <AdminShopLinks/>
  </>

   
  );
}
