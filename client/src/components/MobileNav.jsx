import React, { useEffect, useState } from 'react'
import { asset } from '../assets/asset'
import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, BotMessageSquare, FilmIcon, Home, Image, MessageCircle, Plus, TextAlignJustify, X } from 'lucide-react'
import { useSound } from '../context/SoundContext'
import { useUser } from '../context/AuthUser'
import Upload from './Upload'

const MobileNav = () => {

    const {handileClickSound} = useSound()
    const navigate = useNavigate()
    const {getAuthUser} = useUser()
    const [enableMore,setEnableMore]=useState(false)
    const [uploadBox,setUploadedBox] = useState(false)
    const [userProfile,setUserProfile] = useState(null)

    const navigations = [
        {path:'/' , label:<Home className="h-5 w-5"/>},
        {path:'/posts' , label:<Image className="h-5 w-5"/>},
        {path:'/reels',label:<FilmIcon className="h-5 w-5"/>},
    ]
    
    const navmenus = ({ isActive }) => `px-4 py-1.5 rounded-full hover:text-blue-500 border border-slate-200 transition-all ${isActive? `shadow-md bg-blue-100/80 border-blue-200 text-blue-600` : `bg-slate-200/50 text-gray-600`} backdrop-blur-2xl`
    const userProfileImage = async () => {
        const response = await getAuthUser();
        if (response?.profile_pic) {
            setUserProfile(response.profile_pic)
        }
    }

    const handleMenu = () =>{
        setEnableMore((prev)=>!prev)   
    }

    const handlePostMenu = () => {
        setUploadedBox((prev)=>!prev)
    }

    useEffect(()=>{
        userProfileImage()
    },[])

  return (
   <>
    <div className='md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 flex w-[95%] items-center justify-center z-50 bg-slate-100/90 border border-slate-200 shadow-lg rounded-full backdrop-blur-lg'>
       <div className='gap-3 flex flex-row justify-between items-center rounded-full w-full h-fit px-4 py-2'>
        {
            navigations.map((navs,index)=>(
                <NavLink 
                    key={index} 
                    to={navs.path} 
                    className={navmenus}
                    onClick={() => {
                        handileClickSound()
                        setEnableMore(false)
                    }}
                >
                    {navs.label}
                </NavLink>
            ))
        }
        <button 
        onClick={()=>{
            handileClickSound()
            handleMenu()
        }}
        className={`p-2 rounded-full border border-slate-200 transition-all backdrop-blur-2xl active:scale-95 ${enableMore ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-200/50 text-gray-600'}`}>
           { enableMore ? <X className="h-5 w-5"/> : <TextAlignJustify className="h-5 w-5" /> }
        </button>
       </div>
        
        <div className={` ${enableMore?`flex`:`hidden`} gap-4 items-center py-4 border border-slate-200 bg-slate-100/95 backdrop-blur-xl absolute right-0 bottom-16 flex-col w-fit px-3 rounded-full shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-200`}>
            
            <button
            onClick={()=>{
                handileClickSound()
                handlePostMenu()
            }}
            className={`p-2.5 rounded-full bg-white shadow-md flex items-center cursor-pointer transition-all active:scale-95 ${uploadBox ? 'text-red-500 rotate-45 border border-red-200 bg-red-50' : 'text-gray-600'}`}
            >
                <Plus className="h-5 w-5"/>
            </button>

            <button
            onClick={()=>{
                handileClickSound()
                setEnableMore(false)
                navigate('/chatbot')
            }}
            className='bg-white p-2.5 rounded-full shadow-md text-gray-600 active:scale-95 transition-transform'
            >
                <BotMessageSquare className="h-5 w-5"/>
            </button>
           
            <NavLink 
            to='/messages'
             onClick={() => { handileClickSound(); setEnableMore(false); }}
             className={({isActive}) => `bg-white p-2.5 rounded-full shadow-md active:scale-95 transition-transform ${isActive ? 'text-blue-500' : 'text-gray-600'}`}
             >
                <MessageCircle className="h-5 w-5"/>
            </NavLink>

            <NavLink 
            to='/notifications'
             onClick={() => { handileClickSound(); setEnableMore(false); }}
             className={({isActive}) => `bg-white p-2.5 rounded-full shadow-md active:scale-95 transition-transform ${isActive ? 'text-blue-500' : 'text-gray-600'}`}
                >
                <Bell className="h-5 w-5"/>
            </NavLink>

            <NavLink
            to='/profile' 
             onClick={() => { handileClickSound(); setEnableMore(false); }}
             className='bg-white border border-slate-200 h-10 w-10 overflow-hidden rounded-full shadow-md active:scale-95 transition-transform flex items-center justify-center flex-shrink-0'>
                <img src={userProfile || "https://cdn-icons-png.flaticon.com/128/16683/16683419.png"} alt="profile" className='h-full w-full object-cover rounded-full'/>
            </NavLink>
        </div>

        {uploadBox && (
            <div className='absolute bottom-16 left-1/2 -translate-x-1/2 w-[92vw] z-50 max-w-sm animate-in fade-in zoom-in-95 duration-150'>
                <Upload />
            </div>
        )}
    </div>
   </>
  )
}

export default MobileNav