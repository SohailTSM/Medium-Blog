// SigninPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";

function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading((prev) => !prev);
    const response = await fetch(
      config.BASE_URL + config.USER_ROUTE + "signin",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();

    setIsLoading((prev) => !prev);

    if (!data.token) {
      setErrorMessage(data.message);
      setShowError(true);
      return;
    }

    console.log(data);

    localStorage.setItem("token", data.token);
    navigate("/");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-md flex items-center w-full max-w-md">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-semibold mb-5">
              Sign in to your account
            </h2>
            <form onSubmit={handleSignin}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Sign In
              </button>
            </form>
            <p className="mt-4 text-sm">
              Don't have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
      <ErrorModal
        show={showError}
        onClose={() => {
          setShowError(false);
        }}
        message={errorMessage}
      />
      {isLoading && <Loader />}
    </>
  );
}

export default SigninPage;
