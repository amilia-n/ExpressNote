import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./UserProfile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL =
    import.meta.env.MODE === "production"
      ? "https://expressnote.onrender.com"
      : "http://localhost:3000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data.user);
        setNotes(data.notes);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                    </div>
                  </div>
                  <h1 className="text-xl font-bold">username</h1>
                  <p className="text-gray-700">Email</p>
                  <p className="text-gray-700">Date Joined</p>
                  <div className="mt-6 flex flex-wrap gap-4 justify-center">
                    <a href="#" className="py-2 px-4 rounded edit-profile">
                      Edit Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-4 sm:col-span-9">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-center items-center min-h-screen">
                  <div className="max-w-[720px] mx-auto">
                    <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96 all-notes-card">
                      <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl h-96 pdf-cover-container">
                        <img
                          src="https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=927&amp;q=80"
                          alt="the first pdf page"
                          className="pdf-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                            Note Title
                          </p>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <button
                          className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
                          type="button"
                        >
                          Enter This Note
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
