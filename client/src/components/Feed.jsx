import { Plus } from "lucide-react";
import React, { useState } from "react";
import Addstory from "./Addstory";
import { useSound } from "../context/SoundContext";
import PostsCard from "./PostsCard";
import { asset } from "../assets/asset";
import Strory from "./Strory";

const Feed = () => {
    
  const { handileClickSound } = useSound();
  const [isStory, setIsStory] = useState(true);
  const [isAddStory, setIsAddStory] = useState(false);

  const openAddStory = () => {
    setIsAddStory((prev) => !prev);
  };

  return (
    <>
      <div className="relative w-full max-w-2xl mx-auto p-2 sm:p-4 flex flex-col gap-4 h-[85vh] md:h-[90vh] shadow-md rounded-2xl border border-slate-300 overflow-y-scroll [&::-webkit-scrollbar]:hidden">
        <div className="w-full items-center flex flex-row gap-3 px-3 overflow-x-scroll h-24 sm:h-28 border-2 border-slate-50 rounded-2xl shadow-lg shrink-0 [&::-webkit-scrollbar]:hidden">
          <div
            onClick={() => {
              handileClickSound();
              openAddStory();
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center cursor-pointer justify-center border-2 rounded-full shadow-md border-slate-200 overflow-hidden active:scale-95 transition-transform"
          >
            <Plus className="text-gray-500 h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <div className="flex flex-row gap-2 items-center justify-center shrink-0">
            <Strory />
          </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 w-[90%] sm:w-96 top-28 sm:top-32 z-50">
          {isAddStory && <Addstory openAddStory={openAddStory} />}
        </div>
        <div className="w-full flex flex-col gap-4 overflow-y-visible">
          <PostsCard />
        </div>
      </div>
    </>
  );
};

export default Feed;
