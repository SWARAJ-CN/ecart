import React from 'react'
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'
import TopChats from '../components/TopChats'
import TopFrends from '../components/TopFrends'
import Sponsers from '../components/Sponsers'

const Home = () => {
  return (
    <>
      <div className=" h-screen md:min-h-screen bg-[#f0f2f5] w-full px-2 sm:px-4 py-2 md:py-24">
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-7xl mx-auto">
          
          {/* Left Column side bar */}
          <div className="hidden md:block md:col-span-1 w-full ">
            <Sidebar />
          </div>
  
          {/* Center Column feed  and stry section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 w-full">
           <Feed/>
          </div>
  
          {/* Right Column sponser section */}
          <div className="hidden overflow-hidden overflow-y-scroll scrollbar-none lg:block lg:col-span-1 w-full bg-linear-to-br from-slate-300 to-slate-200 border-3 p-4 shadow-md rounded-2xl border-slate-100  flex flex-col gap-3 h-216">
            <TopChats/>
            <TopFrends/>
            <Sponsers/>
          </div>
  
        </div>
      </div>
    </>
  )
}

export default Home