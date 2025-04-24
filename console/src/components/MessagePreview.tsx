interface MessagePreviewProps {
    user: {
      full_name: string;
      avatar_url: string;
      last_message: string;
      other_user_id: string;
    };
    onClick: () => void;  // <-- required prop now
  }
  
  const MessagePreview: React.FC<MessagePreviewProps> = ({ user, onClick }) => {
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      const messagePreviews = document.querySelectorAll('.message-preview');
      const target = event.currentTarget as HTMLElement;
      const container = document.querySelector('.messages-container');
      const chatContainer = document.querySelector('.chat-container') as HTMLElement;
  
      // Existing UI class toggle logic
      if (target.classList.contains('active')) {
        messagePreviews.forEach(preview => preview.classList.remove('active'));
        if (container) {
            container.classList.remove('shrink');
        } 
        if (chatContainer) {
          chatContainer.style.opacity = '0';
          setTimeout(() => { chatContainer.style.display = 'none'; }, 300);
        }
      } else {
        messagePreviews.forEach(preview => preview.classList.remove('active'));
        target.classList.add('active');
        if (container && !container.classList.contains('shrink')) {
          container.classList.add('shrink');
          if (chatContainer) {
            chatContainer.style.display = 'flex';
            setTimeout(() => { chatContainer.style.opacity = '1'; }, 10);
          }
        }
      }
  
      onClick(); 
    };
  
    return (
      <div className="message-preview" onClick={handleClick}>
        <img src={user.avatar_url || "/src/assets/defaultProfilePicture.png"} alt="Profile" className="message-pfp" />
        <div className="message-content">
          <p className="message-name">{user.full_name}</p>
          <p className="message-text">{user.last_message}</p>
        </div>
        <img src="/src/assets/PicIcon.png" alt="Camera" className="camera-icon" />
      </div>
    );
  };
  
  export default MessagePreview;
  