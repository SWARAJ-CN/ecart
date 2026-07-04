import React, { useEffect, useState } from "react";
import { useSound } from "../context/SoundContext";
import { UploadCloud, UploadIcon } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import toast from "react-hot-toast";
import { useUser } from "../context/AuthUser";
import { addPost } from "../services/route";
import { asset } from "../assets/asset";

const Upload = () => {
  const { getAuthUser } = useUser();
  const { handileClickSound } = useSound();
  
  const [blob, setBlob] = useState(null);
  const [fileType, setFileType] = useState("");
  const [RowImage, setRowImage] = useState(null);
  const [loading, setLoadig] = useState(false);
  const [userId, setUserId] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const Blob = URL.createObjectURL(file);
    setBlob(Blob);
    setRowImage(file);
    setFileType(file.type);
  };

  const handlePost = async () => {
    if (!RowImage) {
      toast.error("Please select a file first!");
      return;
    }
    try {
      setLoadig(true);
      const file = RowImage;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "connect_app");

      const uploadType = file.type.startsWith("video/") ? "video" : "image";
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/diclwczg0/${uploadType}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      const postData = {
        userId: userId,
        image_address: uploadType === "image" ? data.secure_url : "",
        video_address: uploadType === "video" ? data.secure_url : "",
        post_caption: caption,
        postLocation: location,
        created_at: new Date().toLocaleDateString()
      };

      await addPost(postData);
      toast.success("Post Added");
      
      setBlob(null);
      setRowImage(null);
      setFileType("");
      setCaption("");
      setLocation("");
    } catch (err) {
      console.log(err);
      toast.error("Upload Failed try again!!");
    } finally {
      setLoadig(false);
    }
  };

  const getUserDetails = async () => {
    const response = await getAuthUser();
    if (response?.id) setUserId(response.id);
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <>
  
      <div className="absolute top-full mt-2 right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 w-[92vw] sm:w-112.5 md:w-150 bg-blue-50 shadow-2xl border-2 sm:border-3 border-slate-50 rounded-2xl flex flex-col gap-3 p-3 sm:p-4 z-50 overflow-hidden">
        
        <div className="w-full flex flex-col gap-3">
          <div className="relative w-full overflow-hidden border-2 border-slate-50 rounded-xl bg-slate-300 p-3 shadow-md flex flex-col gap-3">
            
            <div className="w-full h-44 sm:h-60 md:h-72 rounded-xl p-1 shadow-inner overflow-hidden border border-slate-50 bg-linear-to-tr from-blue-200 to-blue-400">
              {fileType.startsWith("video/") ? (
                <video
                  className="h-full w-full object-contain rounded-lg bg-black"
                  src={blob}
                  loop
                  autoPlay
                  muted
                />
              ) : (
                <img
                  className="h-full w-full object-contain rounded-lg"
                  src={
                    blob
                    ||
                     asset.upload
                  }
                  alt="upload preview"
                />
              )}
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                type="text"
                placeholder="Add some texts.."
                className="border w-full h-10 px-3 text-sm rounded-xl outline-none border-slate-50 bg-slate-100 shadow-inner focus:bg-white transition-colors text-slate-800"
              />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                type="text"
                placeholder="Location"
                className="border w-full h-10 px-3 text-sm rounded-xl outline-none border-slate-50 bg-slate-100 shadow-inner focus:bg-white transition-colors text-slate-800"
              />
            </div>

            <div className="w-full pt-1 flex flex-row gap-2 items-center justify-between">
              
              <label
                htmlFor="mobileUploadFile"
                className="px-4 py-2 text-xs sm:text-sm flex flex-row gap-2 items-center border border-slate-400/30 rounded-xl bg-slate-400 text-slate-900 select-none cursor-pointer active:scale-95 transition-all shadow-sm font-medium"
                onClick={() => handileClickSound()}
              >
                <UploadIcon size={16} />
                Upload
              </label>
              
              <input
                onChange={handleImageUpload}
                type="file"
                accept="image/*,video/*"
                hidden
                id="mobileUploadFile"
              />

              <button
                onClick={() => {
                  handileClickSound() 
                  handlePost()
                }}
                className="px-5 py-2 text-xs sm:text-sm flex flex-row gap-2 items-center justify-center border border-blue-600 rounded-xl bg-blue-500 text-white select-none cursor-pointer active:scale-95 transition-all shadow-md font-semibold"
              >
                <UploadCloud size={16} />
                Post
              </button>
            </div>

            {loading && (
              <div className="absolute flex flex-col w-full h-full inset-0 backdrop-blur-md bg-black/40 rounded-xl  items-center justify-center overflow-hidden z-30">
                <div className="h-40 w-40 sm:h-52 sm:w-52">
                  <DotLottieReact
                    src="https://lottie.host/9d7e2567-e492-452d-b8a0-afed52fbaa3b/uYQcs4ENLN.lottie"
                    loop
                    autoplay
                  />
                </div>
                <span className="text-white text-sm font-medium animate-pulse mt-1">Uploading...</span>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;