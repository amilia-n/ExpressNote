// client/src/pages/Landing.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();
  
  // Keep your existing state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_NODE_ENV === 'production' || process.env.NODE_ENV === 'production'
    ? 'https://expressnote.onrender.com' 
    : 'http://localhost:3000';

  // Keep your existing handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("${API_URL}/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/notes");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred during login");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("${API_URL}/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // After successful registration, automatically log in
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        const loginData = await loginResponse.json();
        if (loginResponse.ok) {
          localStorage.setItem("token", loginData.token);
          navigate("/notes");
        } else {
          setError(loginData.error);
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred during registration");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    
    <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0 landing">
      <div>
        <img
          className="landing-logo"
          src={logo}
          alt="ExpressNote Logo"
          style={{
            height: "300px",
            clipPath: "inset(60px 0px 100px 10px)",
          }}
        />
      </div>
      <div className="flex bg-white shadow-lg max-w-sm lg:max-w w-full landing-container">
        <div className="w-full p-8">
          <p className="text-xl text-gray-600 text-center">Get Started</p>
          
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full landing-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-4 flex flex-col justify-between">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
            </div>
            <input
              className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full landing-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-gray-900 text-end w-full mt-2"
            >
              Forget Password?
            </a>
          </div>
          <div className="inline-btn">
            <button
              className="signup-button text-white py-2 px-4 w-full"
              onClick={handleRegister}
            >
              Register
            </button>
            <button
              className="login-button text-white py-2 px-4 w-full"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
          <a
            href="#"
            className="flex items-center justify-center mt-4 text-white shadow-md google-btn"
            onClick={handleGoogleLogin}
          >
            <div className="flex px-5 justify-center w-full py-3">
              <div className="min-w-[30px]">
                <svg className="h-6 w-6" viewBox="0 0 40 40">
                  <path
                    d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                    fill="#FFC107"
                  />
                  <path
                    d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                    fill="#FF3D00"
                  />
                  <path
                    d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                    fill="#4CAF50"
                  />
                  <path
                    d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                    fill="#1976D2"
                  />
                </svg>
              </div>
              <div className="flex w-full justify-center">
                <h1 className="whitespace-nowrap">Sign in with Google</h1>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
export default Landing;
