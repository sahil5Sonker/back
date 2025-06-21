import React, { useEffect, useState, useContext } from "react";
import api from "../../api/Axios"; // ✅ custom axios instance
import { AppContext } from "../../context/AppState"; // ✅ global state

const OrdersPage = () => {
  const { user } = useContext(AppContext); // optional use
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await api.get("/api/user/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setOrders(res.data.orders || []);
      } else {
        alert(res.data.msg || "Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>My Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>You have no orders.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "20px",
            }}
          >
            <h4>Order ID: {order._id}</h4>
            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Status: <strong>{order.status}</strong></p>
            <p>Payment Type: {order.paymentType}</p>
            <p>Total Amount: ₹{order.totalAmount}</p>
            <h5>Shipping Address:</h5>
            <p>
              {order.firstName}{" "}
              {order.lastName !== "NULL" ? order.lastName : ""}
              <br />
              {order.address},{" "}
              {order.address2 !== "NULL" ? order.address2 + "," : ""}
              <br />
              {order.city}, {order.state} - {order.zip}
            </p>
            <h5>Products:</h5>
            <ul>
              {order.products.map((item) => (
                <li
                  key={item.product._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={
                      item.product.image.startsWith("http")
                        ? item.product.image
                        : `http://localhost:5000${item.product.image}`
                    }
                    alt={item.product.title}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      marginRight: "10px",
                      borderRadius: "4px",
                    }}
                  />
                  <div>
                    <p style={{ margin: "0", fontWeight: "bold" }}>
                      {item.product.title}
                    </p>
                    <p style={{ margin: "0" }}>Quantity: {item.quantity}</p>
                    <p style={{ margin: "0" }}>Price: ₹{item.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
