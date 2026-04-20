import { useNavigate, NavigateOptions, To } from "react-router-dom";
import { flushSync } from "react-dom";

/**
 * A custom hook that wraps React Router's useNavigate with the View Transitions API.
 * 
 * @returns A navigate function that triggers a view transition if supported by the browser.
 */
export const useViewTransitionNavigate = () => {
  const navigate = useNavigate();

  const viewTransitionNavigate = (to: To, options?: NavigateOptions) => {
    // Check if the browser supports the View Transitions API
    if (!document.startViewTransition) {
      return navigate(to, options);
    }

    // Trigger the view transition
    document.startViewTransition(() => {
      // Use flushSync to ensure the state update happens synchronously
      // so the browser can capture the new state for the transition
      flushSync(() => {
        navigate(to, options);
      });
    });
  };

  return viewTransitionNavigate;
};
