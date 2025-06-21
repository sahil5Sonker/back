import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Avatar,
  MenuItem
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function AdminShopLinks() {
  const [shopLinks, setShopLinks] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("new-arrival");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchShopLinks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/shoplink/getshoplink", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setShopLinks(data);
    } catch (err) {
      setError("Failed to load shop links");
    }
  };

  useEffect(() => {
    fetchShopLinks();
  }, []);

  const handleSubmit = async () => {
    if (!title || (!image && !editingId)) return setError("All fields are required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        editingId
          ? `http://localhost:5000/api/shoplink/updateShopLink/${editingId}`
          : "http://localhost:5000/api/shoplink/createShopLink",
        {
          method: editingId ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        }
      );

      if (!res.ok) throw new Error("Operation failed");
      await fetchShopLinks();
      setMessage(editingId ? "Link updated" : "Link created");
      setTitle("");
      setCategory("new-arrival");
      setImage(null);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/shoplink/deleteShopLink/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Link deleted");
      await fetchShopLinks();
    } catch (err) {
      setError("Delete failed");
    }
  };

  const handleEdit = (link) => {
    setTitle(link.title);
    setCategory(link.category);
    setEditingId(link._id);
  };

  return (
    <Paper sx={{ p: 4, maxWidth: "800px", margin: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>Manage Shop Links</Typography>

      {/* Create / Update Form */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="new-arrival">New Arrival</MenuItem>
            <MenuItem value="collection">Collection</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" component="label">
            {image ? image.name : "Upload Image"}
            <input hidden type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
            {editingId ? "Update Link" : "Create Link"}
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Existing Links</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {shopLinks.map((link) => (
            <Grid item xs={12} md={6} key={link._id}>
              <Paper sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    variant="square"
                    src={`http://localhost:5000${link.image}`}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography>{link.title}</Typography>
                    <Typography variant="caption">{link.category}</Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton onClick={() => handleEdit(link)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(link._id)} color="error"><DeleteIcon /></IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Alerts */}
      <Snackbar open={!!message} autoHideDuration={3000} onClose={() => setMessage("")}>
        <Alert severity="success">{message}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Paper>
  );
}
