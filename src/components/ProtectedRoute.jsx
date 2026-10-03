import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    //send request with cookie to backend and check
    fetch("http://localhost:5000/api/auth/profile", {
      method: "GET",
      credentials: "include", //for HttpOnly cookie send
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  // cookie check howa obdhi loading dekhabe
  if (isAuthenticated === null) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
        Loading...
      </div>
    );
  }

  // login kora thakle vtrer page dekhabe, na thakle login e pathiye dbe
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
