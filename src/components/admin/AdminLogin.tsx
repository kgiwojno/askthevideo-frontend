import { useState, useEffect, useRef } from "react";
import { Lock } from "lucide-react";

const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;
const STORAGE_KEY_LOCKOUT = "atv_admin_lockout";
const STORAGE_KEY_FAILS = "atv_admin_fails";

function getStoredFailCount(): number {
  try {
    return parseInt(sessionStorage.getItem(STORAGE_KEY_FAILS) || "0", 10) || 0;
  } catch {
    return 0;
  }
}

function setStoredFailCount(count: number) {
  try { sessionStorage.setItem(STORAGE_KEY_FAILS, String(count)); } catch {}
}

function getStoredLockoutRemaining(): number {
  try {
    const expiresAt = parseInt(sessionStorage.getItem(STORAGE_KEY_LOCKOUT) || "0", 10);
    if (!expiresAt) return 0;
    const remaining = Math.ceil((expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
}

function setStoredLockoutExpiry() {
  try {
    sessionStorage.setItem(STORAGE_KEY_LOCKOUT, String(Date.now() + LOCKOUT_SECONDS * 1000));
  } catch {}
}

function clearStoredLockout() {
  try {
    sessionStorage.removeItem(STORAGE_KEY_LOCKOUT);
    sessionStorage.removeItem(STORAGE_KEY_FAILS);
  } catch {}
}

interface AdminLoginProps {
  onAuthenticate: (token: string) => Promise<boolean>;
}

const AdminLogin = ({ onAuthenticate }: AdminLoginProps) => {
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failCount, setFailCount] = useState(getStoredFailCount);
  const [lockoutRemaining, setLockoutRemaining] = useState(getStoredLockoutRemaining);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const locked = lockoutRemaining > 0;

  // On mount, resume countdown if lockout is active
  useEffect(() => {
    if (lockoutRemaining > 0) {
      timerRef.current = setInterval(() => {
        const remaining = getStoredLockoutRemaining();
        setLockoutRemaining(remaining);
        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          clearStoredLockout();
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startLockout = () => {
    setStoredLockoutExpiry();
    setLockoutRemaining(LOCKOUT_SECONDS);
    setFailCount(0);
    setStoredFailCount(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const remaining = getStoredLockoutRemaining();
      setLockoutRemaining(remaining);
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        clearStoredLockout();
      }
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || loading || locked) return;

    setLoading(true);
    setError(false);

    const valid = await onAuthenticate(token.trim());
    if (!valid) {
      const newCount = failCount + 1;
      setFailCount(newCount);
      setStoredFailCount(newCount);
      setError(true);
      setLoading(false);
      if (newCount >= MAX_ATTEMPTS) {
        startLockout();
      }
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
          disabled={locked}
          className={`w-full bg-card border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            error ? "border-destructive" : "border-border"
          }`}
        />

        {error && !locked && (
          <p className="text-destructive text-sm text-center">
            Invalid token{failCount > 0 && ` (${MAX_ATTEMPTS - failCount} attempts remaining)`}
          </p>
        )}

        {locked && (
          <p className="text-destructive text-sm text-center">
            Too many failed attempts. Try again in {lockoutRemaining}s
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !token.trim() || locked}
          className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Verifying..." : locked ? `Locked (${lockoutRemaining}s)` : "Enter"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
