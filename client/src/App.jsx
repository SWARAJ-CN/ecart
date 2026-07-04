import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Reels from "./pages/Reels";
import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";
import Profile from "./pages/Profile";
import PageNotFound from "./AnotherPlanet/PageNotFound";
import Posts from "./components/Posts";
import UsersCard from "./components/UsersCard";
import Chatbot from "./pages/Chatbot";
import UserCard from "./components/UserCard";
import News from "./pages/News";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";

const App = () => {
  const location = useLocation();

  const [isAuth, setIsAuth] = useState(false);
  const [userkey, setuserkey] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("authkey");

    if (auth) {
      setIsAuth(true);
      setuserkey(auth);
    }
  }, []);

  const hideNavbar =
    ((location.pathname === "/" || location.pathname === "/login") && !isAuth) ||
    location.pathname.startsWith("/admin");

  return (
    <>
      <Toaster position="top-right" />

      {!hideNavbar && <Navbar userkey={userkey} />}

      <Routes>
        <Route
          path="/"
          element={
            isAuth ? (
              <Home setIsAuth={setIsAuth} />
            ) : (
              <Login setIsAuth={setIsAuth} />
            )
          }
        />

        <Route
          path="/login"
          element={
            isAuth ? (
              <Home setIsAuth={setIsAuth} />
            ) : (
              <Login setIsAuth={setIsAuth} />
            )
          }
        />

        <Route path="/reels" element={<Reels />} />
        <Route path="/profile" element={<Profile setIsAuth={setIsAuth}/>} />

        <Route path="/*" element={<PageNotFound/>}/>

        <Route path="/posts" element={<Posts/>}/>
        <Route path="/users" element={<UsersCard/>}/>
        <Route path="/chatbot" element={<Chatbot/>}/>

        <Route path="profile/:id" element={<UserCard/>}/>
        <Route path="/news" element={<News/>}/>
        <Route path="/messages/:userId?" element={<Messages/>}/>
        <Route path="/notifications" element={<Notifications/>}/>

        {/* ---------Admin Routes------------ */}
        
        <Route path="/admin" element={<AdminLogin/>}/>
        <Route path="/admin-dash" element={<Dashboard/>}/>
      </Routes>

      {!hideNavbar && <MobileNav />}
    </>
  );
};

export default App;