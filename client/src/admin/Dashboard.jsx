import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  fetchUser, updateUser, addUser, 
  getPost, deletePost, 
  getLikes, 
  fetchMessages 
} from "../services/route"; 
import { 
  UserRound, UsersRound, Calendar, Mail, ArrowUpRight, 
  Image, Heart, MessageSquare, Trash2, Edit2, Plus, X, 
  LogOut
} from "lucide-react";
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { asset } from "../assets/asset";

const Dashboard = () => {
  const move = useNavigate();
  
 
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userForm, setUserForm] = useState({ username: "", email: "", password: "", profile_pic: "" });
  const [activeTab, setActiveTab] = useState("users");

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [resUsers, resPosts, resLikes, resMessages] = await Promise.all([
        fetchUser(),
        getPost(),
        getLikes(),
        fetchMessages("", "")
      ]);

      setUsers(resUsers?.data || resUsers || []);
      setPosts(resPosts?.data || resPosts || []);
      setLikes(resLikes?.data || resLikes || []);
      setMessages(resMessages?.data || resMessages || []);
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to data clusters.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () =>{
    localStorage.removeItem('adminkey')
    move(0)
  }

  useEffect(() => {
    const key = localStorage.getItem("adminkey");
    if (!key) {
      toast.error("Unauthorized access.");
      move("/admin");
    } else {
      loadDashboardData();
    }
  }, []);


  const handleInputChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setUserForm({ username: "", email: "", password: "", profile_pic: "" });
    setShowUserModal(true);
  };

  const openEditModal = (user) => {
    setIsEditing(true);
    setSelectedUserId(user.id);
    setUserForm({
      username: user.username,
      email: user.email,
      password: "",
      profile_pic: user.profile_pic || ""
    });
    setShowUserModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updatedBody = userForm.password ? userForm : { 
          username: userForm.username, 
          email: userForm.email, 
          profile_pic: userForm.profile_pic 
        };
        await updateUser(selectedUserId, updatedBody);
        toast.success("Identity profile updated.");
      } else {
        const newUserData = {
          ...userForm,
          created_at: new Date().toLocaleDateString(),
          followers: [],
          following: []
        };
        await addUser(newUserData);
        toast.success("User account generated.");
      }
      setShowUserModal(false);
      loadDashboardData();
    } catch (err) {
      toast.error("Operation failed.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Drop this record from system registers?")) {
      setUsers(users.filter(u => u.id !== id));
      toast.success("Record dropped successfully.");
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Purge this digital asset?")) {
      try {
        await deletePost(id);
        toast.success("Asset collection dropped.");
        loadDashboardData();
      } catch (err) {
        toast.error("Purge aborted.");
      }
    }
  };


  const getDateFilteredMetrics = () => {
    if (!users || users.length === 0) return { seriesData: [0], labels: ["No Data"] };


    const dateGroups = {};
    users.forEach((user) => {
      const dateStr = user.created_at || "Unknown";
      dateGroups[dateStr] = (dateGroups[dateStr] || 0) + 1;
    });

    
    const uniqueSortedDates = Object.keys(dateGroups).sort((a, b) => new Date(a) - new Date(b));

    
    let totalProgressTracker = 0;
    const seriesData = uniqueSortedDates.map((dateKey) => {
      totalProgressTracker += dateGroups[dateKey];
      return totalProgressTracker;
    });

    return {
      seriesData,
      labels: uniqueSortedDates
    };
  };

  const lineMetrics = getDateFilteredMetrics();

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-6 flex flex-col gap-6 font-sans antialiased text-slate-800">
      
      <div className="flex justify-between items-center w-full bg-white px-6 py-3.5 rounded-2xl border border-slate-200/60 shadow-xs">
        <span className="flex items-center gap-1 select-none tracking-tight">
          <span className="bg-gradient-to-b from-blue-600 to-sky-400 bg-clip-text text-4xl font-black text-transparent leading-none">
            C
          </span>
          <span className="text-lg font-bold pt-0.5 text-slate-900">ONNECT</span>
        </span>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Create Entry
          </button>
          <div className="flex items-center gap-2 border-l pl-4 border-slate-100">
            <span className="bg-slate-100 text-slate-700 rounded-full h-8 w-8 flex items-center justify-center border border-slate-200/40">
              <UserRound className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-xs text-slate-500 hidden sm:inline">Admin Dashboard</span>
            <button 
            onClick={logout}
            className="flex flex-row gap-2 text-sm items-center ms-3 border-2 py-1 text-red-700 active:scale-105 transition-all duration-300 px-4 rounded-full cursor-pointer bg-red-500/40 border-red-300">
                <LogOut size={18}/>
                Logout
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[
          { label: "Total Users", count: users.length, icon: UsersRound, style: "from-blue-500 to-indigo-500" },
          { label: "Shared Posts", count: posts.length, icon: Image, style: "from-emerald-500 to-teal-500" },
          { label: "Interactions", count: likes.length, icon: Heart, style: "from-rose-500 to-pink-500" },
          { label: "Chats Logged", count: messages.length, icon: MessageSquare, style: "from-amber-500 to-orange-500" }
        ].map((box, index) => (
          <div key={index} className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs flex items-center justify-between group">
            <div className="flex items-center gap-3.5">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${box.style} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                <box.icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{box.label}</span>
                <span className="text-xl font-black tracking-tight text-slate-900 mt-0.5">{loading ? "••" : box.count}</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
          </div>
        ))}
      </div>

  
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        
       
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs lg:col-span-2 flex flex-col gap-2 min-h-[260px]">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registration Volume By Date</span>
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          </div>
          <div className="w-full flex-1 flex items-center justify-center h-full min-h-[190px]">
            {!loading && (
              <LineChart
                xAxis={[{ scaleType: 'point', data: lineMetrics.labels }]}
                series={[{ data: lineMetrics.seriesData, area: true, color: '#3b82f6' }]}
                height={200}
                margin={{ top: 20, bottom: 20, left: 30, right: 20 }}
                slotProps={{ legend: { hidden: true } }}
              />
            )}
          </div>
        </div>


        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col gap-2 min-h-[260px]">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Activity Index</span>
          <div className="w-full flex-1 flex items-center justify-center h-full min-h-[190px]">
            {!loading && (
              <BarChart
                xAxis={[{ scaleType: 'band', data: ['Posts', 'Likes', 'Chats'] }]}
                series={[{ data: [posts.length, likes.length, messages.length], color: '#0f172a' }]}
                height={200}
                margin={{ top: 20, bottom: 20, left: 30, right: 10 }}
                slotProps={{ legend: { hidden: true } }}
              />
            )}
          </div>
        </div>

      </div>

      {/* Database View Table Panels */}
      <div className="w-full bg-white border border-slate-200/60 rounded-2xl shadow-xs overflow-hidden flex-1">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40">
            <button 
              onClick={() => setActiveTab("users")}
              className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all ${activeTab === "users" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-700"}`}
            >
              Identities
            </button>
            <button 
              onClick={() => setActiveTab("posts")}
              className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all ${activeTab === "posts" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-700"}`}
            >
              Assets
            </button>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-200/60 font-bold uppercase tracking-wider text-slate-400 rounded-md">
            Operational View
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          {activeTab === "users" ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-6">User Description</th>
                  <th className="py-3 px-6">Email Network</th>
                  <th className="py-3 px-6">Registry Timestamp</th>
                  <th className="py-3 px-6 text-center">Graph Vector</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-6 flex items-center gap-3">
                      <img src={u.profile_pic || asset.nouser} alt="" className="h-7 w-7 rounded-full border object-cover bg-slate-50 shrink-0" />
                      <div className="flex flex-col"><span className="font-bold text-slate-900">{u.username}</span><span className="text-[10px] text-slate-400">Idx: {u.id}</span></div>
                    </td>
                    <td className="py-3 px-6 text-slate-500">{u.email}</td>
                    <td className="py-3 px-6 text-slate-400">{u.created_at || "N/A"}</td>
                    <td className="py-3 px-6 text-center">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50/60 px-1.5 py-0.5 rounded mr-1">In: {u.followers?.length || 0}</span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Out: {u.following?.length || 0}</span>
                    </td>
                    <td className="py-3 px-6 text-right space-x-1">
                      <button onClick={() => openEditModal(u)} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-6">Media Array</th>
                  <th className="py-3 px-6">Uploader</th>
                  <th className="py-3 px-6">Caption Headers</th>
                  <th className="py-3 px-6">Geotag Vector</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-6">
                      {p.image_address ? (
                        <img src={p.image_address} alt="" className="h-9 w-14 object-cover rounded border bg-slate-50" />
                      ) : <span className="text-[10px] text-slate-400 italic">Video Element</span>}
                    </td>
                    <td className="py-3 px-6 font-mono text-slate-400 text-[11px]">ID #{p.userId}</td>
                    <td className="py-3 px-6 font-medium text-slate-700 truncate max-w-[200px]">{p.post_caption || "Untitled"}</td>
                    <td className="py-3 px-6 text-slate-400">📍 {p.postLocation || "Local"}</td>
                    <td className="py-3 px-6 text-right">
                      <button onClick={() => handleDeletePost(p.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

  
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm border border-slate-200/80 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-tight">{isEditing ? "Modify Record Identity" : "Initialize New Entity"}</h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Username Handle</label>
                <input required type="text" name="username" value={userForm.username} onChange={handleInputChange} className="w-full px-3 py-1.5 bg-slate-50 text-xs text-slate-800 border border-slate-200 rounded-xl outline-hidden focus:border-slate-400 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Network Email Address</label>
                <input required type="email" name="email" value={userForm.email} onChange={handleInputChange} className="w-full px-3 py-1.5 bg-slate-50 text-xs text-slate-800 border border-slate-200 rounded-xl outline-hidden focus:border-slate-400 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Security Tokens</label>
                <input required={!isEditing} type="password" name="password" value={userForm.password} onChange={handleInputChange} placeholder={isEditing ? "•••••••• (Leave blank to keep current)" : ""} className="w-full px-3 py-1.5 bg-slate-50 text-xs text-slate-800 border border-slate-200 rounded-xl outline-hidden focus:border-slate-400 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cloudinary Asset Route URL</label>
                <input type="text" name="profile_pic" value={userForm.profile_pic} onChange={handleInputChange} placeholder="https://res.cloudinary.com/..." className="w-full px-3 py-1.5 bg-slate-50 text-xs text-slate-800 border border-slate-200 rounded-xl outline-hidden focus:border-slate-400 focus:bg-white transition-all" />
              </div>
              <div className="pt-2 flex justify-end gap-2 text-xs font-semibold">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-xs">Commit Registry</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;