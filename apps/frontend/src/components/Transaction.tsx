import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { transactionSchema } from "@repo/schemas";
import api from "../helpers/api";
import Popup from "./Popup";

export default function Transaction() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ type: "info" as "success" | "error" | "info", message: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.Id;
  const name = location.state?.name;

  const handleClick = async () => {
    try {
      const validation = transactionSchema.safeParse({
        amount: Number(amount),
        recipientId: Number(id),
      });

      if (!validation.success) {
        setPopup({ type: "error", message: "Enter a valid amount before sending money." });
        return;
      }

      setLoading(true);
      const result = await api.post("/transactions/create-transaction", validation.data);

      if (result.data.success) {
        setPopup({ type: "success", message: "Payment sent successfully." });
        setAmount("");
        setTimeout(() => navigate("/transfers"), 700);
      } else {
        setPopup({ type: "error", message: result.data.message || "Transaction failed." });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Internal server error";
      setPopup({ type: "error", message: `Transaction failed: ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  if (!id || !name) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-950">
        <section className="max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl">
          <p className="text-3xl font-black">No receiver selected</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
            Direct access to this payment screen is blocked. Search a user from
            the home page and click Pay to start a valid transfer.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-extrabold text-white hover:bg-slate-800"
          >
            Go to user search
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 text-slate-950">
      <Popup
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, message: "" })}
      />

      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <Link to="/" className="text-sm font-black text-slate-500 hover:text-slate-950">
          ← Back to users
        </Link>

        <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
          <p className="text-sm font-bold text-slate-300">Sending money to</p>
          <p className="mt-1 text-3xl font-black tracking-tight">{name}</p>
          <p className="mt-2 text-sm font-bold text-slate-300">Receiver ID: FP-{id}</p>
        </div>

        <div className="mt-7">
          <label className="text-sm font-black text-slate-700">Amount</label>
          <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-slate-400 focus-within:bg-white">
            <span className="text-lg font-black text-slate-500">₹</span>
            <input
              className="w-full bg-transparent px-3 py-4 text-xl font-black outline-none"
              type="number"
              min="1"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleClick}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-4 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          type="button"
        >
          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
          {loading ? "Processing payment..." : "Send payment"}
        </button>
      </section>
    </main>
  );
}