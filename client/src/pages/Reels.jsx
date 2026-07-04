import React, { useEffect, useState } from "react";
import { useUsers } from "../context/FetchUsers";
import { getPost } from "../services/route";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Reels = () => {

  const [userData, setUserData] = useState([]);
  const [posts, setPosts] = useState(null);

  const { getAllUsers } = useUsers();
  const navigate = useNavigate('/profile/1')

  const getUsers = async () => {
    const result = await getAllUsers();
    setUserData(result || []);
  };

  const getPosts = async () => {
    try {
      const response = await getPost();
      setPosts(response.data || response || []);
    } catch (error) {
      console.log(error);
      toast.error('unstable network');
    }
  };

  useEffect(() => {
    getUsers();
    getPosts();
  }, []);

  return (
    <div className="py-24 flex w-full h-screen bg-slate-100 items-center justify-center">
      <div className="relative border-4 overflow-hidden rounded-2xl shadow-xl border-slate-50 h-200 w-100 flex flex-col bg-black"> 
        <div className="absolute top-0 left-0 z-10 w-full h-16 bg-linear-to-b from-black/50 to-transparent flex items-center px-4 text-white">
          <span className="font-semibold tracking-wide">Reels</span>
        </div>

        
        <div className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none">
          {posts?.filter((items,index)=>items.video_address).map((post,index) => (
             
              <div key={post?.id} className="w-full h-full snap-start relative shrink-0">
                <video
                  src={post?.video_address} 
                  autoPlay
                  loop
                  playsInline
                  className="h-full w-full object-contain"
                />
                <div className="absolute bottom-6 left-4 right-12 text-white z-10 bg-linear-to-t from-black/60 p-2 rounded-lg">
                 <div
                  onClick={()=>navigate(`/profile/${post.userId}`)} 
                  className=" flex flex-row gap-2 items-center cursor-pointer">
                  <img 
                   className="h-10 w-10 rounded-full"
                   src={userData.find((user)=>user.id === post.userId)?.profile_pic}
                   alt="" 
                  />
                    <p className="font-bold">@
                      {userData.find((user)=>user.id === post.userId)?.username || 'unknown user'}
                    </p>
                 </div>
                  <p className="text-sm opacity-90 line-clamp-2">{post?.post_caption}</p>
                  <p className="text-xs text-gray-400 px-12">{posts?.created_at || 'no date found'}</p>
                </div>
              </div>
            ))}

        </div>

      </div>
    </div>
  );
};

export default Reels;
