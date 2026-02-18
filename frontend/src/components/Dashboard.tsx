


import React, { useEffect, useState, useRef } from "react";
import User from "./User";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import type { UserType } from "./User";
import axios from "axios";

export type JWTType = {
  identifier: string;
  exp: number;
};

export default function Dashboard() {
  const [identifier, setIdentifier] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [amount, setAmount] = useState(0);

  const token = localStorage.getItem("token");
  console.log(token);

  useEffect(() => {
    (() => {
      if (token) {
        const payload = jwtDecode(token) as JWTType;
        const exp = payload.exp * 1000;
        const identifier = payload.identifier;
        const now = Date.now();
        const isExpired = !exp || now >= exp;

        if (!isExpired) {
          setIdentifier(identifier);
        }
      }
    })();

    (async () => {
      try {
        const result = await axios.get(
          "http://localhost:3000/api/v1/user/get-users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUsers(result.data.users);
      } catch (error) {
        console.log("error occured while fetching users : ", error);
      }
    })();

    (async () => {
      try {
        const result = await axios.get(
          "http://localhost:3000/api/v1/account/balance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setAmount(result.data.balance);
      } catch (error) {
        console.log("error occured while fetching users : ", error);
      }
    })();
  }, []);

  async function fetchUsers(value: string) {
    try {
      const result = await axios.get(
        `http://localhost:3000/api/v1/user/get-users-firstname/${encodeURIComponent(value)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUsers(result.data.users);
    } catch (error) {
      console.log("error occured while fetching users : ", error);
    }
  }

  const timeRef = useRef<number | null>(null);

  function DebouncedValue(fcn: (value: string) => void, value: string) {
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = window.setTimeout(() => fcn(value), 500);
  }

  return (
    <div>
   
      <nav className="flex items-center justify-between px-4 py-2 m-2 bg-black rounded-sm mb-2">
        <div className="font-bold text-white flex items-center">FinPay</div>

        <div className="flex items-center gap-4">
          <div className="text-white flex items-center">
            <span>Hello, {identifier || "User"}</span>
          </div>

          <div className="text-white flex items-center">
            {identifier ? (
              <span>Profile</span>
            ) : (
              <button
                onClick={() => {
                  navigate("/sign-up");
                }}
                className="bg-black px-3 py-2 text-white"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </nav>

      <div
        className={
          !identifier
            ? "blur-sm opacity-60 pointer-events-none select-none"
            : ""
        }
      >
        <div className="mx-2 mt-4">
          <span className="text-xl">Balance</span>{" "}
          <span className="font-bold text-xl">$ {amount}</span>
        </div>

        <div className="mt-5">
          <span className="mx-2">Users</span>
          <div className="px-2">
            <input
              className="w-full px-3 py-3 border border-black rounded-md"
              type="text"
              placeholder="search users..."
              onChange={(e) => {
                DebouncedValue(fetchUsers, e.target.value);
              }}
            />
          </div>
        </div>

        <div>
          {users.map((u) => (
            <User user={u} key={u._id} />
          ))}
        </div>
      </div>
    </div>
  );
}
