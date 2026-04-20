import React, { useLayoutEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { flushSync } from "react-dom";

interface ViewTransitionManagerProps {
  children: (location: ReturnType<typeof useLocation>) => React.ReactNode;
}

/**
 * ViewTransitionManager wraps the routing logic to apply the View Transitions API
 * whenever the location changes, including browser back/forward buttons.
 * 
 * It works by maintaining a local 'displayLocation' state and only updating it
 * inside a document.startViewTransition callback.
 */
export const ViewTransitionManager: React.FC<ViewTransitionManagerProps> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const prevLocationPathname = useRef(location.pathname);

  useLayoutEffect(() => {
    // If the location hasn't changed, do nothing
    if (location.pathname === prevLocationPathname.current) {
        return;
    }

    prevLocationPathname.current = location.pathname;

    // Fallback for browsers that don't support View Transitions API
    if (!document.startViewTransition) {
      setDisplayLocation(location);
      return;
    }

    // Trigger the view transition
    const transition = document.startViewTransition(() => {
      // Synchronously update the location state so the browser captures the change
      flushSync(() => {
        setDisplayLocation(location);
      });
    });

    // Optional: handle transition cleanup or specific logic here
    return () => {
        // transition.skipTransition(); // if needed
    };
  }, [location]);

  // Render children with the displayLocation (which updates with transitions)
  return <>{children(displayLocation)}</>;
};
