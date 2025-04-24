import type React from "react"
import { useState, useRef } from "react"
import johnPork from "/JohnPork.png"
import imageIcon from "../../assets/imageIcon.svg"

interface PostFromProps {
    // Used to close the modal
    onClose: () => void
}

const PostForm: React.FC<PostFromProps> = ({ onClose }) => {

    const user = {
        name: "John Pork",
        profilePicture: johnPork,
    }

    // postContent: Holds the text inputted by the user
    const [postContent, setPostContent] = useState("")

    // allowSharing: Boolean state that indicates if sharing is allowed
    const [allowSharing, setAllowSharing] = useState(false)

    // charCount: Tracks the number of characters type in the text area
    const [charCount, setCharCount] = useState(0)

    // uploadedImage: Holds the data URL of an image file when a user uploads one
    // Starts as null when no image is uploaded
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)

    // fileInputRef: A refernce to the hidden file input element
    // Used to trigger the file seleciton dialog
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Updates post content and character count whenever the user types in the text area
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value
        setPostContent(text)
        setCharCount(text.length)
    }

    // Triggered when user selects a file: converts file to a data URL so it can be previewed
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setUploadedImage(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Clears the uploaded image preview and resets the file input
    const handleRemoveImage = () => {
        setUploadedImage(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    // Clicks the hidden file input to open the file chooser dialog
    const triggerImageUpload = () => {
        fileInputRef.current?.click()
    }

    // Placeholder for handling post submission 
    const handleSubmit = () => {
        console.log({ content: postContent, allowSharing: allowSharing, image: uploadedImage })
        onClose()
    }

    return (

        <div id="overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div id="modalBox" className="bg-[#FDF7F4] max-w-[600px] w-full mx-4 grid grid-rows-[auto_1fr_auto_auto] rounded-lg shadow-lg max-h-[80vh] overflow-auto">

                {/* Close Button */}
                <div id="closeButton" className="flex justify-end p-3">
                    <button type="button" onClick={onClose} style={{ outline: "none" }} className="!w-10 !h-10 !bg-[#FDF7F4] !rounded-full !p-0 !focus:outline-none !border-none !button-focus: none">
                        <svg viewBox="0 0 24 24" className="w-full h-full">
                            <path fill="#000" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>

                {/* Profile Picture and Text Area */}
                <div className="grid grid-cols-[100px_1fr] items-start gap-8 px-5">
                    <img src={user.profilePicture} alt="Profile Picture" className="w-[80px] h-[80px] rounded-full object-cover" />

                    <div className="w-full">
                        <textarea
                            maxLength={280}
                            value={postContent} onChange={handleTextChange}
                            className="w-full h-30 text-black border-0 outline-none resize-none bg-transparent"
                            placeholder="What's on your mind?" />

                        <div className="text-right text-sm text-gray-500">{charCount}/280</div>
                    </div>
                </div>

                {/* Image Preview Section */}
                {uploadedImage && (
                    <div className="px-5 mt-2 mb-3">
                        <div className="relative">
                            <img
                                src={uploadedImage}
                                alt="Uploaded Image Preview"
                                className="w-full max-h-[300px] object-contain rounded-lg border border-gray-300"
                            />

                            <button
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 !bg-black/50 !rounded-full !p-1 hover:bg-black/70 transition-colors"
                                aria-label="Remove Image"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                 {/* Divider */}
                <hr className="border-t border-gray-300 mt-3" />
                
                
                {/* Options and Post Button */}
                <div className="flex items-center space-x-3 px-5 py-5">
                    {/* Hidden Image File Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*"
                        className="hidden"/>

                    <button
                        id="uploadImageButton"
                        type="button"
                        onClick={triggerImageUpload}
                        style={{ outline: "none" }}
                        className="w-10 h-10 !p-0 !bg-[#FDF7F4] focus:outline-none hover:bg-gray-200 !rounded-full transition-colors !border-none !button-focus: none"
                    >
                        <div className="flex items-center justify-center w-full h-full">
                            <img src={imageIcon} alt="Image Icon" className="w-10 h-10"/>
                        </div>
                    </button>

                    {/* Toggle Switch */}
                    <p className="text-black">Allow Sharing:</p>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox"
                            className="sr-only peer"
                            checked={allowSharing}
                            onChange={() => setAllowSharing(!allowSharing)}
                        />

                        <div 
                            id="sharingSwitch" 
                            className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8EB486]">
                        </div>
                    </label>

                    {/* Post Button */}
                    <button
                        id="postButton"
                        type="button"
                        onClick={handleSubmit}
                        disabled={postContent.trim().length === 0}
                        className="ml-auto px-4 py-2 !bg-[#8EB486] text-white rounded-lg focus:outline-none hover:bg-[#7da375] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Post
                    </button>
                </div>
            </div>
        </div>
    )

}

export default PostForm
