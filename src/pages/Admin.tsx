import { useState, useEffect, useCallback } from "react";
import { authenticateAdmin } from "@/lib/admin-api";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

const STORAGE_KEY = "atv_admin_token";

const Admin = () => {
  const [token, setToken] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [restoring, setRestoring] = useState(true);

  // On mount, try to restore token from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setRestoring(false);
      return;
    }
    authenticateAdmin(saved)
      .then((valid) => {
        if (valid) {
          setToken(saved);
          setAuthenticated(true);
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      })
      .catch(() => {
        sessionStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setRestoring(false));
  }, []);

  const handleAuthenticate = useCallback(async (inputToken: string): Promise<boolean> => {
    try {
      const valid = await authenticateAdmin(inputToken);
      if (valid) {
        setToken(inputToken);
        setAuthenticated(true);
        sessionStorage.setItem(STORAGE_KEY, inputToken);
      }
      return valid;
    } catch {
      return false;
    }
  }, []);

  const handleAuthError = useCallback(() => {
    setToken(null);
    setAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  if (restoring) return null;

  if (!authenticated || !token) {
    return <AdminLogin onAuthenticate={handleAuthenticate} />;
  }

  return <AdminDashboard token={token} onAuthError={handleAuthError} />;
};

export default Admin;
