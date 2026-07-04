import React, { useEffect, useState } from "react";
import { asset } from "../assets/asset";
import { X, Trash2 } from "lucide-react"; // Imported Trash2 icon
import toast from "react-hot-toast";
import { useUsers } from "../context/FetchUsers";
import { deleteStory, getStory } from "../services/route";
import { useRef } from "react";

const Story = () => {
  const [isStory, setIsStory] = useState(true);
  const [openStory, setOpenStory] = useState(false);
  const [stories, setStories] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Local state to determine the logged-in user

  const [activeStory, setActiveStory] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [storyLoading, setStoryLoading] = useState(true);

  const [progress, setProgress] = useState(0);

  const videoRef = useRef(null);

  const { getAllUsers } = useUsers();

  const getAllUser = async () => {
    try {
      const response = await getAllUsers();
      const usersData = response?.data || response || [];
      setSystemUsers(usersData);

      // Identify the current logged-in user to authenticate story deletion privileges
      const key = localStorage.getItem("authkey");
      if (key) {
        const matchedMe = usersData.find((user) => user.email === key);
        if (matchedMe) setCurrentUser(matchedMe);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getStories = async () => {
    try {
      const response = await getStory();

      if (response && response.status >= 200 && response.status < 300) {
        const allStories = response.data || [];

        const now = Date.now();

        const validStories = [];

        for (const story of allStories) {
          if (!story.posted_at) {
            validStories.push(story);
            continue;
          }

          const createdTime = new Date(story.posted_at).getTime();

          if (now - createdTime >= 24 * 60 * 60 * 1000) {
            await deleteStory(story.id);
          } else {
            validStories.push(story);
          }
        }

        setStories(validStories);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast.error("Unstable network connection!");
    }
  };

  const handleOpenStory = (story) => {
    const matchingUser = systemUsers.find((user) => user.id === story.userId);
    setActiveStory(story);
    setActiveUser(matchingUser);
    setOpenStory(true);
  };

  const handleCloseStory = () => {
    setOpenStory(false);
    setActiveStory(null);
    setActiveUser(null);
  };

  // Handler to delete a story
  const handleDeleteStory = async (storyId) => {
    try {
      await deleteStory(storyId);
      toast.success("Story deleted successfully");
      // Remove deleted story from UI list dynamically
      setStories((prevStories) => prevStories.filter((s) => s.id !== storyId));
      handleCloseStory();
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story");
    }
  };

  useEffect(() => {
    if (!openStory) return;

    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleCloseStory(); // or open next story
          return 100;
        }

        return prev + 2; // Increase by 2%
      });
    }, 100); // Every 100ms

    return () => clearInterval(interval);
  }, [openStory, activeStory]);
  

  useEffect(() => {
    getStories();
    getAllUser();
  }, []);

  useEffect(() => {
    if (systemUsers.length > 0 && stories.length > 0) {
      const userIdsWithStories = stories.map((story) => story.userId);
      const matchingUsers = systemUsers.filter((user) =>
        userIdsWithStories.includes(user.id),
      );
      setFilteredUsers(matchingUsers);
    }
  }, [systemUsers, stories]);

  useEffect(() => {
    if (activeStory) {
      setStoryLoading(true);
    }
  }, [activeStory]);

  useEffect(() => {
    if (openStory && activeStory?.video && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.log(err);
      });
    }
  }, [openStory, activeStory]);

  return (
    <>
      <div className="flex flex-row gap-3 p-2 overflow-x-auto">
        {stories?.map((story, index) => {
          const storyOwner = systemUsers.find(
            (user) => user.id === story.userId,
          );

          return (
            <div
              key={story.id || index}
              onClick={() => handleOpenStory(story)}
              className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center cursor-pointer border-4 rounded-full shadow-lg overflow-hidden active:scale-95 transition-transform
                ${isStory ? "border-blue-500" : "border-slate-300"}`}
            >
              <img
                src={storyOwner?.profile_pic || asset.nouser}
                alt={`${storyOwner?.username || "User"}'s story`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          );
        })}
      </div>
      {openStory && activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xl p-5">
          <div className="relative w-full max-w-[500px] h-[85vh] bg-white rounded-xl shadow-2xl p-5 overflow-hidden flex flex-col gap-3">
            
            {/* Control buttons layout layer */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
              {/* Only show delete option if the active story belongs to the authorized viewer */}
              {currentUser?.id === activeStory?.userId && (
                <button
                  onClick={() => handleDeleteStory(activeStory.id)}
                  className="cursor-pointer text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors flex items-center justify-center p-1.5 rounded-full"
                  title="Delete story"
                  aria-label="Delete story"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={handleCloseStory}
                className="cursor-pointer text-slate-800 hover:text-slate-500 transition-colors flex items-center justify-center p-1 rounded-full hover:bg-slate-100"
                aria-label="Close story"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-2 text-black flex flex-col h-full">
              <div className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 border-2 border-slate-300 rounded-full shadow-lg overflow-hidden bg-slate-100">
                  <img
                    src={activeUser?.profile_pic || asset.nouser}
                    alt="User avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-md font-medium">
                    {activeUser?.username || "Unknown User"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {(() => {
                      if (!activeStory?.posted_at) return "Recent";

                      const diff = Date.now() - new Date(activeStory.posted_at).getTime();

                      const totalSeconds = Math.floor(diff / 1000);

                      if (totalSeconds < 60) return "Just now";

                      const totalMinutes = Math.floor(totalSeconds / 60);

                      if (totalMinutes < 60) return `${totalMinutes}m ago`;

                      const totalHours = Math.floor(totalMinutes / 60);

                      if (totalHours < 24) return `${totalHours}h ago`;

                      const totalDays = Math.floor(totalHours / 24);

                      return `${totalDays}d ago`;
                    })()}
                  </span>
                </div>
              </div>
               <div className={`w-${progress} ${progress?'visible':'hidden'} rounded-full mt-2 h-1 bg-blue-200 shadow-lg`}>
               </div>
              <div className="mt-4 flex-1 overflow-hidden rounded-2xl bg-gray-900 flex items-center justify-center min-h-[250px] relative">
                {storyLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                    <span className="inline-block h-12 w-12 rounded-full border-4 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-transparent animate-spin"></span>
                  </div>
                )}

                {activeStory.video && activeStory.video.trim() !== "" ? (
                  <video
                    key={activeStory.id}
                    src={activeStory.video}
                    autoPlay
                    muted
                    playsInline
                    loop
                    onLoadedData={() => setStoryLoading(false)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={
                      activeStory.image ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWHNWkbNYWA9KU6gofP5rqXmEiq3jnqvWfog&s"
                    }
                    loading="lazy"
                    onLoad={() => setStoryLoading(false)}
                    onError={() => setStoryLoading(false)}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Story;