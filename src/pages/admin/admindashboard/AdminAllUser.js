import React, { useEffect, useState } from "react";
import axios from "../../../api/Axios"; // Must include token interceptor
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Fade,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const AdminAllUser = () => {
  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please login as admin.");
        return;
      }

      const res = await axios.get("/api/user/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else {
        alert(res.data.message || "Unexpected user data format.");
      }
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getField = (value) => value || "N/A";

  const getRoleLabel = (role) => {
    return role === 1 || role === "1" ? "Admin" : "User";
  };

  const getRoleColor = (role) => {
    return role === 1 || role === "1" ? "warning" : "success";
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        All Registered Users
      </Typography>

      <Fade in timeout={500}>
        <Box>
          {isSmallScreen ? (
            <Grid container spacing={2}>
              {users.length === 0 ? (
                <Typography>No users found</Typography>
              ) : (
                users.map((user) => (
                  <Grid item xs={12} key={user._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography fontWeight={600}>
                          {getField(user.firstName)} {getField(user.lastName)}
                        </Typography>
                        <Typography>Email: {getField(user.email)}</Typography>
                        <Typography>Phone: {getField(user.phoneNumber)}</Typography>
                        <Typography>Country: {getField(user.country)}</Typography>
                        <Typography>Region: {getField(user.region)}</Typography>
                        <Typography>
                          Role:{" "}
                          <Chip
                            label={getRoleLabel(user.role)}
                            color={getRoleColor(user.role)}
                            size="small"
                          />
                        </Typography>
                        <Typography>
                          Registered On:{" "}
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                        <Typography>
                          Last Login:{" "}
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleString()
                            : "N/A"}
                        </Typography>
                        <Typography>
                          Last Logout:{" "}
                          {user.lastLogout
                            ? new Date(user.lastLogout).toLocaleString()
                            : "N/A"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 3, boxShadow: 3, maxHeight: "70vh", overflow: "auto" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Registered On</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Last Logout</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10}>No users found</TableCell>
                    </TableRow>
                  ) : (
                    users.map((user, index) => (
                      <TableRow
                        key={user._id}
                        sx={{
                          transition: "background 0.3s",
                          ":hover": { backgroundColor: "#f1f1f1" },
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {getField(user.firstName)} {getField(user.lastName)}
                        </TableCell>
                        <TableCell>{getField(user.email)}</TableCell>
                        <TableCell>{getField(user.phoneNumber)}</TableCell>
                        <TableCell>{getField(user.country)}</TableCell>
                        <TableCell>{getField(user.region)}</TableCell>
                        <TableCell>
                          <Chip
                            label={getRoleLabel(user.role)}
                            color={getRoleColor(user.role)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {user.lastLogout
                            ? new Date(user.lastLogout).toLocaleString()
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default AdminAllUser;
