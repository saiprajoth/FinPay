// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import logo from "../assets/finpay-logo.png";
// import api from "../helpers/api";

// type LoggedUser = {
//   Id: number;
//   name: string;
// };

// export default function NavBar() {
//   const cachedName = sessionStorage.getItem("finpayUserName");

//   const [user, setUser] = useState<LoggedUser | null>(
//     cachedName ? { Id: 0, name: cachedName } : null,
//   );
//   const [checkingUser, setCheckingUser] = useState(!cachedName);
//   const [loggingOut, setLoggingOut] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const result = await api.get("/me");
//         setUser(result.data.user);
//         sessionStorage.setItem("finpayUserName", result.data.user.name);
//       } catch (error) {
//         setUser(null);
//         sessionStorage.removeItem("finpayUserName");
//       } finally {
//         setCheckingUser(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       setLoggingOut(true);
//       await api.post("/logout");
//       setUser(null);
//       sessionStorage.removeItem("finpayUserName");
//       navigate("/sign-in");
//     } catch (error) {
//       console.error("logout failed", error);
//     } finally {
//       setLoggingOut(false);
//     }
//   };

//   return (
//     <header className="sticky top-3 z-30 px-4">
//       <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-3xl border border-slate-200 bg-white/95 px-5 py-3 shadow-sm backdrop-blur">
//         <Link to="/" className="flex items-center gap-3">
//           <img src={logo} className="h-10 w-10 rounded-xl" alt="finpay-logo" />

//           <div>
//             <p className="text-xl font-extrabold tracking-tight text-slate-950">
//               FinPay
//             </p>
//             <p className="text-xs font-semibold text-slate-500">
//               Secure money transfers
//             </p>
//           </div>
//         </Link>

//         <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
//           <Link className="rounded-full px-4 py-2 hover:bg-slate-100" to="/">
//             Pay
//           </Link>

//           <Link
//             className="rounded-full px-4 py-2 hover:bg-slate-100"
//             to="/transfers"
//           >
//             Transfers
//           </Link>

//           {checkingUser ? (
//             <span className="h-9 w-24 animate-pulse rounded-full bg-slate-100" />
//           ) : user ? (
//             <div className="flex items-center gap-2">
//               <Link
//                 className="rounded-full bg-slate-950 px-4 py-2 text-white hover:bg-slate-800"
//                 to="/transfers"
//               >
//                 {user.name}
//               </Link>

//               <button
//                 onClick={handleLogout}
//                 disabled={loggingOut}
//                 className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
//                 type="button"
//               >
//                 {loggingOut ? "Logging out..." : "Logout"}
//               </button>
//             </div>
//           ) : (
//             <Link
//               className="rounded-full bg-slate-950 px-4 py-2 text-white hover:bg-slate-800"
//               to="/sign-in"
//             >
//               Sign in
//             </Link>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// }


import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/finpay-logo.png";
import api from "../helpers/api";

type LoggedUser = {
  Id: number;
  name: string;
};

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const cachedName = sessionStorage.getItem("finpayUserName");

  const [user, setUser] = useState<LoggedUser | null>(
    cachedName ? { Id: 0, name: cachedName } : null,
  );
  const [checkingUser, setCheckingUser] = useState(!cachedName);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchUser = async (showLoading = false) => {
    try {
      if (showLoading) setCheckingUser(true);

      const result = await api.get("/me");

      setUser({
        Id: result.data.user.Id,
        name: result.data.user.name,
      });

      sessionStorage.setItem("finpayUserName", result.data.user.name);
    } catch (error) {
      setUser(null);
      sessionStorage.removeItem("finpayUserName");
    } finally {
      setCheckingUser(false);
    }
  };

  useEffect(() => {
    fetchUser(!cachedName);
  }, []);

  useEffect(() => {
    if (!user && location.pathname === "/") {
      fetchUser(false);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await api.post("/logout");

      setUser(null);
      sessionStorage.removeItem("finpayUserName");

      navigate("/sign-in");
    } catch (error) {
      console.error("logout failed", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-3 z-30 px-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-3xl border border-slate-200 bg-white/95 px-5 py-3 shadow-sm backdrop-blur">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} className="h-10 w-10 rounded-xl" alt="finpay-logo" />

          <div>
            <p className="text-xl font-extrabold tracking-tight text-slate-950">
              FinPay
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Secure money transfers
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Link className="rounded-full px-4 py-2 hover:bg-slate-100" to="/">
            Pay
          </Link>

          <Link
            className="rounded-full px-4 py-2 hover:bg-slate-100"
            to="/transfers"
          >
            Transfers
          </Link>

          {checkingUser ? (
            <span className="h-9 w-24 animate-pulse rounded-full bg-slate-100" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                className="rounded-full bg-slate-950 px-4 py-2 text-white hover:bg-slate-800"
                to="/transfers"
              >
                {user.name}
              </Link>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <Link
              className="rounded-full bg-slate-950 px-4 py-2 text-white hover:bg-slate-800"
              to="/sign-in"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}