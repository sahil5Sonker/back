// App.jsx
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages and Components
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import Login from "./pages/signup/Login";
import Profile from "./pages/signup/Profile";
import AppLayout from "./layouts/AppLayout";
import Cart from "./pages/cart/Cart";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/admindashboard/AdminDashboard";
import Address from "./pages/user/Address";
import Wishlist from "./pages/user/Wishlist";
import Checkout from "./pages/cart/Checkout";
import AllProducts from "./pages/product/AllProducts";
import About from "./pages/about/About";
import Contact from "./pages/contact/contact";
import Return from "./pages/return/Return";
import Terms from "./pages/terms/Terms";
import CategoryList from "./pages/category/CategoryList";
import ProductList from "./pages/product/ProductList";
import CategoryProducts from "./components/categoryfilter/CategoryProducts";
import ProductDetails from "./pages/product/ProductDetails";
import NewArrivalsLinks from "./components/footer/NewArrivalsLink";
import OrderSuccess from "./pages/cart/OrderSuccess";
import AllOrder from "./pages/cart/AllOrder";
import BestSellerAll from "./pages/home/bestseller/BestSellerAll";
import SpecialOfferAll from "./pages/home/specialoffer/SpecialOfferAll";

// ✅ Admin route guard
const PrivateAdminRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("Token:", token);
  console.log("Role:", role);

  return token && role === "1" ? element : <Navigate to="/admin-login" replace />;
};

// ✅ Router structure
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/category/:categoryId/products", element: <CategoryList /> },
      { path: "/categories/:id", element: <CategoryProducts /> },
      { path: "/product/:id", element: <ProductDetails /> },
      { path: "/allproducts", element: <AllProducts /> },
      { path: "/productlist", element: <ProductList /> },
      { path: "/address", element: <Address /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/ordersucess", element: <OrderSuccess /> },
      { path: "/Allordersucess", element: <AllOrder /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/return", element: <Return /> },
      { path: "/terms", element: <Terms /> },
      { path: "/new-arrivals", element: <NewArrivalsLinks /> },
      { path: "/allbestsellers", element: <BestSellerAll /> },
      { path: "/allspecialoffer", element: <SpecialOfferAll /> },
    ],
  },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/profile", element: <Profile /> },
  { path: "/admin-login", element: <AdminLogin /> },
  {
    path: "/admin-dashboard",
    element: <PrivateAdminRoute element={<AdminDashboard />} />,
  },
]);

// ✅ App component
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default App;
