const ChatMessages = () => {
    const handleClose = () => {
        const chatContainer = document.querySelector('.chat-container') as HTMLElement;
        const messageContainer = document.querySelector('.messages-container') as HTMLElement;
        const messagePreviews = document.querySelectorAll('.message-preview');

        // Remove active class from all message previews
        messagePreviews.forEach(preview => preview.classList.remove('active'));

        if (chatContainer) {
            chatContainer.style.opacity = '0';
            setTimeout(() => {
                chatContainer.style.display = 'none';
            }, 300); // Match the transition duration
        }
        if (messageContainer) {
            messageContainer.classList.remove('shrink');
        }
    };

    return (
        <div className="chat-container flex flex-col justify-between h-full">
            <div className="border-b py-2 border-gray-300 flex items-center justify-between">
                <div className="flex items-center">
                    <img src="/src/assets/defaultProfilePicture.png" alt="Profile" className="inline-block w-12 h-12 mx-2" />
                    <h2 className="ml-2 text-xl font-bold">Joe Schmo Clone</h2>
                </div>
                <img src="/src/assets/ExitIcon.png" alt="Close" className="inline-block w-8 h-8 mx-4" onClick={handleClose} />
            </div>
            <p>This is where the chat will appear.</p>
            <div className="send-container border-t pb-3 pt-1 border-gray-300 mt-2 flex items-center justify-between w-full">
                <img src="/src/assets/PicIcon.png" alt="Camera" className="send-picture w-6 h-6 ml-4 mt-2" />
                <div className="bg-gray-200 px-4 py-2 rounded-xl text-left flex-grow mt-2 mr-4 ml-4">
                    <textarea
                        placeholder="Send Message..."
                        className="bg-transparent w-full outline-none text-gray-600 resize-none overflow-auto"
                        rows={1}
                        style={{ maxHeight: '150px' }}
                    />
                </div>
                <img src="/src/assets/SendIcon.png" alt="Send" className="send-msg w-6 h-6 mr-4 mt-2" />
            </div>
        </div>
    );
};

export default ChatMessages;
