import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../context/AuthUser'
import { BotMessageSquare, MessageCircle, Newspaper, UsersRound, Menu, X } from 'lucide-react'
import { asset } from '../assets/asset'

const Sidebar = () => {

    const {getAuthUser} = useUser()
    const navigate = useNavigate()

    const [userData, setUserData] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    const getUserData = async () => {
        const response = await getAuthUser()
        setUserData(response)
    }

    const navigations = [
        {path:'/news', label:<Newspaper className="h-5 w-5"/>, name:'News Feed' },
        {path:'/users', label:<UsersRound className="h-5 w-5"/>, name:'Friends'},
        {path:'/messages', label:<MessageCircle className="h-5 w-5"/>, name:'Messages'},
        {path:'/chatbot', label:<BotMessageSquare className="h-5 w-5"/>, name:'Chat Bot'}
    ]

    useEffect(() => {
        getUserData()
    }, [])

    const toggleSidebar = () => setIsOpen(!isOpen)

    const linkStyle = ({isActive}) => `
        border-2 lg:border-3 border-slate-300 text-gray-500 active:scale-105 
        py-2.5 px-4 lg:px-10 rounded-full shadow-md transition-all duration-300 
        flex gap-4 lg:gap-5 items-center w-full justify-start font-medium text-sm lg:text-base
        ${isActive ? 'bg-slate-300 border-slate-400 text-slate-800' : 'bg-slate-200 hover:bg-slate-100'}
    `

  return (
    <>
      
      <button 
        onClick={toggleSidebar} 
        className='md:hidden fixed top-4 left-4 z-50 bg-slate-200 p-2 rounded-xl shadow-md border border-slate-300 text-gray-700 active:scale-95 transition-transform'
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isOpen && (
        <div 
          onClick={toggleSidebar} 
          className='md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm'
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed md:sticky top-0 md:top-4 left-0 h-full md:h-auto z-40
        w-72 sm:w-80 md:w-full max-w-sm
        bg-slate-300 
        border-r md:border-3 p-4 sm:p-5 shadow-2xl md:shadow-md md:rounded-2xl border-slate-100
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* User profile card */}
        <div className='flex flex-row gap-3 sm:gap-4 items-center py-2 px-3 rounded-2xl shadow-md border-2 border-slate-100 bg-white mt-12 md:mt-0'>
          <div className='flex h-12 w-12 sm:h-14 sm:w-14 border-2 sm:border-3 border-slate-300 bg-slate-200 shadow-md rounded-full overflow-hidden shrink-0'>
            <img  
              src={userData?.profile_pic || asset.nouser}
              className='w-full h-full object-cover'
              alt="user profile" 
            />
          </div>
          <div className='flex flex-col min-w-0'>
             <span className='font-bold truncate text-sm sm:text-base text-slate-800'>{userData?.username || 'Loading...'}</span>
             <span 
               className='text-xs sm:text-sm text-gray-500 cursor-pointer hover:text-blue-600 transition-colors underline decoration-dotted' 
               onClick={() => {
                 navigate('/profile')
                 setIsOpen(false)
               }}
             > 
               View your profile 
             </span>
          </div>
        </div>

        {/* Navigation links */}
        <div className='flex flex-col gap-3 mt-5 border px-3 sm:px-4 py-4 rounded-2xl border-slate-100 shadow-md bg-white'>
           {navigations.map((link, index) => (
            <NavLink 
              key={index} 
              to={link.path} 
              className={linkStyle}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
              <span className='truncate'>{link.name}</span>
            </NavLink>
           ))}
        </div>
      </div>
    </>
  )
}

export default Sidebar