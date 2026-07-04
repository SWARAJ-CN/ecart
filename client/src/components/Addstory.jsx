import { Cloud, Upload, UploadCloud, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { asset } from "../assets/asset";
import { useSound } from "../context/SoundContext";
import { addStory } from "../services/route";
import toast from "react-hot-toast";
import { useUser } from "../context/AuthUser";

const Addstory = ({ openAddStory }) => {
  const { handileClickSound } = useSound();
  const [blob, setBlob] = useState(null);
  const [RowImage, setRowImage] = useState(null);
  const [fileType, setFileType] = useState("");
  const [Loding, setLoadig] = useState(null);
  const [userId, setUserId] = useState(null);
  const { getAuthUser } = useUser();

  const fetchCurrentUser = async () => {
    const response = await getAuthUser();
    setUserId(response?.id);
    console.log("Auth user from add story : ", response, "id :", userId);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const Blob = URL.createObjectURL(file);
    setBlob(Blob);
    setRowImage(file);
    setFileType(file.type);
    // console.log(file.type);
    // console.log(file);
  };
  // console.log(blob);

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
      const Story = {
        userId: userId,
        image: uploadType === "image" ? data.secure_url : "",
        video: uploadType === "video" ? data.secure_url : "",
        created_at: new Date().toLocaleDateString(),
        posted_at: new Date().toISOString(),
      };

      await addStory(Story);
      toast.success("Story Added");

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

  useEffect(() => {
    fetchCurrentUser();
  });

  return (
    <>
      <div className="w-full relative bg-white overflow-hidden h-150 border-3 rounded-2xl p-3 border-slate-100 shadow-md">
        <div className="w-full border-b-3 border-slate-300 shadow-lg overflow-hidden h-120 rounded-2xl bg-slate-200  ">
          {Loding && (
            <div className="absolute inset-0 z-20 flex flex-col gap-2 items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="inline-block h-20 w-20 rounded-full border-8 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-transparent animate-spin"></span>
              <span className="animate-pulse text-white font-medium">
                Uploading...
              </span>
            </div>
          )}

          {fileType.startsWith("image/") ? (
            <img
              src={blob || asset.add}
              className="flex h-full w-full object-contain"
              alt="Preview"
            />
          ) : blob ? (
            <video
              className="h-full w-full object-contain rounded-lg bg-black"
              src={blob}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={asset.add}
              className="flex h-full w-full object-contain"
              alt="Upload"
            />
          )}
        </div>
        <div className="px-5 w-full h-20 border-3 mt-2 rounded-2xl justify-between border-slate-100 shadow-md bg-slate-300/60 flex flex-row gap-3 items-center overflow-hidden">
          <label
            htmlFor="Upload"
            className="border-2 px-5 text-gray-600 active:scale-105 py-1 rounded-full shadow-md border-slate-50 bg-slate-300 cursor-pointer flex flex-row gap-2 items-center justify-center"
            onClick={() => {
              handileClickSound();
            }}
          >
            <Upload size={17} />
            upload
          </label>
          <input
            type="file"
            name=""
            id="Upload"
            hidden
            onChange={handleImageUpload}
          />
          <button
            className="flex flex-row gap-2 items-center justify-center border-2  px-5 py-1 rounded-full border-slate-200 shadow-md bg-slate-300 text-gray-600 cursor-pointer active:scale-105"
            onClick={() => {
              handlePost();
              handileClickSound();
            }}
          >
            <UploadCloud size={17} />
            Post
          </button>
        </div>
        <span
          className="absolute rounded-full top-0 right-0 bg-slate-300 border-2 border-slate-400 p-1 text-center cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg"
          onClick={openAddStory}
        >
          <X />
        </span>
      </div>
    </>
  );
};

export default Addstory;
