// import axios from "axios";

// // ✅ Automatically switch base URL
// const instance = axios.create({
//   baseURL:
//     process.env.NODE_ENV === "production"
//       ? "https://back-2-ex8x.onrender.com/" // production backend
//       : "http://localhost:5000",         // local backend
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default instance;
import axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://back-5-g7tj.onrender.com";

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor to attach token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default instance;


