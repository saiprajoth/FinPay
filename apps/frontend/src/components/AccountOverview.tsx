import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../helpers/api";
import Popup from "./Popup";

type AccountSummary = {
  Id: number;
  name: string;
  email: string;
  balance: number;
  isVerified: boolean;
  isAcceptingPayments: boolean;
  transactionCount: number;
  sentCount: number;
  receivedCount: number;
  totalSent: number;
  totalReceived: number;
};

export default function AccountOverview() {
  const [account, setAccount] = useState<AccountSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingPayments, setUpdatingPayments] = useState(false);
  const [popup, setPopup] = useState({
    type: "info" as "success" | "error" | "info",
    message: "",
  });

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true);
        const result = await api.get("/me");
        setAccount(result.data.user);
      } catch (error) {
        setAccount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  const graphItems = useMemo(() => {
    if (!account) return [];

    return [
      { label: "Balance", value: account.balance },
      { label: "Sent", value: account.totalSent },
      { label: "Received", value: account.totalReceived },
      { label: "Transfers", value: account.transactionCount },
    ];
  }, [account]);

  const maxValue = Math.max(...graphItems.map((item) => item.value), 1);

  const handlePaymentToggle = async () => {
    if (!account) return;

    try {
      setUpdatingPayments(true);

      const nextValue = !account.isAcceptingPayments;

      const result = await api.patch("/payment-settings", {
        isAcceptingPayments: nextValue,
      });

      setAccount({
        ...account,
        isAcceptingPayments: result.data.user.isAcceptingPayments,
      });

      setPopup({
        type: "success",
        message: nextValue
          ? "You are now accepting payments."
          : "You stopped accepting payments.",
      });
    } catch (error: any) {
      setPopup({
        type: "error",
        message:
          error.response?.data?.message ||
          "Could not update payment settings.",
      });
    } finally {
      setUpdatingPayments(false);
    }
  };

  if (loading) {
    return (
      <section className="h-full min-h-[780px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid h-full place-items-center text-sm font-black text-slate-500">
          Loading your account overview...
        </div>
      </section>
    );
  }

  if (!account) {
    return (
      <section className="h-full min-h-[780px] rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-700">
          Private dashboard
        </p>

        <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          Sign in to unlock your FinPay overview.
        </h1>

        <p className="mt-4 text-base font-medium leading-7 text-slate-600">
          Your balance, bank profile, and transfer graph stay hidden until you
          are logged in.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            to="/sign-in"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-extrabold text-white hover:bg-slate-800"
          >
            Sign in
          </Link>

          <Link
            to="/sign-up"
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
          >
            Register
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-full min-h-[780px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <Popup
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, message: "" })}
      />

      <div className="bg-slate-950 p-6 text-white">
        <p className="text-sm font-bold text-slate-300">My FinPay account</p>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              {account.name}
            </h1>

            <p className="mt-1 text-sm font-semibold text-slate-300">
              {account.email}
            </p>

            <p className="mt-2 w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-black text-slate-200">
              FinPay ID: FP-{account.Id}
            </p>
          </div>

          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">
            {account.isVerified ? "Verified" : "Not verified"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard label="Balance" value={`₹${account.balance}`} />

          <MetricCard
            label="Transactions"
            value={account.transactionCount.toString()}
          />

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-black text-slate-500">Payments</p>

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-2xl font-black tracking-tight text-slate-950">
                {account.isAcceptingPayments ? "On" : "Off"}
              </p>

              <button
                onClick={handlePaymentToggle}
                disabled={updatingPayments}
                className={`relative h-8 w-14 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  account.isAcceptingPayments
                    ? "bg-emerald-600"
                    : "bg-slate-300"
                }`}
                type="button"
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                    account.isAcceptingPayments ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-black text-slate-950">Money graph</p>
              <p className="text-xs font-bold text-slate-500">
                Balance, sent, received, and transfer count.
              </p>
            </div>

            <Link
              to="/transfers"
              className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-sm hover:bg-slate-100"
            >
              View records
            </Link>
          </div>

          <div className="flex h-64 items-end gap-4 rounded-2xl bg-white p-5 shadow-sm">
            {graphItems.map((item) => (
              <div
                key={item.label}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <div
                  className="min-h-3 rounded-t-2xl bg-slate-950 transition-all"
                  style={{
                    height: `${Math.max((item.value / maxValue) * 100, 8)}%`,
                  }}
                  title={`${item.label}: ${item.value}`}
                />

                <p className="mt-3 truncate text-center text-xs font-black text-slate-500">
                  {item.label}
                </p>

                <p className="text-center text-sm font-black text-slate-950">
                  {item.label === "Transfers" ? item.value : `₹${item.value}`}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <SmallCard label="Money sent" value={`₹${account.totalSent}`} />
          <SmallCard
            label="Money received"
            value={`₹${account.totalReceived}`}
          />
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

function SmallCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}