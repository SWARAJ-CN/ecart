import React, { useEffect, useState } from "react";
import { ShieldUser, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { getAdminCredentials } from "../services/route";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const adminKey = "5d41402abc4b2a76b9719d911017c592";

const AdminLogin = () => {

  
  const [adminCredentials, setAdminCredentials] = useState(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    admin: "",
    pass: "",
  });


  
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const SignIn = async () => {
    try {
      const response = await getAdminCredentials();
      setAdminCredentials(response?.data);
    } catch (error) {
      console.log(error);
      toast.error("unstable connection");
    }
  };
  const validateAdmin = () => {
    if (credentials.admin === "" && credentials.pass === "") {
      toast.error("Please enter the credentials");
      return 0;
    }
    if (
      adminCredentials?.username === credentials.admin &&
      adminCredentials?.password === credentials.pass
    ) {
      localStorage.setItem("adminkey", adminKey);
      navigate("/admin-dash");
    } else {
      console.log("error");
      toast.error("invalid credentials");
    }
  };

  useEffect(() => {
    SignIn();
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 px-4">
      <div className="relative w-full max-w-md rounded-2xl border overflow-hidden border-slate-200 bg-white p-8 shadow-xl">
        <div className="absolute w-110 h-100 shadow-lg opacity-40 bg-slate-200 -top-35 -right-20 rounded-full"></div>
        <div className="absolute shadow-lg w-40 h-40 opacity-40 bg-slate-200 -bottom-5 -left-5 rounded-full"></div>

        <div className="bg-red-transparent  p-2 relative ">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center rounded-full bg-slate-100 p-3">
              <ShieldUser size={32} className="text-slate-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Admin Portal
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Restricted access area
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                name={credentials.admin}
                onChange={(e) =>
                  setCredentials({ ...credentials, admin: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-all focus:border-slate-400 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <div className="relative mt-1 flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name={credentials.pass}
                  onChange={(e) =>
                    setCredentials({ ...credentials, pass: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pr-11 text-sm outline-none transition-all focus:border-slate-400 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                SignIn();
                validateAdmin();
              }}
              type="submit"
              className="mt-2 w-full rounded-xl bg-slate-900 p-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Sign In
            </button>
          </form>
        </div>
        {/* <span onClick={()=>navigate('/')} className="text-xs flex flex-row gap-1 items-center group hover:text-blue-500 cursor-pointer relative z-9999"><ArrowLeft size={10}/> access home page</span> */}
      </div>
    </div>
  );
};

export default AdminLogin;
