import { useState } from 'react';
import johnPork from "/JohnPork.png"
import testImage from "../../assets/catTestImage.jpg"
import commentIcon from "../../assets/postIcons/commentIcon.svg"
import saveIcon from "../../assets/postIcons/saveIcon.svg"
import savedIcon from "../../assets/postIcons/savedIcon.svg"
import repostIcon from "../../assets/postIcons/repostIcon.svg"
import repostedIcon from "../../assets/postIcons/repostedIcon.svg"
import shareIcon from "../../assets/postIcons/shareIcon.svg"
import likeIcon from "../../assets/postIcons/likeIcon.svg"
import likedIcon from "../../assets/postIcons/likedIcon.svg"
import PostComment from './Comments/PostComment.tsx';
import NewComment from './Comments/NewComment.tsx';


function PostCard() {

    const user = {
        name: "John Pork",
        profilePicture: johnPork,
        postContent: "Hey guys! Check out my awsome cool cat. Found her in the dumpster lmao",
    }

    const [postResposted, setPostResposted] = useState(false)
    const [postLiked, setPostLiked] = useState(false)
    const [postSaved, setPostSaved] = useState(false)
    const [openComments, setOpenComments] = useState(false)
    const [openReply, setOpenReply] = useState(false)


    return (
        <div id='post' className="bg-[#FDF7F4] px-5">

            {/* User Profile Picture + User Name and Post Content */}
            <div id="profilePictureAndPostContent" className="grid grid-cols-[100px_1fr] items-center py-5">
                <div id="User Profile Picture" className='flex items-center justify-center'>
                    <img src={user.profilePicture} alt="Profile Picture" className="w-[80px] h-[80px] rounded-full object-cover" />
                </div>

                <div id="Post Content" className='w-full h-full grid grid-rows-[1fr_1fr] text-left'>
                    <p className='text-[18px] text-black font-bold '>{user.name}</p>
                    <p className='text-[#424242]'>{user.postContent}</p>
                </div>
            </div>

           
            <div id="postImageDiv" className='w-1/2 mx-auto h-auto my-4 flex items-center justify-center'>
                    <img 
                        src={testImage}
                    />
            </div>
            

            {/* Post Buttons */}
            <div id="postOptions" className='grid grid-cols-[250px_1fr] items-center justify-between'>
                <div id='postButtonsLeftSide' className='flex items-center ml-[100px] justify-between'>

                    {/* Comment Button */}
                    <button
                        id="commentButton"
                        type="button"
                        style={{ outline: "none" }}
                        onClick={() => setOpenComments((prev) => !prev)}
                        className="w-7 h-7 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none"
                    >
                        <div className="flex items-center justify-center w-full h-full">
                            <img src={commentIcon} alt="Comment Icon" className="w-10 h-10" />
                        </div>
                    </button>

                    {/* Repost Button */}
                    <button
                        id="repostButton"
                        type="button"
                        style={{ outline: "none" }}
                        onClick={() => setPostResposted((prev) => !prev)}
                        className="w-9 h-9 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none">
                        <div className="flex items-center justify-center w-full h-full">
                            <img 
                                src={postResposted ? repostedIcon : repostIcon} 
                                alt="Repost Icon" 
                                className="w-10 h-10"/>
                        </div>
                    </button>

                    {/* Like Button */}
                    <button
                        id="likeButton"
                        type="button"   
                        style={{ outline: "none" }}
                        onClick={() => setPostLiked((prev => !prev))}
                        className="w-9 h-9 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none">
                        <div className="flex items-center justify-center w-full h-full">
                            <img 
                                src={postLiked ? likedIcon: likeIcon} 
                                alt="Like Icon" 
                                className="w-10 h-10" 
                                />
                        </div>
                    </button>
                </div>

                <div id='postButtonsRightSide' className='flex items-center justify-end mr-[100px]'>
                    {/* Save Button */}
                    <button
                        id="saveButton"
                        type="button"
                        style={{ outline: "none" }}
                        onClick={() => setPostSaved((prev) => !prev)}
                        className="w-10 h-10 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none">
                        <div className="flex items-center justify-center w-full h-full">
                            <img 
                                src={postSaved ? savedIcon : saveIcon} 
                                alt="Save Icon" 
                                className="w-full h-full object-contain" />
                        </div>
                    </button>

                    {/* Share Button */}
                    <button
                        id="shareButton"
                        type="button"
                        style={{ outline: "none" }}
                        className="w-7 h-7 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none">
                        <div className="flex items-center justify-center w-full h-full">
                            <img src={shareIcon} alt="Share Icon" className="w-10 h-10" />
                        </div>
                    </button>
                </div>
                
            </div> {/* Post Buttons Div End */}

            {openComments && (
                // Comments Div
                <div id='commentsDiv' className='w-full h-auto my-4'>
                    <PostComment openReply={openReply} setOpenReply={setOpenReply}/>

                    {/* Only show NewComment when reply box is NOT open */}
                    {!openReply && <NewComment />}
                </div>
            )}

        </div> //Post Div End
    )
}

export default PostCard; 