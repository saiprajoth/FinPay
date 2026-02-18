import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import TransferMoney from "./components/TransferMoney";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/transfer-money" element={<TransferMoney />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

