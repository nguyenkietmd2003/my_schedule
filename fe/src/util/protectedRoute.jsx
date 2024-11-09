import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/wrapContext";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  const isAuthenticated = auth.isAuthenticated;

  // Kiểm tra nếu người dùng đã xác thực và có vai trò phù hợp
  const hasAccess = isAuthenticated;

  return hasAccess ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
