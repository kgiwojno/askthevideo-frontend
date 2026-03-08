import { useState } from "react";
import { Lock } from "lucide-react";

interface AdminLoginProps {
  onAuthenticate: (token: string) => Promise<boolean>;
}

const AdminLogin = ({ onAuthenticate }: AdminLoginProps) => {
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || loading) return;

    setLoading(true);
    setError(false);

    const valid = await onAuthenticate(token.trim());
    if (!valid) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
          <Lock className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wide uppercase">Admin Access</span>
        </div>

        <input
          type="password"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            setError(false);
          }}
          placeholder="Enter admin token"
          autoFocus
          className={`w-full bg-card border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
            error ? "border-destructive" : "border-border"
          }`}
        />

        {error && (
          <p className="text-destructive text-sm text-center">Invalid token</p>
        )}

        <button
          type="submit"
          disabled={loading || !token.trim()}
          className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Enter"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
