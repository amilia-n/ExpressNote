import React from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <div className="navbar shadow-sm h-20" style={{ backgroundColor: "#303030" }}>
      <div className="flex-1">

          <img
            src={logo}
            alt="ExpressNote Logo"
            style={{
                height: "280px",
              clipPath: "inset(60px 0px 100px 10px)",
              marginLeft: "-25px",
            }}
          />

      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
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
