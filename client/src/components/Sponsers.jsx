import React from "react";
import { asset } from "../assets/asset";
import { Ellipsis } from "lucide-react";

const Sponsors = () => {
  const sponsor_data = [
    {
      image: asset.spotify,
      head: "Trending Playlist: Top Hits Global",
      subHead: "Your daily soundtrack. Listen on Spotify.",
      actionText: "Listen now",
      actionColor: "text-green-600",
      url: "spotify.com/playlist",
    },
    {
      image: asset.insta,
      head: "Shop on Instagram: Daily Drops",
      subHead: "Discover products from creators you follow. Shop directly on Instagram.",
      actionText: "Discover products",
      actionColor: "text-blue-600",
      url: "instagram.com/shop",
    },
  ];

  return (
    <div className="w-full mt-5 max-w-lg bg-[#f8f9fa] rounded-3xl p-6 border border-gray-100 shadow-sm font-sans">
   
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900">Sponsored</h2>
       
        <button className="text-gray-400 hover:text-gray-600 focus:outline-none flex gap-1 items-center p-1">
         <Ellipsis/>
        </button>
      </div>

     
      <div className="flex flex-col gap-6 items-center ">
        {sponsor_data.map((sponsor, index) => (
          <div key={index} className="flex gap-4 items-center">
           
            <div className="w-20 h-20 shrink-0 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
              <img
                src={sponsor.image}
                alt={sponsor.head}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

           
            <div className="flex flex-col flex-1 pt-1">
              <h3 className="text-[15px] font-bold text-gray-900 leading-snug tracking-tight mb-1">
                {sponsor.head}
              </h3>
              <p className="text-xs text-gray-600 leading-normal mb-2">
                {sponsor.subHead}
              </p>
              <a
                href={`https://${sponsor.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm font-semibold cursor-pointer ${sponsor.actionColor} hover:underline mb-0.5`}
              >
                {sponsor.actionText}
              </a>
              <span className="text-[14px] text-gray-500 tracking-wide select-none">
                {sponsor.url}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sponsors;