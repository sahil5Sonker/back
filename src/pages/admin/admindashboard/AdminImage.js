import React, { useState, useEffect } from "react";
import axios from "../../../api/Axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminImage = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  // Fetch all images
  const fetchImages = async () => {
    try {
      const res = await axios.get("/api/images/get");
      console.log("Fetched image data:", res.data);

      // Adjust depending on response structure
      const imageArray = Array.isArray(res.data)
        ? res.data
        : res.data.images || [];

      setImages(imageArray);
    } catch (err) {
      console.error("Fetch images error:", err.message);
    }
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Handle form submit
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  if (image) formData.append("image", image);

  try {
    const endpoint = editId ? `/api/images/update/${editId}` : `/api/images/add`;
    const method = editId ? axios.put : axios.post;

    const res = await method(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert(res.data.message || (editId ? "Updated" : "Added") + " successfully");
    // Reset form
    setTitle("");
    setDescription("");
    setImage(null);
    setEditId(null);
    document.querySelector('input[type="file"]').value = null;
    fetchImages();
  } catch (err) {
    console.error("Submit error:", err.message);
  }
};


  // Handle edit
  const handleEdit = (img) => {
    setEditId(img._id);
    setTitle(img.title);
    setDescription(img.description);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this image?")) {
      try {
        await axios.delete(`/api/images/${id}`);
        fetchImages();
      } catch (err) {
        console.error("Delete error:", err.message);
      }
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: "1000px", mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Admin: Manage Images
      </Typography>

      {/* Add or Edit Image Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {editId ? "Update Image" : "Add Image"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Images Table */}
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(images) &&
              images.map((img) => (
                <TableRow key={img._id}>
                  <TableCell>
                    {img.imageUrl ? (
                      <img
                        src={`${
                          window.location.origin.includes("localhost")
                            ? "http://localhost:5000"
                            : "https://back-5-g7tj.onrender.com"
                        }/uploads/images/${img.imageUrl}`}
                        alt={img.title}
                        width="80"
                        height="60"
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>

                  <TableCell>{img.title}</TableCell>
                  <TableCell>{img.description}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(img)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(img._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminImage;
