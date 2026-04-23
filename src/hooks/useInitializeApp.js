import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthData, setNotificationOptions } from "../store/slices/authSlice";
import { getMe, getNotificationOptions } from "../auth/services/authApi";

export const useInitializeApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const user = await getMe();
        dispatch(setAuthData({ user }));

        if (user && user.id) {
          const options = await getNotificationOptions(user.id);
          dispatch(setNotificationOptions(options));
        }
      } catch (error) {
        console.error("Failed to initialize app state:", error);
      }
    };

    init();
  }, [dispatch]);
};
