import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
export default function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center  min-h-screen">
      <div className="flex flex-col justify-center m-5 bg-white border border-black p-4 rounded-lg max-w-150">
        <h1 className="text-center text-xl font-extrabold size m-1">Sign In</h1>
        <div className="font-extralight text-sm mb-3">
          Kindly provide the required credentials for the login process
        </div>
        <div className="flex flex-col justify-center  m-2">
          <div className="font-bold text-sm  mb-2">Email | Username</div>
          <input
            className="border border-gray-300 rounded-md px-4 py-2"
            type="text"
            placeholder="vishal"
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div className="flex flex-col justify-center m-2">
          <div className="font-bold text-sm mb-2">Password</div>
          <input
            className="border border-gray-300 rounded-md px-4 py-2"
            type="password"
            placeholder="*****"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="m-2">
          <button
            onClick={async (e) => {
              e.preventDefault();

              try {
                const result = await axios.post("http://localhost:3000/api/v1/user/sign-in", {
                identifier: identifier,
                password: password,
              });

              if(result.data.success){
                localStorage.setItem("token", result.data.token);
                const token = localStorage.getItem("token");
                console.log(token)
                navigate('/');
                


              }
              } catch (error) {
                 alert(`sign in failed : ${error.message}`);
                console.log(error);
              }

             
            }}
            className="w-full py-2 bg-black text-white rounded-md"
          >
            Submit
          </button>
        </div>
        <div className="text-center">
          not registered yet?{" "}
          <Link className="underline" to={"/sign-up"}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
