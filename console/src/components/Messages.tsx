import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import MessagePreview from './MessagePreview';
import ChatMessages from './ChatMessages';
import supabaseClient from '../services/supabaseClient';
import { UserContext } from '../UserContext';

const Messages = () => {
  const location = useLocation();
  const userContext = useContext(UserContext);

  if (!userContext) {
    console.error('UserContext is undefined');
    return null;
  }

  const { user } = userContext;
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(location.state?.selectedUserId || null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      const { data, error } = await supabaseClient
        .rpc('get_conversations', { current_user_id: user.user_id });

      if (error) {
        console.error(error);
        return;
      }

      setConversations(data);
    };

    fetchConversations();
  }, [user]);

  return (
    <div className="messages-wrapper">
      <div className="messages-container">
        <div className="messages-content">
          <h2 className="text-xl font-bold border-b py-[18px] border-gray-300">Messages</h2>

          <div className="messages-list">
            {conversations.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No chat history</p>
            ) : (
              conversations.map((c) => (
                <MessagePreview
                  key={c.other_user_id}
                  user={c}
                  onClick={() => {
                    setSelectedUserId(c.other_user_id);
                    setSelectedUser(c);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <ChatMessages
        selectedUserId={selectedUserId}
        selectedUser={selectedUser}
        setSelectedUserId={setSelectedUserId}
        setConversations={setConversations}
      />
    </div>
  );
};

export default Messages;
