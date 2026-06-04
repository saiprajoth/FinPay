import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifySchema } from "@repo/schemas";
import api from "../helpers/api";
import logo from "../assets/finpay-logo.png";
import Popup from "./Popup";

export default function VerifyCode() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ type: "info" as "success" | "error" | "info", message: "" });
  const location = useLocation();
  const emailData = location.state?.email;
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const validation = verifySchema.safeParse({ email: emailData || email, otp });
      if (!validation.success) {
        setPopup({ type: "error", message: "Enter a valid email and 6-digit OTP." });
        return;
      }

      setLoading(true);
      const result = await api.post("/verify", validation.data);

      if (result.data.success) {
        setPopup({ type: "success", message: "Verification successful. Please sign in." });
        setTimeout(() => navigate("/sign-in"), 600);
      } else {
        setPopup({ type: "error", message: result.data.message || "Verification failed." });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Internal server error";
      setPopup({ type: "error", message: `Verification failed: ${errorMsg}` });
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
            <p className="text-sm font-bold text-slate-500">OTP verification</p>
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight">Verify account</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Enter the OTP sent to your email to activate payments.
        </p>

        <div className="mt-7 space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold outline-none focus:border-slate-400 focus:bg-white disabled:text-slate-500"
            type="email"
            placeholder="Email address"
            value={emailData || email}
            readOnly={Boolean(emailData)}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold tracking-[0.4em] outline-none focus:border-slate-400 focus:bg-white"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleClick}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-4 text-sm font-extrabold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            type="button"
          >
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </section>
    </main>
  );
}