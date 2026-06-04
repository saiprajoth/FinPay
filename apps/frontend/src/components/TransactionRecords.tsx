import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../helpers/api";
import Popup from "./Popup";

type TransactionRecord = {
  Id: number;
  amount: number;
  createdAt: string;
  senderId: number;
  recipientId: number;
  senderName: string;
  recipientName: string;
  type: "sent" | "received";
};

export default function TransactionRecords() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [authBlocked, setAuthBlocked] = useState(false);
  const [popup, setPopup] = useState({
    type: "info" as "success" | "error" | "info",
    message: "",
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const result = await api.get("/transactions/get-transactions");

        if (result.data.success) {
          setTransactions(result.data.transactions || []);
          setAuthBlocked(false);
        } else {
          setPopup({
            type: "error",
            message: result.data.message || "Could not load transfers.",
          });
        }
      } catch (error: any) {
        const errorMsg =
          error.response?.data?.message || "Please sign in to view transfers.";
        setAuthBlocked(true);
        setPopup({ type: "error", message: errorMsg });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const totalSent = transactions
    .filter((txn) => txn.type === "sent")
    .reduce((sum, txn) => sum + txn.amount, 0);

  const totalReceived = transactions
    .filter((txn) => txn.type === "received")
    .reduce((sum, txn) => sum + txn.amount, 0);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Popup
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, message: "" })}
      />

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Transfers</h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Complete record of money you sent and received.
            </p>
          </div>

          <Link
            to="/"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-extrabold text-white hover:bg-slate-800"
          >
            New payment
          </Link>
        </div>

        <div
          className={authBlocked ? "pointer-events-none select-none blur-sm" : ""}
        >
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <StatCard
              label="Total records"
              value={transactions.length.toString()}
            />
            <StatCard label="Money sent" value={`₹${totalSent}`} />
            <StatCard label="Money received" value={`₹${totalReceived}`} />
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <p className="text-xl font-black">Transaction history</p>
              <p className="text-sm font-semibold text-slate-500">
                Sorted by latest transaction first.
              </p>
            </div>

            {loading ? (
              <div className="grid h-72 place-items-center text-sm font-bold text-slate-500">
                Loading transfers...
              </div>
            ) : transactions.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-black">Date</th>
                      <th className="px-6 py-4 font-black">Type</th>
                      <th className="px-6 py-4 font-black">Sender</th>
                      <th className="px-6 py-4 font-black">Recipient</th>
                      <th className="px-6 py-4 text-right font-black">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((txn) => (
                      <tr key={txn.Id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold text-slate-600">
                          {new Date(txn.createdAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              txn.type === "sent"
                                ? "bg-orange-50 text-orange-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {txn.type === "sent" ? "Sent" : "Received"}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-black text-slate-800">
                          {txn.senderName}
                        </td>

                        <td className="px-6 py-4 font-black text-slate-800">
                          {txn.recipientName}
                        </td>

                        <td className="px-6 py-4 text-right text-base font-black text-slate-950">
                          ₹{txn.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid h-72 place-items-center text-center">
                <div>
                  <p className="text-lg font-black">No transfers yet</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Send or receive money to see records here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {authBlocked && (
          <div className="fixed inset-0 z-40 grid place-items-center bg-white/70 p-6 backdrop-blur-sm">
            <div className="max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl">
              <p className="text-2xl font-black">Sign in required</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                Your transaction records are hidden until you are logged in.
              </p>

              <Link
                to="/sign-in"
                className="mt-5 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-extrabold text-white hover:bg-slate-800"
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-black text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}