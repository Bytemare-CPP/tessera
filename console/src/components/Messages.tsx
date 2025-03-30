import MessagePreview from './MessagePreview';
import ChatMessages from './ChatMessages';

const Messages = () => {
  return (
    <div className="messages-wrapper">
      <div className="messages-container">
        <div className="messages-content">
        <h2 className="text-xl font-bold border-b py-[18px] border-gray-300">Messages</h2>
          <div className="messages-list">
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
            <MessagePreview />
          </div>
        </div>
      </div>
      <ChatMessages />
    </div>
  );
};

export default Messages;