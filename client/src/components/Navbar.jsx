import React from "react";
import logo from "../assets/logo.png";
import user from "../assets/user.png"

export default function Navbar() {
  return (
    <div className="navbar shadow-sm h-20" style={{ backgroundColor: "#303030" }}>
          <img
            src={logo}
            alt="ExpressNote Logo"
            style={{
                height: "280px",
              clipPath: "inset(60px 0px 100px 10px)",
              marginLeft: "-25px",
            }}
          />

      <div className="ml-auto">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10">
            <img
            src={user}
            alt="Default User Icon"
            style={{
                marginRight: "15px"
            }}
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
