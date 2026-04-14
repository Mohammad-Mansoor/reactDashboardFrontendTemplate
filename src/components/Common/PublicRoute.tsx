import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import agent from "../../agent";
import { logout } from "../../store/slices/authSlice";

const PublicRoute = () => {
  const { accessToken } = useSelector((state: any) => state.auth);
  const [isValidating, setIsValidating] = useState(!!accessToken);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const validateToken = async () => {
      if (accessToken) {
        try {
          await agent.get("/platform-users/me/roles");
          setIsTokenValid(true);
        } catch (error) {
          setIsTokenValid(false);
          // If token is invalid, clear it
          dispatch(logout());
        } finally {
          setIsValidating(false);
        }
      } else {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [accessToken, dispatch]);

  if (isValidating) {
    // Show nothing or a loader while validating
    return null; 
  }

  if (accessToken && isTokenValid) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
