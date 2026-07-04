import {
  Astroid,
  CloudCheck,
  Edit,
  Flame,
  Image,
  ImageUp,
  Info,
  LogOut,
  Mail,
  Save,
  UserPlus,
  Check,
  X,
  UserRound,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  fetchUser,
  getLikes,
  getPost,
  updateUser,
  deletePost,
} from "../services/route";
import { asset, user_data } from "../assets/asset";
import { useSound } from "../context/SoundContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Profile = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const { handileClickSound } = useSound();
  const [coverEdit, setCoverEdit] = useState(false);
  const [userData, setUserData] = useState(null);
  const [Tab, setTab] = useState("post");
  const [FromPost, setFromPost] = useState(false);
  const [fromApi, setFromApi] = useState(false);
  const [images, setImages] = useState(null);
  const [device, setDevice] = useState(null);
  const [rowImage, setRowImage] = useState(null);
  const [profileRow, setProfieRow] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [Loading, setLoadig] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [postData, setPostData] = useState(null);
  const [likedData, setLikedData] = useState(null);
  const [likedByUser, setLikedByUser] = useState(null);
  const [allPost, setAllPost] = useState(null);
  const [allUsers, setAllusers] = useState(null);

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editFields, setEditFields] = useState({
    username: "",
    status: "",
    short_bio: "",
  });

  const handleCover = () => {
    setCoverEdit((prev) => !prev);
  };

  const user_id = userData?.id;

  const fetUserDatas = async () => {
    const user_data = await fetchUser();
   
    const usersObject = user_data.data.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    setAllusers(usersObject);

    const key = localStorage.getItem("authkey");
    const filter_data = user_data.data.filter((users) => users.email == key);

    getAllPost(filter_data[0].id);
    setUserData(filter_data[0]);
    setEditFields({
      username: filter_data[0]?.username || "",
      status: filter_data[0]?.status || "",
      short_bio: filter_data[0]?.short_bio || "",
    });
  };

  const handleFromPost = () => {
    setFromPost((prev) => !prev);
  };

  const handleCoverApi = async () => {
    setFromApi((prev) => !prev);

    const response = await fetch(
      "https://picsum.photos/v2/list?page=1&limit=20",
    );
    const data = await response.json();
    setImages(data);
  };

  const saveCover = async () => {
    try {
      setLoadig(true);
      const formData = new FormData();
      formData.append("file", rowImage);
      formData.append("upload_preset", "connect_app");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/diclwczg0/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );
      if (response.status === 200) {
        toast.success("Cover image updated");
      }
      const data = await response.json();
      const imageUrl = data.secure_url;

      const updated_user_data = {
        ...userData,
        cover_pic: imageUrl,
      };
      await updateUser(user_id, updated_user_data);
    } finally {
      setLoadig(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setDevice(imageUrl);
    setRowImage(file);
  };

  const handleProfileimage = (e) => {
    const file = e.target.files[0];
    const imageurl = URL.createObjectURL(file);
    setProfileImage(imageurl);
    setProfieRow(file);
  };

  const saveProfile = async () => {
    try {
      setProfileLoading(true);
      const formData = new FormData();
      formData.append("file", profileRow);
      formData.append("upload_preset", "connect_app");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/diclwczg0/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );
      if (response.status === 200) {
        toast.success("Profile photo updated");
      }
      const data = await response.json();
      const imageUrl = data.secure_url;
      setProfieRow(imageUrl);

      const updated_user_data = {
        ...userData,
        profile_pic: imageUrl,
      };
      await updateUser(user_id, updated_user_data);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({ ...prev, [name]: value }));
  };

  const saveAboutDetails = async () => {
    try {
      const updated_user_data = {
        ...userData,
        username: editFields.username,
        status: editFields.status,
        short_bio: editFields.short_bio,
      };
      const response = await updateUser(user_id, updated_user_data);
      if (response) {
        setUserData(updated_user_data);
        setIsEditingAbout(false);
        toast.success("Profile details updated");
      }
    } catch (error) {
      toast.error("Failed to update profile details");
    }
  };

  const getAllPost = async (userid) => {
    const response = await getPost();
    const filter_post = response.data.filter(
      (posts) => posts.userId === userid,
    );
    setPostData(filter_post);
  };

  const handleDeletePost = async (postId) => {
    handileClickSound();
    const result = await Swal.fire({
      title: "Delete this post?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deletePost(postId);
        toast.success("Post deleted successfully");

        setPostData((prevPosts) =>
          prevPosts.filter((post) => post.id !== postId),
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete the post");
      }
    }
  };

  const Logout = async () => {
    const result = await Swal.fire({
      title: "Ready to leave?",
      text: "You'll be signed out of Connect on this device.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Log Out",
      cancelButtonText: "Stay Logged In",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("authkey");
      toast.success("Logout success!");
      setIsAuth(false);
      navigate("/login", { replace: true });
    }
  };

  const likedUserData = async () => {
    try {
      const response = await getLikes();
      setLikedData(response.data);
    } catch (error) {
      console.log(error);
      toast.error("unstable network connection");
    }
  };

  const getAllLikedPost = async () => {
    const response = await getPost();
    const allPosts = response.data;
    const userLikes = likedData?.filter(
      (like) => like.likedUser == userData?.id,
    );
    const likedPosts = allPosts.filter((post) =>
      userLikes?.some((like) => Number(like.postId) === Number(post.id)),
    ); //fahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
    setLikedByUser(likedPosts);
  };

  useEffect(() => {
    fetUserDatas();
    likedUserData();
  }, []);

  useEffect(() => {
    getAllLikedPost();
  }, [likedData]);

  return (
    <>
      <div className="min-h-screen md:py-24 w-full flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 pt-20 bg-slate-50">
        <div className="flex flex-col w-full sm:w-11/12 lg:w-4/5 xl:w-3/4 rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-200/60">
          <div className="relative overflow-hidden w-full h-48 sm:h-64 md:h-80 lg:h-96 group/cover">
            <img
              className="object-cover w-full h-full transition-transform duration-700 group-hover/cover:scale-105"
              loading="lazy"
              src={
                device
                  ? device
                  : userData?.cover_pic ||
                    "https://i.pinimg.com/originals/6e/72/ec/6e72ec8db8b6b60cc3a4f938a8a36b8d.gif"
              }
              alt=""
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20" />

            <span
              onClick={() => {
                handleCover();
                handileClickSound();
              }}
              className="absolute select-none shadow-lg flex flex-row items-center gap-2 right-4 bottom-4 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 py-2 px-4 rounded-xl cursor-pointer text-white text-xs sm:text-sm font-medium border border-white/20"
            >
              <Edit size={14} /> Edit Cover
            </span>
            <button
              onClick={() => {
                handileClickSound();
                saveCover();
              }}
              className={`${!coverEdit ? `flex` : `hidden`} bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer rounded-xl items-center flex-row gap-2 absolute top-4 right-4 text-white px-4 py-2 text-xs sm:text-sm font-medium`}
            >
              <CloudCheck size={16} /> Save Cover
            </button>
            <div
              className={`absolute ${!coverEdit ? `flex` : `hidden`} flex-col gap-1 right-4 bottom-16 text-white bg-slate-900/80 backdrop-blur-xl rounded-2xl p-1.5 text-xs sm:text-sm z-10 border border-slate-800 shadow-xl`}
            >
              <label
                onClick={() => {
                  handileClickSound();
                }}
                htmlFor="coverupload"
                className="flex flex-row gap-2.5 items-center hover:bg-white/10 px-3 py-2 rounded-xl hover:cursor-pointer transition-all duration-200 font-medium"
              >
                <ImageUp size={15} /> Upload photo
              </label>
              <input
                onChange={handleFileChange}
                type="file"
                accept="image/*"
                id="coverupload"
                hidden
              />
            </div>
            <div
              className={` ${FromPost ? `grid` : `hidden`} 
                p-4 sm:p-6 gap-3 overflow-y-auto grid-cols-3 sm:grid-cols-4 md:grid-cols-5 w-full h-full bg-slate-950/80 backdrop-blur-md absolute inset-0 transition-all
                [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full
                `}
            >
              {likedData
                ?.filter((data) => data?.likedUser == userData?.id)
                .map((item, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/5 border border-white/10 aspect-square rounded-2xl overflow-hidden shadow-md cursor-pointer hover:border-white/30 transition-all"
                  >
                    <img
                      className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
                      src={item.image_address}
                      alt="..posted images"
                    />
                  </div>
                ))}
            </div>
            <div
              className={`${fromApi ? `grid` : `hidden`} 
                p-4 sm:p-6 gap-3 overflow-y-auto grid-cols-3 sm:grid-cols-4 md:grid-cols-5 w-full h-full bg-slate-950/80 backdrop-blur-md absolute inset-0 transition-all
                [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full
                `}
            >
              {images?.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-white/5 border border-white/10 aspect-square rounded-2xl overflow-hidden shadow-md cursor-pointer hover:border-white/30 transition-all"
                >
                  <img
                    className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
                    src={item.download_url}
                    alt="..posted images"
                  />
                </div>
              ))}
            </div>
            {Loading && (
              <div className="absolute backdrop-blur-xl flex-col gap-3 bg-slate-950/60 rounded-2xl w-full h-full inset-0 items-center justify-center flex z-50">
                <span className="h-12 w-12 bg-transparent border-2 border-indigo-500 border-t-transparent animate-spin rounded-full"></span>
                <span className="text-white text-sm font-medium tracking-wide">
                  Uploading Cover...
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="relative flex flex-col md:flex-row w-full sm:w-11/12 lg:w-4/5 xl:w-3/4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/60 shadow-sm mt-4 items-center md:items-start text-center md:text-left gap-6">
          <div className="h-fit w-fit rounded-full p-1 bg-white ring-4 ring-slate-100 shadow-sm shrink-0 -mt-16 sm:-mt-24 md:-mt-28 relative z-20">
            <div className="relative group rounded-full overflow-hidden h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 bg-slate-100">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={
                  profileImage
                    ? profileImage
                    : userData?.profile_pic || asset.nouser
                }
                alt=""
              />
              <label
                onClick={() => {
                  handileClickSound();
                }}
                htmlFor="profile"
                className="bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer absolute h-full w-full inset-0 backdrop-blur-xs"
              >
                <Edit color="white" size={22} />
              </label>
              <input
                onChange={handleProfileimage}
                type="file"
                accept="image/*"
                id="profile"
                hidden
              />
              {profileLoading && (
                <div className="text-white absolute w-full h-full inset-0 bg-slate-950/60 backdrop-blur-md flex flex-col items-center justify-center">
                  <span className="w-8 h-8 border-2 border-white border-t-transparent animate-spin rounded-full"></span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3.5 items-center md:items-start justify-center w-full">
            <div className="flex items-center flex-row gap-2 w-full max-w-md justify-center md:justify-start">
              {isEditingAbout ? (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                  <UserRound size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    name="username"
                    value={editFields.username}
                    onChange={handleAboutChange}
                    className="bg-transparent text-sm font-semibold outline-none w-full text-slate-800"
                    placeholder="Username"
                  />
                </div>
              ) : (
                <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight break-all">
                  {userData?.username}
                </h1>
              )}
            </div>

            {isEditingAbout ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full max-w-md focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <Info size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  name="status"
                  value={editFields.status}
                  onChange={handleAboutChange}
                  className="bg-transparent text-sm outline-none w-full text-slate-700"
                  placeholder="Status"
                />
              </div>
            ) : (
              <p className="flex flex-row gap-2 items-center font-medium text-sm sm:text-base text-slate-600">
                <Info size={15} className="text-slate-400" />
                {userData?.status || "No status set"}
              </p>
            )}

            <div className="flex flex-row gap-4 text-sm font-medium text-slate-500 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full w-fit">
              <span className="flex items-center gap-1.5">
                <UserPlus size={14} className="text-slate-400" />{" "}
                <strong className="text-slate-800">
                  {userData?.followers.length || 0}
                </strong>{" "}
                followers
              </span>
              <span className="text-slate-200">|</span>
              <span>
                <strong className="text-slate-800">
                  {userData?.following.length || 0}
                </strong>{" "}
                following
              </span>
            </div>

            {isEditingAbout ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full max-w-md focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <Flame size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  name="short_bio"
                  value={editFields.short_bio}
                  onChange={handleAboutChange}
                  className="bg-transparent text-sm outline-none w-full text-slate-700"
                  placeholder="Short bio"
                />
              </div>
            ) : (
              <p className="flex gap-2 flex-row items-center font-normal text-sm sm:text-base text-slate-600">
                <Flame size={15} className="text-orange-500" />
                {userData?.short_bio || "Using connect"}
              </p>
            )}

            <p className="text-sm flex gap-2 items-center sm:text-base text-slate-500 break-all">
              <Mail size={15} className="text-slate-400" />{" "}
              {userData?.email || "No email updated"}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-3 w-full">
              {isEditingAbout ? (
                <>
                  <button
                    onClick={() => {
                      handileClickSound();
                      saveAboutDetails();
                    }}
                    className="flex flex-row gap-2 items-center cursor-pointer px-5 py-2 rounded-xl shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all duration-200"
                  >
                    <Check size={14} /> Save Profile
                  </button>
                  <button
                    onClick={() => {
                      handileClickSound();
                      setIsEditingAbout(false);
                      setEditFields({
                        username: userData?.username || "",
                        status: userData?.status || "",
                        short_bio: userData?.short_bio || "",
                      });
                    }}
                    className="flex flex-row gap-2 items-center cursor-pointer px-5 py-2 rounded-xl shadow-sm bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all duration-200"
                  >
                    <X size={14} /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handileClickSound();
                    setIsEditingAbout(true);
                  }}
                  className="flex flex-row gap-2 items-center cursor-pointer px-5 py-2 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all duration-200"
                >
                  <Edit size={14} /> Edit Profile
                </button>
              )}

              <button
                onClick={() => {
                  handileClickSound();
                  saveProfile();
                }}
                className={`px-5 flex flex-row items-center gap-2 py-2 border border-emerald-200 rounded-xl shadow-sm ${profileImage ? `flex` : `hidden`} bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer text-sm font-semibold transition-all duration-200`}
              >
                <Save size={14} /> Update Photo
              </button>

              <button
                onClick={() => {
                  handileClickSound();
                  Logout();
                }}
                className={`px-5 flex flex-row items-center gap-2 py-2 border border-rose-200 rounded-xl shadow-sm ${profileImage || isEditingAbout ? `hidden` : `flex`} bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer text-sm font-semibold transition-all duration-200`}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full sm:w-11/12 lg:w-4/5 xl:w-3/4 p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/60 shadow-sm mt-4">
          <div className="w-full md:max-w-md md:mx-auto p-1 bg-slate-100 border border-slate-200/40 rounded-2xl flex flex-row justify-between gap-1 text-xs sm:text-sm font-semibold">
            <span
              onClick={() => {
                handileClickSound();
                setTab("post");
              }}
              className={`cursor-pointer transition-all duration-200 px-4 py-2.5 rounded-xl text-center flex-1 font-semibold tracking-wide ${Tab === "post" ? "bg-white text-indigo-600 shadow-xs border border-slate-200/40" : "text-slate-500 hover:text-slate-800"}`}
            >
              POSTS
            </span>
            <span
              onClick={() => {
                handileClickSound();
                setTab("reel");
              }}
              className={`cursor-pointer transition-all duration-200 px-4 py-2.5 rounded-xl text-center flex-1 font-semibold tracking-wide ${Tab === "reel" ? "bg-white text-indigo-600 shadow-xs border border-slate-200/40" : "text-slate-500 hover:text-slate-800"}`}
            >
              REELS
            </span>
            <span
              onClick={() => {
                handileClickSound();
                setTab("liked");
              }}
              className={`cursor-pointer transition-all duration-200 px-4 py-2.5 rounded-xl text-center flex-1 font-semibold tracking-wide ${Tab === "liked" ? "bg-white text-indigo-600 shadow-xs border border-slate-200/40" : "text-slate-500 hover:text-slate-800"}`}
            >
              LIKED
            </span>
          </div>

          {/* POSTS TAB */}
          <div
            className={`${Tab === "post" ? "grid" : "hidden"} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 select-none p-2 sm:p-4 mt-4`}
          >
            {postData
              ?.filter((item) => item.image_address)
              .map((item, index) => (
                <div
                  key={index}
                  className="group relative border border-slate-200/60 bg-slate-50 overflow-hidden aspect-square cursor-pointer hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={item?.image_address}
                    alt="user_post"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                 
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handileClickSound()
                        handleDeletePost(item.id);
                      }}
                      className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md backdrop-blur-xs transition-transform hover:scale-110 duration-200"
                      title="Delete Post"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* REELS TAB */}
          <div
            className={` ${Tab == "reel" ? `grid` : `hidden`} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 select-none p-2 sm:p-4 mt-4`}
          >
            {postData
              ?.filter((item) => item.video_address)
              .map((item, index) => (
                <div
                  key={index}
                  className="group relative border border-slate-200/60 bg-slate-50 overflow-hidden aspect-square md:h-100 md:w-full hover:shadow-md transition-all duration-300"
                >
                  <video
                    src={item?.video_address}
                    className="h-full w-full object-cover"
                    controls
                  ></video>
                  {/* Delete button wrapper for video reels */}
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(item.id);
                      }}
                      className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md transition-transform hover:scale-110 duration-200"
                      title="Delete Reel"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* LIKED TAB */}
          <div
            className={` ${Tab == "liked" ? `grid` : `hidden`} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full select-none p-8 mt-4 text-center justify-center text-sm font-medium text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50`}
          >
            {likedByUser?.map((item, index) => (
              <div
                key={index}
                className="group relative border border-slate-200/60 bg-slate-50 overflow-hidden aspect-square hover:shadow-md transition-all duration-300"
              >
                {item?.video_address ? (
                  <video
                    src={item?.video_address}
                    className="h-full w-full object-cover"
                    controls
                  ></video>
                ) : (
                  <img
                    src={item?.image_address}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}

                {Object.values(allUsers)
                  .filter((user) => user.id === item.userId)
                  .map((items) => (
                    <div
                      onClick={() => {
                        (navigate(`/profile/${item.userId}`),
                          handileClickSound());
                      }}
                      key={items}
                      className="absolute transition-all flex flex-col gap-3 items-center justify-center duration-500 opacity-0 group-hover:opacity-100 bottom-0 h-0 group-hover:h-50 group-focus:opacity-100 group-focus:h-50 w-full bg-black/5 cursor-pointer backdrop-blur-xs rounded-t-2xl"
                    >
                      <div className="overflow-hidden h-30 w-30 rounded-full bg-white border-4 border-amber-100">
                        <img
                          className="h-full w-full object-cover"
                          src={items.profile_pic || asset.nouser}
                          alt=""
                        />
                      </div>
                      <span className="text-black font-bold bg-white/20 px-5 py-1 rounded-full">
                        @ {items.username}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
