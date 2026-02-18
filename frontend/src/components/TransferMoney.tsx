import { useState } from "react";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { JWTType } from "./Dashboard";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
export default function TransferMoney() {
  const { state } = useLocation();
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  const recipientID = state?._id;
  const recipientFirstname = state?.firstname;

  const token = localStorage.getItem("token");

  async function fetchTransfer() {
    try {
      const result = await axios.put(
        "http://localhost:3000/api/v1/account/transfer",
        { recipientID: recipientID, amount: amount },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      if (result.data.success) {
        alert("transaction successfull");
        navigate("/");
      }
    } catch (error) {
      console.log("error occured while transaction process : ", error);
      // alert("Transaction failed");
       Swal.fire({
        icon: "error",
        title: "Transaction Failed",
        text: "Please check your balance or try again later.",
        confirmButtonColor: "#000000",
      });
    }
  }

  return (
    <div className="flex justify-center items-center  min-h-screen">
      <div className="flex flex-col justify-center m-5 bg-white border border-black p-4 rounded-lg max-w-150">
        <h1 className="text-center text-xl font-extrabold size m-1">
          Transfer Money
        </h1>
        <div className="font-extralight text-sm mb-3">
          Kindly provide the required credentials for the transaction process
        </div>
        <div className="flex flex-col justify-center  m-2">
          <div className="font-bold text-sm  mb-2">recipient ID</div>

          {recipientID && recipientFirstname ? (
            <input
              className="border border-gray-300 rounded-md px-4 py-2"
              type="text"
              // placeholder="recipient ID"
              readOnly
              value={recipientID}
            />
          ) : (
            <input
              className="border border-gray-300 rounded-md px-4 py-2"
              type="text"
              placeholder="recipient ID"
            />
          )}
        </div>

        <div className="flex flex-col justify-center  m-2">
          <div className="font-bold text-sm  mb-2">recipient name</div>

          {recipientID && recipientFirstname ? (
            <input
              className="border border-gray-300 rounded-md px-4 py-2"
              type="text"
              // placeholder="recipient name"
              readOnly
              value={recipientFirstname}
            />
          ) : (
            <input
              className="border border-gray-300 rounded-md px-4 py-2"
              type="text"
              placeholder="recipient name"
            />
          )}
        </div>
        <div className="flex flex-col justify-center m-2">
          <div className="font-bold text-sm mb-2">amount</div>
          <input
            className="border border-gray-300 rounded-md px-4 py-2 [appearance:textfield] 
    [&::-webkit-outer-spin-button]:appearance-none 
    [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            placeholder="$500"
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
          />
        </div>

        {/* <div className="flex flex-col justify-center m-2">
          <div className="font-bold text-sm mb-2">Password</div>
          <input
            className="border border-gray-300 rounded-md px-4 py-2"
            type="password"
            placeholder="*****"
          />
        </div> */}
        <div className="m-2">
          <button
            className="w-full py-2 bg-black text-white rounded-md"
            onClick={fetchTransfer}
          >
            Submit
          </button>
        </div>
        <div className="text-center">
          Payment failed?{" "}
          <Link className="underline" to={"/transfer-money"}>
            Redo it
          </Link>
        </div>
      </div>
    </div>
  );
}
