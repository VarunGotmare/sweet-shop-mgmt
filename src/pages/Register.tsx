import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { useAuth } from "../auth/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await registerUser({ name, email, password });

      // Auto-login after successful registration
      login(res.token, res.user);

      // Redirect based on role
      if (res.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl bg-zinc-900 p-6"
      >
        <h1 className="text-2xl font-bold text-center text-pink-500">
          Register
        </h1>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-pink-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-pink-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-pink-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-pink-600 py-2 font-semibold text-white hover:bg-pink-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-center text-zinc-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer text-pink-500 hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
