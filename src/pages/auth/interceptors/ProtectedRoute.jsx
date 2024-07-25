import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

// A function to check user roles
const checkRole = (roles, allowedRoles) => {
  return roles.some((role) => allowedRoles.includes(role));
};

// A function to check if the token is expired
const isTokenExpired = (token) => {
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

// ProtectedRoute component
const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token) {
    // Redirect to login if no token is found
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (isTokenExpired(token)) {
    // Redirect to login if token has expired
    localStorage.clear();
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    console.log("Ana dkhalt l token expired");
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (!user) {
    // Redirect to login if no user autenticated
    return <Navigate to="/auth/sign-in" replace />;
  }

  const decodedToken = jwtDecode(token);
  const userRoles = decodedToken.roles;

  if (!checkRole(userRoles, allowedRoles)) {
    // Redirect to not authorized page if roles do not match
    return <p>Unauthorized</p>;
  }

  // Render the child components (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
