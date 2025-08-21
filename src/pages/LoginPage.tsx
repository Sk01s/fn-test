import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthError,
} from "firebase/auth";
import { auth } from "../firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("testuser@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper to detect emulator environment (only auto-create in local dev)
  const isLocalEmulator = () =>
    typeof window !== "undefined" && window.location.hostname === "localhost";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      // try to sign in
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      return;
    } catch (rawErr) {
      console.warn("Sign-in failed:", rawErr);

      // Narrow error to get code safelyaaasss
      const code =
        (rawErr as AuthError | any)?.code ?? (rawErr as any)?.message ?? "";

      // If user not found and we're running locally, create it directly in the emulator
      if (
        (code === "auth/user-not-found" ||
          String(code).toLowerCase().includes("user-not-found") ||
          String(code).toLowerCase().includes("email_not_found") ||
          String(code).toLowerCase().includes("email-not-found")) &&
        isLocalEmulator()
      ) {
        try {
          setInfo(
            "Account not found — creating account in the Auth emulator..."
          );
          // Create account with client SDK — this will create in emulator when connected
          const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          // createUserWithEmailAndPassword automatically signs the user in,
          // so you can navigate immediately
          console.log("✅ Created user in emulator:", credential.user.uid);
          navigate("/");
          return;
        } catch (createErr) {
          console.error("Failed to create user in emulator:", createErr);
          if (createErr instanceof Error) setError(createErr.message);
          else setError("Failed to create account in emulator.");
          return;
        } finally {
          setLoading(false);
          setInfo(null);
        }
      }

      // Other errors: show friendly message
      if (rawErr instanceof Error) {
        setError(rawErr.message);
      } else {
        setError("Sign in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Login
        </h1>

        {info && (
          <div className="bg-blue-50 text-blue-700 p-2 rounded mb-4 text-sm">
            {info}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link to="/" className="text-indigo-600 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
