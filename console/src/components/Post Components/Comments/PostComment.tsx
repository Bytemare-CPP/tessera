import johnPork from "/JohnPork.png"
import NewReply from './NewReply.tsx';

interface PostCommentProps {
    openReply: boolean
    setOpenReply: React.Dispatch<React.SetStateAction<boolean>>
}


function PostComment({openReply, setOpenReply}: PostCommentProps) {

    const user = {
        name: "John Doe",
        profilePicture: johnPork,
        postContent: "Wow John Pork would love this!"
    };

    return (
        <div className='ml-[100px] '>
            <div id="Profile Picture and Comment Content" className="grid grid-cols-[100px_1fr] items-center py-5">
                <div id="User Profile Picture" className='flex items-center justify-center'>
                    <img src={user.profilePicture} alt="Profile Picture" className="w-[70px] h-[70px] rounded-full object-cover" />
                </div>

                <div id="Comment Content" className='w-full h-full grid grid-rows-[1fr_1fr] text-left'>

                    <div className='flex items-center '>
                        <p className='text-[18px] font-bold text-black'>{user.name}</p>
                        <p className='ml-2 text-[18px] text-black'>{user.postContent}</p>
                    </div>

                    <div className=''>
                        <button
                            id="replyButton"
                            type="button"
                            style={{ outline: "none" }}
                            onClick={() => setOpenReply((prev) => !prev)}
                            className={` !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none ${openReply ? 'text-red-500' : 'text-black'}`}>
                            {openReply ? 'Cancel Reply' : 'Reply'}
                        </button>
                    </div>
                </div>
            </div>
            {openReply && (
                        <NewReply />
                )}
        </div>
    )
}

export default PostComment;