import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import agent from "../../agent";

const ProtectedRoute = () => {
  const { accessToken } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (accessToken) {
      // Small request to check if backend is alive and token is valid
      // The interceptor in agent/index.ts will handle the logout if this fails
      agent.get("/platform-users/me").catch(() => {
        // Interceptor handles the redirect, but we catch to avoid unhandled promise rejection
      });
    }
  }, [accessToken]);

  // Temporarily disabled authentication to allow dashboard access
  // if (!accessToken) {
  //   return <Navigate to="/signin" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;
