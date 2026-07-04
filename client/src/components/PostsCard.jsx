import { Heart, MessageCircle } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSound } from '../context/SoundContext'
import { addLike, removeLike, getLikes, getPost, fetchUser } from '../services/route'
import { useUser } from '../context/AuthUser'

const PostsCard = () => {
    const { handileClickSound } = useSound()
    const { getAuthUser } = useUser()
    const navigate = useNavigate()

    const [posts, setAllPost] = useState([])
    const [users, setAllUsers] = useState([])
    const [likedUserId, setLikedUserId] = useState(null)
    const [likes, setLikes] = useState([])

    const getCurrentUser = async () => {
        try {
            const response = await getAuthUser()
            if (response?.id) {
                setLikedUserId(response.id)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAllPost = async () => {
        try {
            const response = await getPost()
            if (response?.data) {
                setAllPost(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAllUsers = async () => {
        try {
            const response = await fetchUser()
            if (response?.data) {
                setAllUsers(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const allLikes = async () => {
        try {
            const response = await getLikes()
            if (response?.data) {
                setLikes(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleLike = async (postId, postUserId) => {
        if (!likedUserId) return

        const existingLike = likes.find(
            (like) => like?.postId === postId && like?.likedUser === likedUserId
        )

        if (existingLike) {
            setLikes((prev) => prev.filter((like) => like.id !== existingLike.id))
            try {
                await removeLike(existingLike.id)
            } catch (error) {
                console.log(error)
                allLikes()
            }
        } else {
            const temporaryId = Date.now().toString()
            const payload = {
                id: temporaryId,
                postId: postId,
                postUserId: postUserId,
                likedUser: likedUserId,
            }

            setLikes((prev) => [...prev, payload])

            try {
                const response = await addLike({
                    postId: postId,
                    postUserId: postUserId,
                    likedUser: likedUserId,
                })
                
                if (response?.data?.id) {
                    setLikes((prev) =>
                        prev.map((like) =>
                            like.id === temporaryId ? response.data : like
                        )
                    )
                }
            } catch (error) {
                console.log(error)
                allLikes()
            }
        }
    }

    const handleProfileNavigate = (userId) => {
        if (userId) {
            navigate(`/profile/${userId}`)
        }
    }

    useEffect(() => {
        const initData = async () => {
            await getCurrentUser()
            await getAllUsers()
            await getAllPost()
            await allLikes()
        }
        initData()
    }, [])

    return (
        <>
            {posts?.map((post, index) => {

                const postLikes = likes.filter((like) => like?.postId === post.id)
                const isLikedByMe = likes.some((like) => like?.postId === post.id && like?.likedUser === likedUserId)
                const postAuthor = users.find((user) => String(user.id) === String(post.userId))

                return (
                    <div key={post.id || index} className='w-full max-w-2xl mx-auto p-2 sm:p-4'>
                        <div className='w-full border-3 h-auto rounded-t-2xl border-slate-50 shadow-md overflow-hidden flex flex-col'>
                            <div className='w-full gap-3 items-center px-4 sm:px-5 border-b h-15 border-slate-50 shadow-md flex flex-row shrink-0'>
                                <div
                                    onClick={() => {
                                        handleProfileNavigate(post.userId)
                                        handileClickSound()
                                    }}
                                    className='h-10 w-10 rounded-full cursor-pointer border-2 border-slate-200 shadow-md overflow-hidden shrink-0'
                                >
                                    <img
                                        src={postAuthor?.profile_pic || "https://img.magnific.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?semt=ais_hybrid&w=740&q=80"}
                                        alt="..."
                                        className='h-full w-full object-cover'
                                    />
                                </div>
                                <div className='flex flex-col min-w-0 flex-1'>
                                    <span className='text-xs font-semibold truncate'>
                                        {postAuthor?.username || "Unknown User"}
                                    </span>
                                    {post.postLocation && (
                                        <span className='text-[10px] sm:text-xs text-slate-500 truncate'>
                                            {post.postLocation}
                                        </span>
                                    )}
                                </div>
                                <span className='text-[10px] sm:text-xs text-slate-400 shrink-0'>
                                    {postAuthor?.created_at || ""}
                                </span>
                            </div>

                            <div className='w-full h-80 sm:h-96 md:h-120 bg-slate-50 overflow-hidden'>
                                {post?.video_address?
                                    <video
                                        src={post?.video_address}
                                        className='w-full h-full object-cover sm:object-contain'
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                    />
                                    :
                                    <img 
                                    src={post?.image_address} 
                                    alt="" 
                                    className='h-full w-full object-contain'
                                    />
                                }
                        
                            </div>
                        </div>

                        <div className='w-full py-4 items-start px-6 bg-slate-50 border-x border-b border-slate-100 flex flex-col gap-1'>
                            {post.post_caption && (
                                <p className='text-xs sm:text-sm text-slate-800 font-normal leading-relaxed wrap-break-words w-full'>
                                    <span className='font-semibold mr-2'>{postAuthor?.username || "User"}</span>
                                    {post.post_caption}
                                </p>
                            )}
                        </div>

                        <div className='w-full py-6 sm:py-8 items-center px-6 sm:px-10 h-10 border-3 shadow-md border-slate-100 bg-slate-200 flex flex-row justify-between rounded-b-2xl'>
                            <div className='flex flex-row gap-2 items-center'>
                                <Heart
                                    onClick={() => {
                                        handileClickSound()
                                        handleLike(post.id, post.userId)
                                    }}
                                    className={`cursor-pointer active:scale-105 h-5 w-5 sm:h-6 sm:w-6 transition-colors ${
                                        isLikedByMe ? 'fill-red-500 text-red-500' : 'text-slate-700'
                                    }`}
                                />
                                <span className='select-none text-xs sm:text-sm font-medium'>
                                    {postLikes.length}
                                </span>
                            </div>
                            <div
                                onClick={() => {
                                    handileClickSound()
                                }}
                                className='bg-slate-300 shadow-lg border-2 border-slate-100 p-1.5 sm:p-2 rounded-full cursor-pointer transition-transform active:scale-95'
                            >
                                <MessageCircle className='h-4 w-4 sm:h-5 sm:w-5' />
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}

export default PostsCard