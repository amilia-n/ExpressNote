import React from "react";
import logo from "../assets/logo.png";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div
      className="navbar shadow-sm h-20"
      style={{ backgroundColor: "#303030" }}
    >
      <img
        src={logo}
        alt="ExpressNote Logo"
        style={{
          height: "280px",
          clipPath: "inset(60px 0px 100px 10px)",
          marginLeft: "-25px",
        }}
      />

      <div className="ml-auto" style={{ marginRight: "30px" }}>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn-ghost hover:bg-transparent transition-all duration-200"
          >
            <div className="w-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
