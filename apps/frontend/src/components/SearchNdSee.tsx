import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../helpers/api";
import Popup from "./Popup";

type GetUsersType = {
  Id: number;
  name: string;
  isAcceptingPayments: boolean;
};

export default function SearchNdSee() {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState<GetUsersType[]>([]);
  const [loading, setLoading] = useState(true);
  const [authBlocked, setAuthBlocked] = useState(false);
  const [popup, setPopup] = useState({
    type: "info" as "info" | "error",
    message: "",
  });

  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const getUsers = async (value: string) => {
    try {
      setLoading(true);
      const result = await api.get("/get-user-list", { params: { value } });
      setUsers(result.data.users || []);
      setAuthBlocked(false);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Please sign in to view users.";
      setUsers([]);
      setAuthBlocked(true);
      setPopup({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers("");

    return () => {
      if (t.current) clearTimeout(t.current);
    };
  }, []);

  return (
    <div className="relative flex h-full min-h-[780px] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <Popup
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, message: "" })}
      />

      <div
        className={`flex h-full flex-col ${
          authBlocked ? "pointer-events-none select-none blur-sm" : ""
        }`}
      >
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Send payment
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              Search a verified receiver and start a secure transfer.
            </p>
          </div>

          <Link
            to="/transfers"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
          >
            View transfers
          </Link>
        </div>

        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold outline-none transition focus:border-slate-400 focus:bg-white"
          placeholder="Search user by name..."
          type="text"
          value={input}
          disabled={authBlocked}
          onChange={(e) => {
            const targetValue = e.target.value;
            setInput(targetValue);

            clearTimeout(t.current);
            t.current = setTimeout(() => getUsers(targetValue), 450);
          }}
        />

        <div className="mt-5 flex flex-1 flex-col rounded-2xl border border-slate-100 bg-slate-50 p-3">
          {loading ? (
            <div className="grid flex-1 place-items-center text-sm font-bold text-slate-500">
              Loading users...
            </div>
          ) : users.length ? (
            users.map((user) => <UserBar key={user.Id} {...user} />)
          ) : (
            <div className="grid flex-1 place-items-center text-center">
              <div>
                <p className="text-lg font-black text-slate-800">
                  No users found
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Try another name or create another verified user.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {authBlocked && (
        <div className="absolute inset-0 grid place-items-center rounded-3xl bg-white/70 p-6 backdrop-blur-sm">
          <div className="max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl">
            <p className="text-2xl font-black text-slate-950">
              Sign in required
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              User search and transfer records are hidden until you are logged
              in.
            </p>

            <div className="mt-5 flex justify-center gap-3">
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
          </div>
        </div>
      )}
    </div>
  );
}

function UserBar({ name, isAcceptingPayments, Id }: GetUsersType) {
  const navigate = useNavigate();

  return (
    <div className="mb-3 flex w-full flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center">
      <div>
        <p className="text-base font-black text-slate-950">{name}</p>
        <p className="text-xs font-bold text-slate-500">User ID: FP-{Id}</p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold ${
            isAcceptingPayments
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {isAcceptingPayments ? "Accepting payments" : "Not accepting"}
        </span>

        <button
          onClick={() => navigate("/transfer-money", { state: { Id, name } })}
          disabled={!isAcceptingPayments}
          className={`rounded-full px-5 py-2 text-sm font-extrabold transition ${
            isAcceptingPayments
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
          type="button"
        >
          Pay
        </button>
      </div>
    </div>
  );
}