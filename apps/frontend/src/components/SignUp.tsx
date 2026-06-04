import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userSchema } from "@repo/schemas";
import api from "../helpers/api";
import logo from "../assets/finpay-logo.png";
import Popup from "./Popup";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ type: "info" as "success" | "error" | "info", message: "" });
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const validation = userSchema.safeParse({ name, email, password });
      if (!validation.success) {
        setPopup({ type: "error", message: "Enter a valid name, email, and password." });
        return;
      }

      setLoading(true);
      const result = await api.post("/sign-up", validation.data);

      if (result.data.success) {
        setPopup({ type: "success", message: "Account created. Check your email for OTP." });
        setTimeout(() => navigate("/verify", { state: { email } }), 600);
      } else {
        setPopup({ type: "error", message: result.data.message || "Signup failed." });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Internal server error";
      setPopup({ type: "error", message: `Signup failed: ${errorMsg}` });
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
            <p className="text-sm font-bold text-slate-500">Create account</p>
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight">Register</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Create a verified account before receiving payments.
        </p>

        <div className="mt-7 space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold outline-none focus:border-slate-400 focus:bg-white"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            {loading ? "Creating account..." : "Register"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm font-semibold text-slate-500">
          Already registered?{" "}
          <Link className="font-black text-slate-950" to="/sign-in">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}