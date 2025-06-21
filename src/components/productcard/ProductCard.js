// components/productcard/ProductCard.jsx
import React from "react";

const ProductCard = ({ product, onAddToCart }) => {
  // Correct image URL handling
  const getImageUrl = () => {
    if (product.image.startsWith("http")) {
      return product.image;
    }
    // Ensure leading slash for relative paths
    return `http://localhost:5000/${product.image.startsWith("/") ? product.image.slice(1) : product.image}`;
  };

  return (
    <div style={{ border: "1px solid grey", padding: "10px", margin: "10px", width: "250px" }}>
      <img
        src={getImageUrl()}
        alt={product.title}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>
      <button onClick={() => onAddToCart(product._id)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
