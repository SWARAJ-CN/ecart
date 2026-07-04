import {
  Flame,
  Info,
  Mail,
  UserPlus,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUsers } from "../context/FetchUsers";
import { getPost } from "../services/route";
import toast from "react-hot-toast";

// Local Dummy Data representing what would come from APIs/Assets
const DUMMY_USER_DATA = {
  id: "1",
  username: "John Doe",
  status: "Coding the future 🚀",
  short_bio: "Frontend Developer | Tech Enthusiast",
  email: "johndoe@example.com",
  profile_pic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
  cover_pic: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80"
};

const DUMMY_STATS = {
  followers: [1, 2, 3, 4, 5],
  following: [1, 2, 3]
};

const DUMMY_POSTS = [
  { image_address: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80" },
  { image_address: "https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?auto=format&fit=crop&w=500&q=80" },
  { image_address: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500&q=80" },
  { video_address: "https://www.w3schools.com/html/mov_bbb.mp4" }
];

const UserCard = () => {

  const navigate = useNavigate()

  const [Tab, setTab] = useState("post");
  const [users,setUsers] = useState(null)
  const [userPost,setUserPost]=useState(null)

   
  const { id } = useParams();
  const {getAllUsers}=useUsers()

  //fetch all users
  const fetchUsersFromDb = async () => {

    try {
        const response = await getAllUsers()
        const matched_user = response.find((user)=>user.id==id);
        setUsers(matched_user)
        if(response){
            console.log('Data kitty mone suiiiii : ',response);
            return;   
        }
    } catch (error) {
        console.log(error);
        toast.error('unstable network')
    }
  }

  //fetch post from api route
  const AuthPost = async () => {

    try {
        const response = await getPost()
        const Post = response.data.filter((post)=>post.userId==id)
        setUserPost(Post)
        console.log('Post vannu mone  : ' , response.data.filter((post)=>post.userId==id));
    } catch (error) {
        console.log(error);
        toast.error('unstable network');
    }
  }

  useEffect(()=>{
    fetchUsersFromDb();
    AuthPost()
  },[])

  console.log('id from Individual User card : ', id);
  console.log('ettan vannu makkale ehhh : ',users);
  console.log('User Post : ' , userPost);
  
  return (
    <>
      <div className="min-h-screen md:py-24 w-full flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 pt-20 bg-slate-50">
        <div className="flex flex-col w-full sm:w-11/12 lg:w-4/5 xl:w-3/4 rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-200/60">
          <div className="relative overflow-hidden w-full h-48 sm:h-64 md:h-80 lg:h-96 group/cover">
            <img
              className="object-cover w-full h-full transition-transform duration-700 group-hover/cover:scale-105"
              loading="lazy"
              src={
                users?.cover_pic ||
                "https://i.pinimg.com/originals/6e/72/ec/6e72ec8db8b6b60cc3a4f938a8a36b8d.gif"
              }
              alt=""
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20" />
          </div>
        </div>

        <div className="relative flex flex-col md:flex-row w-full sm:w-11/12 lg:w-4/5 xl:w-3/4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/60 shadow-sm mt-4 items-center md:items-start text-center md:text-left gap-6">
          <div className="h-fit w-fit rounded-full p-1 bg-white ring-4 ring-slate-100 shadow-sm shrink-0 -mt-16 sm:-mt-24 md:-mt-28 relative z-20">
            <div className="relative group rounded-full overflow-hidden h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 bg-slate-100">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={
                  users?.profile_pic 
                }
                alt=""
              />
            </div>
          </div>
          <div className="flex flex-col gap-3.5 items-center md:items-start justify-center w-full">
            <div className="flex items-center flex-row gap-2 w-full max-w-md justify-center md:justify-start">
              <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight break-all">
                {users?.username}
              </h1>
            </div>

            <p className="flex flex-row gap-2 items-center font-medium text-sm sm:text-base text-slate-600">
              <Info size={15} className="text-slate-400" />
              {users?.status || "No status set"}
            </p>

            <div className="flex flex-row gap-4 text-sm font-medium text-slate-500 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full w-fit">
              <span
              //onclick expecting later
              className="flex items-center gap-1.5 cursor-pointer">
                <UserPlus size={14} className="text-slate-400" />{" "}
                <strong className="text-slate-800 ">
                  {users?.followers.length || 0}
                </strong>{" "}
                followers
              </span>
              <span className="text-slate-200 cursor-pointer">|</span>
              <span
             //   onclick expect pinne
              className="cursor-pointer">
                <strong className="text-slate-800 ">
                  {users?.following.length || 0}
                </strong>{" "}
                following
              </span>
            </div>

            <p className="flex gap-2 flex-row items-center font-normal text-sm sm:text-base text-slate-600">
              <Flame size={15} className="text-orange-500" />
              {users?.short_bio || "Using connect"}
            </p>

          </div>
        </div>

        <div className="flex flex-col w-full sm:w-11/12 lg:w-4/5 xl:w-3/4 p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/60 shadow-sm mt-4">
          <div className="w-full md:max-w-md md:mx-auto p-1 bg-slate-100 border border-slate-200/40 rounded-2xl flex flex-row justify-between gap-1 text-xs sm:text-sm font-semibold">
            <span
              onClick={() => {
                setTab("post");
              }}
              className={`cursor-pointer transition-all duration-200 px-4 py-2.5 rounded-xl text-center flex-1 font-semibold tracking-wide ${Tab === "post" ? "bg-white text-indigo-600 shadow-xs border border-slate-200/40" : "text-slate-500 hover:text-slate-800"}`}
            >
              POSTS
            </span>
            <span
              onClick={() => {
                setTab("reel");
              }}
              className={`cursor-pointer transition-all duration-200 px-4 py-2.5 rounded-xl text-center flex-1 font-semibold tracking-wide ${Tab === "reel" ? "bg-white text-indigo-600 shadow-xs border border-slate-200/40" : "text-slate-500 hover:text-slate-800"}`}
            >
              REELS
            </span>
          </div>

          <div
            className={`${Tab === "post" ? "grid" : "hidden"} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 select-none p-2 sm:p-4 mt-4`}
          >
            {userPost
              ?.filter((item) => item.image_address)
              .map((item, index) => (
                <div
                  key={index}
                  className="group relative border border-slate-200/60 bg-slate-50 overflow-hidden aspect-square rounded-2xl cursor-pointer hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={item?.image_address}
                    alt="user_post"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
          </div>

          <div
            className={` ${Tab == "reel" ? `grid` : `hidden`} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 select-none p-2 sm:p-4 mt-4`}
          >
            {userPost
              ?.filter((item) => item.video_address)
              .map((item, index) => ( 
                <div
                  key={index}
                  className="group relative border border-slate-200/60 bg-slate-50 overflow-hidden aspect-square rounded-2xl hover:shadow-md transition-all duration-300"
                >
                  <video
                    src={item?.video_address}
                    className="h-full w-full object-cover"
                    controls
                  ></video>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;