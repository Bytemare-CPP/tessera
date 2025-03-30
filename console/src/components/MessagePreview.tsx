const MessagePreview = () => {
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const messagePreviews = document.querySelectorAll('.message-preview');
        const target = event.currentTarget as HTMLElement;
        const container = document.querySelector('.messages-container');
        const chatContainer = document.querySelector('.chat-container') as HTMLElement;

        if (target.classList.contains('active')) {
            // If the clicked message preview is already active, remove all highlights and hide chat container
            messagePreviews.forEach(preview => preview.classList.remove('active'));
            if (container) {
                container.classList.remove('shrink');
            }
            if (chatContainer) {
                chatContainer.style.opacity = '0';
                setTimeout(() => {
                    chatContainer.style.display = 'none';
                }, 300); // Match the transition duration
            }
        } else {
            // Remove active class from all message previews
            messagePreviews.forEach(preview => preview.classList.remove('active'));

            // Add active class to the clicked message preview
            target.classList.add('active');

            if (container && !container.classList.contains('shrink')) {
                container.classList.add('shrink');
                if (chatContainer) {
                    chatContainer.style.display = 'flex';
                    setTimeout(() => {
                        chatContainer.style.opacity = '1';
                    }, 10);
                }
            }
        }
    };

    return (
        <div className="message-preview" onClick={handleClick}>
            <img src="/src/assets/defaultProfilePicture.png" alt="Profile" className="message-pfp" />
            <div className="message-content">
                <p className="message-name">Joe Schmo Clone</p>
                <p className="message-text">We have united against you...</p>
            </div>
            <img src="/src/assets/PicIcon.png" alt="Camera" className="camera-icon" />
        </div>
    );
};

export default MessagePreview;