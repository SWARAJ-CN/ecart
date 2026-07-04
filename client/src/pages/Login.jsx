import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import { asset } from "../assets/asset";
import { Eye, EyeClosed, Lock, Mail, UserRound } from "lucide-react";
import { addUser, fetchUser } from "../services/route.js";
import bcrypt from "bcryptjs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();

  // animation
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  // eye open close
  const [isEyeOpen, setIsEyeOpen] = useState(true);
  // handle log reg page sts
  const [isLogin, setIsLogin] = useState(true);
  // user datas
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // function for  handle eye open close
  const eyeOpenClose = () => {
    setIsEyeOpen((prev) => !prev);
  };
  // handle login page status
  const handlePage = () => {
    setIsLogin((login) => !login);
  };

  // handle user data
  const handleRegister = async () => {
    if (
      userData?.username == "" ||
      userData?.password == "" ||
      userData?.username == ""
    ) {
      toast.error("Please fill the form");
    } else {
      const hash = await bcrypt.hash(userData.password, 10);
      let user_data = {
        username: userData.username,
        email: userData.email,
        password: hash,
        created_at: new Date().toLocaleDateString(),
      };
      const result = await addUser(user_data);

      if (result.status < 300 && result.status > 200) {
        toast.success("accout created successfully");
        setIsAuth(true);
        localStorage.setItem("authkey", userData.email);
      } else {
        toast.error("something went wrong");
      }
    }
  };

  // getuser data
  const handleUserFetch = async () => {
    const users = await fetchUser();

    if (userData.email === "") {
      toast.error("Please enter your email");
      return;
    }
    if (userData.password === "") {
      toast.error("Please enter your password");
      return;
    }

    const user = users?.data?.find(
      (individualUser) => individualUser.email === userData.email,
    );

    const checkpass = await bcrypt.compare(userData?.password, user?.password);
    if (!checkpass) {
      toast.error("Invalid password.");
      return null;
    }
    if (user) {
      localStorage.setItem("authkey", user?.email);
      setIsAuth(true);
      toast.success(`welcome back! ${user?.username}`);
    } else {
      toast.error("User not found. Please check your email.");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden select-none bg-slate-900">
      {/* left side */}
      <div className="relative hidden md:flex md:w-1/2 h-full justify-center items-center overflow-hidden ">
        <p className="font-extrabold text-9xl text-transparent bg-clip-text bg-white/10 drop-shadow-md absolute z-10 pointer-events-none tracking-wider select-none">
          CONNECT
        </p>

        <div className="px-8 flex flex-col py-6 text-white/90 font-extrabold absolute bottom-0 left-0 z-10 w-full backdrop-blur-xs">
          <span className="text-xl tracking-widest">CONNECT</span>
          <span className="text-xs font-medium text-gray-400 mt-0.5 tracking-normal">
            connect. share. inspire.
          </span>
        </div>

        <div
          className={`w-full h-full transition-opacity duration-700 ${isSplineLoaded ? "opacity-100" : "opacity-0"}`}
        >
          <Spline
            scene="https://prod.spline.design/bxx9lCOveqxUKRhi/scene.splinecode"
            className="scale-150"
            onLoad={() => setIsSplineLoaded(true)}
          />
        </div>

        {!isSplineLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm font-medium">
            Loading ...
          </div>
        )}
      </div>

      {/* right side */}

      <div className="w-full md:w-1/2 h-full flex justify-center items-center bg-gray-50 px-4 sm:px-8 ">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 shadow-xl rounded-2xl border border-gray-100 flex flex-col gap-6 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col items-center gap-3 text-center">
            <img
              src={asset.logo}
              alt="Logo"
              className="w-16 h-16 object-contain"
            />

            {/* login side */}

            {!isLogin && (
              <label className="flex font-bold text-slate-500 text-start gap-1 text-sm flex-col w-full">
                Username
                <div className="flex gap-2 w-full font-normal items-center border-2 p-3 rounded-xl overflow-hidden border-gray-300 ">
                  <UserRound className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Create username"
                    className=" outline-none h-full w-full"
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                  />
                </div>
              </label>
            )}

            <label className="flex font-bold text-slate-500 text-start gap-1 text-sm flex-col w-full">
              Email Address
              <div className="flex gap-2 w-full font-normal items-center border-2 p-3 rounded-xl overflow-hidden border-gray-300 ">
                <Mail className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Your@gmail.com"
                  className=" outline-none h-full w-full"
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
              </div>
            </label>

            <label className="flex font-bold text-slate-500 text-start gap-1 text-sm flex-col w-full">
              <span className="w-full flex justify-between">
                password{" "}
                <span className="text-blue-500 font-normal cursor-pointer">
                  Forgot ?{" "}
                </span>
              </span>
              <div className="flex gap-2 font-normal w-full items-center border-2 p-3 rounded-xl overflow-hidden border-gray-300 ">
                <Lock className="text-gray-400" />
                <input
                  type={isEyeOpen ? "password" : "text"}
                  placeholder="Password"
                  className=" outline-none h-full w-full"
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                />
                {isEyeOpen ? (
                  <Eye onClick={eyeOpenClose} className="cursor-pointer" />
                ) : (
                  <EyeClosed
                    onClick={eyeOpenClose}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </label>
            <span className="flex gap-2 w-full text-sm  text-slate-600">
              <input type="checkbox" name="" id="" />
              Remember me
            </span>
            {isLogin ? (
              <button
                onClick={handleUserFetch}
                className="bg-linear-to-l from-blue-700 to-blue-500 w-full p-3 rounded-xl cursor-pointer text-white  active:scale-105 transition-all duration-300"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleRegister}
                className="bg-linear-to-l from-blue-700 to-blue-500 w-full p-3 rounded-xl cursor-pointer text-white  active:scale-105 transition-all duration-300"
              >
                Submit
              </button>
            )}
            <hr className="border-gray-300 w-3/4 mt-4" />
            {isLogin ? (
              <span className="text-xs text-slate-500">
                Don't have an account{" "}
                <span
                  className="text-blue-700 font-bold  cursor-pointer"
                  onClick={handlePage}
                >
                  {" "}
                  create an accout ?
                </span>
              </span>
            ) : (
              <span className="text-xs text-slate-500">
                Already have an account{" "}
                <span
                  className="text-blue-700 font-bold  cursor-pointer"
                  onClick={handlePage}
                >
                  {" "}
                  Login ?
                </span>
              </span>
            )}
            {/* <span className="text-xs text-slate-400 cursor-pointer" onClick={navigate('/admin')}>admin access</span> */}
          </div>
        </div>
        {/* right side end */}
      </div>
    </div>
  );
};

export default Login;
