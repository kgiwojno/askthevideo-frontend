import { useState, useCallback } from "react";
import { authenticateAdmin } from "@/lib/admin-api";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  const [token, setToken] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthenticate = useCallback(async (inputToken: string): Promise<boolean> => {
    try {
      const valid = await authenticateAdmin(inputToken);
      if (valid) {
        setToken(inputToken);
        setAuthenticated(true);
      }
      return valid;
    } catch {
      return false;
    }
  }, []);

  const handleAuthError = useCallback(() => {
    setToken(null);
    setAuthenticated(false);
  }, []);

  if (!authenticated || !token) {
    return <AdminLogin onAuthenticate={handleAuthenticate} />;
  }

  return <AdminDashboard token={token} onAuthError={handleAuthError} />;
};

export default Admin;
