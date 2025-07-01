import React from "react";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  // If it's the login page, skip layout constraints
  const isLoginPage = location.pathname === "/";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: isLoginPage ? "100%" : "1200px",
        padding: isLoginPage ? "0" : "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "#121212",
      }}
    >
      {children}
    </div>
  );
};

export default Layout;
