import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInSchema } from "@repo/schemas";
import api from "../helpers/api";
import logo from "../assets/finpay-logo.png";
import Popup from "./Popup";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ type: "info" as "success" | "error" | "info", message: "" });
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const validation = signInSchema.safeParse({ email, password });
      if (!validation.success) {
        setPopup({ type: "error", message: "Enter a valid email and password." });
        return;
      }

      setLoading(true);
      const result = await api.post("/sign-in", validation.data);

      if (result.data.success) {
        setPopup({ type: "success", message: "Signin successful. Opening FinPay..." });
        setTimeout(() => navigate("/"), 500);
      } else {
        setPopup({ type: "error", message: result.data.message || "Signin failed." });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Internal server error";
      setPopup({ type: "error", message: `Signin failed: ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 text-slate-950">
      <Popup
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, message: "" })}
      />

      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 flex items-center gap-3">
          <img src={logo} className="h-11 w-11 rounded-xl" alt="finpay-logo" />
          <div>
            <p className="text-2xl font-black tracking-tight">FinPay</p>
            <p className="text-sm font-bold text-slate-500">Welcome back</p>
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Access users, payments, and transaction records.
        </p>

        <div className="mt-7 space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold outline-none focus:border-slate-400 focus:bg-white"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold outline-none focus:border-slate-400 focus:bg-white"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleClick}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-4 text-sm font-extrabold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            type="button"
          >
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm font-semibold text-slate-500">
          New to FinPay?{" "}
          <Link className="font-black text-slate-950" to="/sign-up">
            Create account
          </Link>
        </p>
      </section>
    </main>
  );
}