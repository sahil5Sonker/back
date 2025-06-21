import React, { useEffect, useState } from "react";
import axios from "../../../api/Axios"; // ✅ Axios instance
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

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/category/get");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      const endpoint = editId
        ? `/api/category/update/${editId}`
        : `/api/category/add`;

      const method = editId ? axios.put : axios.post;
      const res = await method(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message || (editId ? "Updated" : "Added") + " successfully");

      setName("");
      setImage(null);
      setEditId(null);
      document.querySelector('input[type="file"]').value = null;

      fetchCategories();
    } catch (err) {
      console.error("Submit error:", err.message);
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setName(cat.name);
    setImage(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this category?")) {
      try {
        await axios.delete(`/api/category/delet/${id}`);
        fetchCategories();
      } catch (err) {
        console.error("Delete error:", err.message);
      }
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: "1000px", mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Admin: Manage Categories
      </Typography>

      {/* Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {editId ? "Update Category" : "Add Category"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Category Table */}
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Products</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat._id}>
                <TableCell>
                  {cat.image ? (
                    <img
                      src={`${axios.defaults.baseURL}/uploads/category/${cat.image}?t=${Date.now()}`}
                      alt={cat.name}
                      width="80"
                      height="60"
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.products?.length || 0}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(cat)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(cat._id)} color="error">
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

export default AdminCategory;
