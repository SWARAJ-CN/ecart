import React, { useEffect, useState } from "react";
import { useUsers } from "../context/FetchUsers";
import { getPost } from "../services/route";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const [userData, setUserData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getAllUsers } = useUsers();
  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      const result = await getAllUsers();
      setUserData(result || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getPosts = async () => {
    try {
      const response = await getPost();

      const allPosts = response.data || response || [];

      // Show newest posts first
      const sortedPosts = [...allPosts].sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at) - new Date(a.created_at);
        }

        return b.id - a.id;
      });

      setPosts(sortedPosts);
    } catch (error) {
      console.log(error);
      toast.error("Please check your connection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
    getPosts();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-100">
        <div className="w-12 h-12 rounded-full border-4 border-slate-300 border-t-black animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-24 flex w-full h-screen bg-slate-100 items-center justify-center">
      <div className="relative border-4 overflow-hidden rounded-2xl shadow-xl border-slate-50 h-[800px] w-[400px] flex flex-col bg-black">

        {/* Header */}
        <div className="absolute top-0 left-0 z-20 w-full h-16 bg-gradient-to-b from-black/80 to-transparent flex items-center px-5">
          <h1 className="text-white font-semibold tracking-wide text-lg">
            Posts
          </h1>
        </div>

        {/* Posts */}
        <div className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none">

          {posts
            ?.filter((post) => post.image_address)
            .map((post) => {

              const user = userData.find(
                (user) => user.id === post.userId
              );

              return (
                <div
                  key={post.id}
                  className="w-full h-full snap-start relative overflow-hidden"
                >
                  <img
                    src={post.image_address}
                    alt="post"
                    className="w-full h-full object-contain bg-black"
                  />

                  {/* Bottom Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 text-white">

                    <div
                      onClick={() => navigate(`/profile/${post.userId}`)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <img
                        src={
                          user?.profile_pic ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt=""
                        className="w-11 h-11 rounded-full object-cover border-2 border-white"
                      />

                      <div>
                        <h2 className="font-semibold text-sm">
                          @{user?.username || "Unknown User"}
                        </h2>

                        <p className="text-xs text-gray-300">
                          {post.created_at || "Recently"}
                        </p>
                      </div>
                    </div>

                    {post.post_caption && (
                      <p className="mt-3 text-sm text-gray-100 leading-relaxed">
                        {post.post_caption}
                      </p>
                    )}

                    {post.postLocation && (
                      <p className="text-xs text-gray-400 mt-1">
                        📍 {post.postLocation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Posts;