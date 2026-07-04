import { BASE_URL } from './baseurl.js'
import CommonAPI from './config.js'

//------------------------------------------------user section--------------------------------------------------------------------------------------------

// add data section

export const addUser = async (reqbody) => {                                                                 
    return CommonAPI("post",`${BASE_URL}/users`,reqbody)
}

export const sendChatMessage = async (payload)=>{
    return CommonAPI("post", `${BASE_URL}/messages`, payload)
}

export const addPost = async (reqbody)=>{
    return CommonAPI("post",`${BASE_URL}/posts`,reqbody)
}

export const addLike =  async (reqBody) => {
    return CommonAPI("post",`${BASE_URL}/likes`,reqBody)
}

//update section

export const updateUser = async (id,reqbody)=>{
    return CommonAPI("put",`${BASE_URL}/users/${id}`,reqbody)
}


// get section

export const fetchUser = async()=>{
    return CommonAPI("get",`${BASE_URL}/users` ,"")
}


export const fetchMessages = async (userId, contactId)=>{
    return CommonAPI("get", `${BASE_URL}/messages?userId=${userId}&contactId=${contactId || ''}`, "")
}

export const getPost =  async () => {
    return CommonAPI("get",`${BASE_URL}/posts` ,"")
}

export const getLikes = async ()=>{
    return CommonAPI("get",`${BASE_URL}/likes` ,"")
}

export const addStory = async (reqbody) => {
    return CommonAPI("post",`${BASE_URL}/story`,reqbody)
}
export const getStory = async () => {
    return CommonAPI("get",`${BASE_URL}/story` ,"")
}



// delete section 

export const removeLike = async (likeId) => {
    return CommonAPI("delete", `${BASE_URL}/likes/${likeId}`, {})
}

export const deleteStory = (id) => {
    return CommonAPI("delete", `${BASE_URL}/story/${id}`,"");
}

export const deletePost = async (id) =>{
    return CommonAPI("delete",`${BASE_URL}/posts/${id}`,"")
}

//-------------------------------------------Admin section-----------------------------------------

export const getAdminCredentials = async ()=>{
    return CommonAPI("get",`${BASE_URL}/admin`,"")
}
