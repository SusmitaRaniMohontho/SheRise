import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

// গ্লোবাল ক্যাশ (অন্য ফাইল থেকে ব্যবহারের জন্য export করা হলো)
export let isGloballyAuthenticated = false;

export default function ProtectedRoute() {
  const [authStatus, setAuthStatus] = useState(
    isGloballyAuthenticated ? "authorized" : "checking",
  );

  useEffect(() => {
    // যদি অলরেডি অথেন্টিকেটেড থাকে, তবে বারবার ফেচ করার দরকার নেই
    if (isGloballyAuthenticated) {
      setAuthStatus("authorized");
      return;
    }

    let isMounted = true;

    const verifyCookieAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!isMounted) return;

        if (response.ok) {
          isGloballyAuthenticated = true; // ক্যাশ সেভ করলাম
          setAuthStatus("authorized");
        } else {
          isGloballyAuthenticated = false;
          setAuthStatus("unauthorized");
        }
      } catch (error) {
        if (isMounted) {
          isGloballyAuthenticated = false;
          setAuthStatus("unauthorized");
        }
      }
    };

    verifyCookieAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authStatus === "checking") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f9f6fc",
          color: "#6b46c1",
          fontSize: "1.1rem",
          fontWeight: "600",
        }}
      >
        Loading...
      </div>
    );
  }

  if (authStatus === "unauthorized") {
    return <Navigate to="/login" replace={true} />;
  }

  return <Outlet />;
}
