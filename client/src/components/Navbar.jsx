import React, { useEffect, useRef, useState } from "react";
import { asset } from "../assets/asset";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  BotMessageSquare,
  FilmIcon,
  Home,
  Image,
  MessageCircle,
  Plus,
  Shield,
  Users2,
} from "lucide-react";
import { useSound } from "../context/SoundContext";
import { useUser } from "../context/AuthUser";
import Upload from "./Upload";

const Navbar = ({ userkey }) => {
  const { handileClickSound } = useSound();
  const soundRef = useRef(new Audio(asset.click));
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [uploadBox, setUploadedBox] = useState(false);

  const navigations = [
    { path: "/", label: <Home className="h-5 w-5" /> },
    { path: "/posts", label: <Image className="h-5 w-5" /> },
    { path: "/reels", label: <FilmIcon className="h-5 w-5" /> },
    { path: "/users", label: <Users2 className="h-5 w-5" /> },
  ];

  const navmenus = ({ isActive }) => `
        p-2 sm:px-4 sm:py-1 rounded-full hover:text-blue-500 transition-all
        border border-slate-200 flex items-center justify-center
        ${isActive ? "shadow-md bg-blue-100/80 border-blue-200 text-blue-600" : "bg-slate-200/50 text-gray-600"} 
        backdrop-blur-2xl
    `;

  const { getAuthUser } = useUser();

  const userProfileImage = async () => {
    const response = await getAuthUser();
    if (response?.profile_pic) {
      setUserProfile(response.profile_pic);
    }
  };

  const handlePostMenu = () => {
    setUploadedBox((prev) => !prev);
  };

  useEffect(() => {
    userProfileImage();
  }, []);

  return (
    <>
      <div className="md:flex z-50 fixed top-0 left-0 w-full items-center justify-center hidden bg-linear-to-b from-white/10 to-transparent backdrop-blur-xs pb-4">
        <div className="shadow-md flex flex-row justify-between items-center rounded-full w-[90%] max-w-6xl h-fit px-5 py-2 mt-3 backdrop-blur-2xl bg-slate-100/90 border border-slate-200">
          <div
            onClick={() => navigate("/")}
            className="flex flex-row w-fit px-3 py-1 bg-white items-center gap-2 rounded-full shadow-md cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <div className="rounded-full h-8 w-8 overflow-hidden">
              <img
                src={asset.logo2}
                alt="app-logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-extrabold text-sm select-none tracking-wider text-slate-800">
              CONNECT
            </span>
          </div>
          <div className="flex flex-row gap-4 lg:gap-8 justify-between rounded-full w-fit h-fit px-4 shadow-sm bg-white py-1.5">
            {navigations.map((navs, index) => (
              <NavLink
                key={index}
                to={navs.path}
                className={navmenus}
                onClick={handileClickSound}
              >
                {navs.label}
              </NavLink>
            ))}
          </div>
          <div className="flex flex-row w-fit px-2 py-1 bg-white items-center gap-2 rounded-full shadow-md">
            {uploadBox && <Upload />}
            <button
              onClick={() => {
                handileClickSound();
                handlePostMenu();
              }}
              className={`p-2 flex-row  rounded-full bg-white shadow-sm hover:text-blue-500 transition-all duration-300 flex items-center cursor-pointer ${uploadBox ? "text-red-500 scale-105 border border-red-200 bg-red-50" : ""}`}
            >
              <span className="flex text-xs px-2"> Post</span>
              <Plus className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                handileClickSound();
                navigate("/chatbot");
              }}
              className="p-2 rounded-full bg-white shadow-sm hover:text-blue-500 transition-all duration-300 flex items-center cursor-pointer"
            >
              <BotMessageSquare className="h-5 w-5 text-gray-600" />
            </button>

            <NavLink
              to="/messages"
              onClick={handileClickSound}
              className={({ isActive }) =>
                `p-2 rounded-full bg-white shadow-sm hover:text-blue-500 transition-all duration-300 flex items-center ${isActive ? "text-blue-500" : "text-gray-600"}`
              }
            >
              <MessageCircle className="h-5 w-5" />
            </NavLink>

            <NavLink
              to="/notifications"
              onClick={handileClickSound}
              className={({ isActive }) =>
                `p-2 rounded-full bg-white shadow-sm hover:text-blue-500 transition-all duration-300 flex items-center ${isActive ? "text-blue-500" : "text-gray-600"}`
              }
            >
              <Bell className="h-5 w-5" />
            </NavLink>

            <NavLink
              to="/admin"
              onClick={handileClickSound}
              className="h-9 relative hover:bg-red-200 group w-9 border-2 border-slate-200 overflow-hidden rounded-full bg-white shadow-sm transition-transform flex items-center justify-center shrink-0"
            >
                <Shield className="text-blue-500 group-hover:text-red-500 transition-all duration-300"/>
            </NavLink>

            <NavLink
              to="/profile"
              onClick={handileClickSound}
              className="h-9 w-9 border-2 border-slate-200 overflow-hidden rounded-full bg-white shadow-sm hover:scale-105 transition-transform flex items-center justify-center shrink-0"
            >
              <img
                src={userProfile || asset.nouser}
                alt="profile"
                className="h-full w-full object-cover rounded-full"
              />
            </NavLink>
          </div>
        </div>
      </div>
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-100/90 backdrop-blur-xl border-t border-slate-200 px-4 py-2 z-50 shadow-lg flex flex-row justify-around items-center">
        {navigations.map((navs, index) => (
          <NavLink
            key={index}
            to={navs.path}
            className={({ isActive }) =>
              `p-2 rounded-xl transition-all ${isActive ? "text-blue-500 bg-blue-50" : "text-gray-600"}`
            }
            onClick={handileClickSound}
          >
            {navs.label}
          </NavLink>
        ))}
        <button
          onClick={() => {
            handileClickSound();
            handlePostMenu();
          }}
          className={`p-2 rounded-xl transition-all ${uploadBox ? "text-red-500 bg-red-50" : "text-gray-600"}`}
        >
          <Plus className="h-5 w-5" />
        </button>
        {uploadBox && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
            <Upload />
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
