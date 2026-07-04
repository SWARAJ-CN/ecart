import React, { useEffect, useState } from "react";
import { useUsers } from "../context/FetchUsers";
import toast from "react-hot-toast";
import { MessageCircle, UserMinus, UserPlus, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../services/route";
import { asset } from "../assets/asset";

const UsersCard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { getAllUsers } = useUsers();

  const getConnectUsers = async () => {
    try {
      const users = await getAllUsers();
      const authKey = localStorage.getItem("authkey");
      const loggedUser = users?.find((user) => user.email === authKey) || null;
      setCurrentUser(loggedUser);
      setUserData(users || []);
    } catch (error) {
      console.error(error);
      toast.error("Unstable network connection");
    }
  };

  useEffect(() => {
    getConnectUsers();
  }, []);

  const handleFollowToggle = async (user) => {
    if (!currentUser) return;

    const targetId = Number(user.id);
    const currentFollowing = Array.isArray(currentUser.following) ? currentUser.following : [];
    const isFollowing = currentFollowing.includes(targetId);

    const nextFollowing = isFollowing
      ? currentFollowing.filter((id) => Number(id) !== targetId)
      : [...currentFollowing, targetId];

    const currentFollowers = Array.isArray(user.followers) ? user.followers : [];
    const nextFollowers = isFollowing
      ? currentFollowers.filter((id) => Number(id) !== Number(currentUser.id))
      : [...currentFollowers, Number(currentUser.id)];

    const updatedCurrentUser = { ...currentUser, following: nextFollowing };
    const updatedTargetUser = { ...user, followers: nextFollowers };

    setCurrentUser(updatedCurrentUser);
    setUserData((prev) =>
      prev.map((item) =>
        item.id === user.id ? updatedTargetUser : item.id === currentUser.id ? updatedCurrentUser : item
      )
    );

    try {
      await updateUser(currentUser.id, updatedCurrentUser);
      await updateUser(user.id, updatedTargetUser);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update follow status");
    }
  };

  const filteredUsers = userData
    .filter((user) => Number(user.id) !== Number(currentUser?.id))
    .filter((user) => {
      const query = searchQuery.toLowerCase();
      const usernameMatch = user?.username?.toLowerCase().includes(query);
      const statusMatch = user?.status?.toLowerCase().includes(query);
      return usernameMatch || statusMatch;
    });

  return (
    <div className="min-h-screen w-full bg-slate-50 pb-12 pt-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-4">
        
        
        <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-2 text-slate-800">
            <Users size={20} className="text-indigo-500" />
            <h2 className="font-bold text-lg">Discover Creators</h2>
          </div>
          
          <div className="relative w-full sm:w-80 flex items-center">
            <Search size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search users or bios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all focus:border-slate-400 focus:bg-white text-slate-800"
            />
          </div>
        </div>

        
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isFollowing = (currentUser?.following || []).includes(Number(user.id));
              
              return (
                <div 
                  key={user.id} 
                  className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 p-4 border border-slate-100 bg-slate-50/60 rounded-2xl w-full transition-all hover:bg-slate-50 hover:border-slate-200"
                >
                 
                  <div 
                    onClick={() => navigate(`/profile/${user.id}`)} 
                    className="flex flex-row gap-4 items-center flex-1 min-w-0 cursor-pointer group"
                  >
                    <div className="overflow-hidden h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full border-2 border-white shadow-md group-hover:scale-102 transition-transform">
                      <img 
                        src={user?.profile_pic || asset.nouser} 
                        alt={user?.username} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        @{user?.username || "connect_user"}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500 truncate mt-0.5">
                        {user?.status || "Hi, I'm using Connect"}
                      </span>
                    </div>
                  </div>

               
                  <div className="flex flex-row gap-3 items-center shrink-0">
                    <button
                      onClick={() => handleFollowToggle(user)}
                      className={`flex flex-row items-center justify-center text-xs sm:text-sm font-semibold gap-2 py-2.5 px-4 rounded-xl border transition-all duration-200 active:scale-95 flex-1 sm:flex-none ${
                        isFollowing 
                          ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50" 
                          : "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {isFollowing ? <><UserMinus size={16} /> Unfollow</> : <><UserPlus size={16} /> Follow</>}
                    </button>
                    <button
                      onClick={() => navigate(`/messages/${user.id}`)}
                      className="flex flex-row gap-2 items-center justify-center text-xs sm:text-sm font-semibold rounded-xl px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white transition-all active:scale-95 flex-1 sm:flex-none"
                    >
                      <MessageCircle size={16} />
                      Message
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
           
            <div className="text-center py-12 text-slate-400 text-sm flex flex-col items-center gap-2">
              <Search size={28} className="text-slate-300" />
              <p className="font-medium text-slate-600">No users found matching "{searchQuery}"</p>
              <p className="text-xs text-slate-400">Try checking spelling or typing a different query terms.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UsersCard;