import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Transaction from "./components/Transaction";
import TransactionRecords from "./components/TransactionRecords";
import VerifyCode from "./components/VerifyCode";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transfer-money" element={<Transaction />} />
        <Route path="/transfers" element={<TransactionRecords />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/verify" element={<VerifyCode />} />
      </Routes>
    </div>
  );
}

export default App;