import { useState } from 'react';
import johnPork from "/JohnPork.png"

function NewReply() {

    // replyContent: Holds the text inputted by the user
    const [replyContent, setReplyContent] = useState("")

    // charCount: Tracks the number of characters type in the text area
    const [charCount, setCharCount] = useState(0)

    // Updates post content and character count whenever the user types in the text area
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target
        textarea.style.height = "auto"
        textarea.style.height = `${textarea.scrollHeight}px`;

        const text = e.target.value
        setReplyContent(text)
        setCharCount(text.length)
    }

    // Placeholder for handling post submission 
    const handleSubmit = () => {
        console.log({ content: replyContent})
    }

    const user = {
        name: "John Doe",
        profilePicture: johnPork,
        postContent: "This is a sample comment on the post."
    };

    return (
        <div className='ml-[100px]'>
            <div id="Profile Picture and Reply Content" className="grid grid-cols-[100px_1fr] items-center ">
                <div id="User Profile Picture" className='flex self-start justify-center'>
                    <img src={user.profilePicture} alt="Profile Picture" className="w-[70px] h-[70px] rounded-full object-cover" />
                </div>

                <div id="Reply Content" className='w-full h-full text-left'>
                    <div className='items-center '>
                        <p className='text-[18px] font-bold text-black'>{user.name}</p>
                        <textarea
                            maxLength={500}
                            value={replyContent} onChange={handleTextChange}
                            className="w-full h-auto text-black border-0 outline-none resize-none bg-transparent"
                            placeholder={`Reply as ${user.name}`}/>
                        <div className='flex items-center justify-between'>
                            <p className='text-[14px] text-gray-500'>{charCount}/500</p>
                            <button
                                id="replyButton"
                                type="button"
                                onClick={handleSubmit}
                                disabled={replyContent.trim().length === 0}
                                className="ml-auto px-4 py-2 !bg-[#8EB486] text-white rounded-lg focus:outline-none hover:bg-[#7da375] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Reply
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default NewReply;