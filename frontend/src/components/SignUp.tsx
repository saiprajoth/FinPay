import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function SignUp() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center  min-h-screen">
      <div className="flex flex-col justify-center m-5 bg-white border border-black p-4 rounded-lg max-w-150">
        <h1 className="text-center text-xl font-extrabold size m-1">Sign Up</h1>
        <div className="font-extralight text-sm mb-3">
          Kindly provide the required credentials for the signup process
        </div>
        <div className="flex flex-col justify-center m-2">
          <div className="font-bold text-sm mb-2">username</div>
          <input
            className="border border-gray-300 rounded-md px-4 py-2"
            type="text"
            placeholder="bhard123"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col justify-center  m-2">
          <div className="font-bold text-sm  mb-2">Firstname</div>
          <input
            required
            className="border border-gray-300 rounded-md px-4 py-2"
            type="text"
            placeholder="vishal"
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="flex flex-col justify-center m-2">
          <div className="font-bold text-sm mb-2">lastname</div>
          <input
            className="border border-gray-300 rounded-md px-4 py-2"
            type="text"
            placeholder="bharadwaj"
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className="flex flex-col justify-center m-2">
          <div className="font-bold text-sm mb-2">Email</div>
          <input
            required
            className="border border-gray-300 rounded-md px-4 py-2"
            type="text"
            placeholder="vbharad@xyz.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col justify-center m-2">
          <div className="font-bold text-sm mb-2">Password</div>
          <input
            required
            className="border border-gray-300 rounded-md px-4 py-2"
            type="password"
            placeholder="*****"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="m-2">
          <button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              const result = await axios.post(
                "http://localhost:3000/api/v1/user/sign-up",
                {
                  firstname: firstname,
                  lastname: lastname.trim() ? lastname : null,
                  email: email,
                  password: password,
                  username: username,
                },
              );

              if (result.data.success) {
                // set jwt token in local storage
                localStorage.setItem("token", result.data.token);
                navigate("/");

              } else {
                alert(`sign up failed : ${result.data.message}`);
                console.log(result.data.message);
              }
            }}
            className="w-full py-2 bg-black text-white rounded-md"
          >
            Submit
          </button>
        </div>
        <div className="text-center">
          Already registered?{" "}
          <Link className="underline" to={"/sign-in"}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
