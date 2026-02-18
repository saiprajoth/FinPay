import React from "react";
import { useNavigate } from "react-router";

export type UserType = {
  _id: string;
  username: string;
  email: string;
  firstname: string;
  lastname?:string;
};

export default function User({ user }: { user: UserType }) {
  const navigate = useNavigate();
  return (
    <div className="border border-black rounded-md m-2 bg-gray-600 p-3">
      <div className="flex justify-between">
        <div className="flex justify-between">
          <div className="m-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
          <span className="m-2 items-center">{user.firstname}</span>
        </div>

        <button
          className="bg-black text-white rounded-lg p-2"
          onClick={() => {
            navigate(`/transfer-money`,{state:user});
          }}
        >
          send money
        </button>
      </div>
    </div>
  );
}
