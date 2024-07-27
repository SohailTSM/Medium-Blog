// SignupPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading((prev) => !prev);
    const response = await fetch(
      config.BASE_URL + config.USER_ROUTE + "signup",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
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
        <div className="bg-white p-10 rounded-lg shadow-md flex items-center w-full max-w-4xl">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-semibold mb-5">Create an account</h2>
            <form onSubmit={handleSignup}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                Sign Up
              </button>
            </form>
            <p className="mt-4 text-sm">
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                Login
              </span>
            </p>
          </div>
          <div className="ml-10 hidden md:block">
            <blockquote className="text-gray-700 italic">
              <p>
                “The customer service I received was exceptional. The support
                team went above and beyond to address my concerns.”
              </p>
              <footer className="mt-4">
                <cite>Jules Winfield, CEO, Acme Inc.</cite>
              </footer>
            </blockquote>
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

export default SignupPage;
