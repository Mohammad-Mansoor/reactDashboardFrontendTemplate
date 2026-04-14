import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Permissions {
  [resource: string]: {
    [action: string]: boolean;
  };
}

interface PermissionsContextType {
  permissions: Permissions;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<Permissions>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/permissions");
      if (!response.ok) {
        throw new Error("Failed to fetch permissions");
      }

      const data = await response.json();
      setPermissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setPermissions({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <PermissionsContext.Provider value={{ permissions, isLoading, error, refetch: fetchPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within PermissionsProvider");
  }
  return context;
}
