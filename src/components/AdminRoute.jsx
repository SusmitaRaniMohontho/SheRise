import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          setStatus("denied");
          return;
        }

        const data = await response.json();

        if (data.systemRole === "admin") {
          setStatus("allowed");
        } else {
          setStatus("denied");
        }
      } catch (error) {
        setStatus("denied");
      }
    };

    checkAdmin();
  }, []);

  if (status === "loading") {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontSize: "18px",
        }}
      >
        Checking admin access...
      </div>
    );
  }

  if (status !== "allowed") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
