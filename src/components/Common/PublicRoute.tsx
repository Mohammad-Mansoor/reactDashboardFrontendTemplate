import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import agent from "../../agent";
import { logout } from "../../store/slices/authSlice";
import ElectronTitleBar from "../Header/ElectronTitleBar";
import { isElectron } from "../../utils/isElectron";

const PublicRoute = () => {
  const { accessToken } = useSelector((state: any) => state.auth);
  const [isValidating, setIsValidating] = useState(!!accessToken);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const validateToken = async () => {
      if (accessToken) {
        try {
          await agent.get("/auth/me");
          setIsTokenValid(true);
        } catch (error) {
          setIsTokenValid(false);
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
    return null;
  }

  if (accessToken && isTokenValid) {
    return <Navigate to="/" replace />;
  }

  // In Electron desktop mode: show the title bar with window controls on
  // every public page (login, forgot-password, OTP, reset-password).
  // In web/browser mode: render the outlet directly with no wrapping.
  if (isElectron()) {
    return (
      <div className="flex flex-col min-h-screen">
        <ElectronTitleBar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default PublicRoute;
