import React, { useEffect, useState } from "react";
import axios from "../../../api/Axios"; // adjust path if needed

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]); // Add this line

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/product/get");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/category/get");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Fetch categories error:", err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Filter products based on selected category
  useEffect(() => {
    setFilteredProducts(
      selectedCategory
        ? products.filter((prod) => prod.category?._id === selectedCategory)
        : products
    );
  }, [selectedCategory, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("price", parseFloat(price) || 0);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const endpoint = editId
        ? `/api/product/update/${editId}`
        : `/api/product/add`;

      const method = editId ? axios.put : axios.post;
      const res = await method(endpoint, formData, config);

      alert(res.data.message || "Success");

      // Reset form
      setTitle("");
      setDescription("");
      setQuantity("");
      setPrice("");
      setCategory("");
      setImage(null);
      setEditId(null);
      document.querySelector('input[type="file"]').value = null;
      fetchProducts();
    } catch (err) {
      console.error("Submit error:", err.message);
    }
  };

  const handleEdit = (prod) => {
    setEditId(prod._id);
    setTitle(prod.title);
    setPrice(prod.price);
    setDescription(prod.description);
    setQuantity(prod.quantity);
    setCategory(prod.category._id);
    setImage(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (err) {
        console.error("Delete error:", err.message);
      }
    }
  };

  const handleAssignProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      // Check if the product is already assigned to a category
      const product = products.find((p) => p._id === productId);
      const currentCategoryId = product?.category?._id;

      // Unassign the product from the current category (if any)
      if (currentCategoryId && currentCategoryId !== selectedCategory) {
        await axios.post(
          "/api/category/unassign-product",
          {
            categoryId: currentCategoryId,
            productId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Assign the product to the new category
      const res = await axios.post(
        "/api/category/assign-product",
        {
          categoryId: selectedCategory,
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message);

      // Fetch updated products
      await fetchProducts();
    } catch (err) {
      console.error("Assign product error:", err.message);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "40px" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "30px" }}>
        🛠️ Admin: Product Management
      </h2>

      {/* Category Filter */}
      <div style={{ marginBottom: "30px", display: "flex", alignItems: "center" }}>
        <label style={{ fontWeight: "bold" }}>Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            marginLeft: "15px",
            padding: "8px 12px",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add/Edit Product Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "50px",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          background: "#f9f9f9",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>
          {editId ? "✏️ Edit Product" : "➕ Add Product"}
        </h3>
        <input
          type="text"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            display: "block",
            marginBottom: "15px",
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{
            display: "block",
            marginBottom: "15px",
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            minHeight: "80px",
          }}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          style={{
            display: "block",
            marginBottom: "15px",
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={{
            display: "block",
            marginBottom: "15px",
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{
            display: "block",
            marginBottom: "15px",
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ display: "block", marginBottom: "15px" }}
        />
        <button
          type="submit"
          style={{
            background: "#007bff",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th style={{ padding: "12px" }}>Image</th>
              <th style={{ padding: "12px" }}>Title</th>
              <th style={{ padding: "12px" }}>Category</th>
              <th style={{ padding: "12px" }}>Price</th>
              <th style={{ padding: "12px" }}>Qty</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod, idx) => (
              <tr
                key={prod._id}
                style={{ background: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}
              >
                <td style={{ padding: "12px" }}>
                  <img
                    src={`${axios.defaults.baseURL}/${prod.image}`}
                    alt={prod.title}
                    style={{
                      width: "80px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                </td>
                <td style={{ padding: "12px" }}>{prod.title}</td>
                <td style={{ padding: "12px" }}>{prod.category?.name || "-"}</td>
                <td style={{ padding: "12px" }}>{prod.price}</td>
                <td style={{ padding: "12px" }}>{prod.quantity}</td>
                <td style={{ padding: "12px", display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button
                    onClick={() => handleEdit(prod)}
                    style={{
                      background: "#ffc107",
                      color: "#000",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod._id)}
                    style={{
                      background: "#dc3545",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
