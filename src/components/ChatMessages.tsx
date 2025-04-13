import { useContext, useEffect, useState, useRef } from "react";
import supabaseClient from "../services/supabaseClient";
import { UserContext } from "../UserContext";
import { useRealtimeMessages } from "../services/messages";

interface ChatMessagesProps {
  selectedUserId: string | null;
  selectedUser: {
    full_name: string;
    avatar_url: string;
  } | null;
  setSelectedUserId: (id: string | null) => void;
  setConversations: React.Dispatch<React.SetStateAction<any[]>>;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

const ChatMessages = ({
  selectedUserId,
  selectedUser,
  setSelectedUserId,
  setConversations,
}: ChatMessagesProps) => {
  const { user } = useContext(UserContext) || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const fetchMessages = async () => {
    if (!user || !selectedUserId) return;

    const { data, error } = await supabaseClient
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.user_id},receiver_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},receiver_id.eq.${user.user_id})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setMessages(data || []);
  };

  // Initial Fetch on User Select
  useEffect(() => {
    const chatContainer = document.querySelector(
      ".chat-container"
    ) as HTMLElement;
    if (!chatContainer) return;

    if (selectedUserId) {
      chatContainer.style.display = "flex";
      fetchMessages();
      setTimeout(() => {
        chatContainer.style.opacity = "1";
      }, 10);
    } else {
      chatContainer.style.opacity = "0";
      setTimeout(() => {
        chatContainer.style.display = "none";
      }, 300);
    }
  }, [selectedUserId]);

  // Real-time Append New Msg
  useRealtimeMessages((newMsg) => {
    if (!selectedUserId || !user) return;

    const isRelevant =
      (newMsg.sender_id === user.user_id &&
        newMsg.receiver_id === selectedUserId) ||
      (newMsg.sender_id === selectedUserId &&
        newMsg.receiver_id === user.user_id);

    if (isRelevant) {
      // Realtime Update Chat Bubble
      setMessages((prev) => [...prev, newMsg]);

      // Realtime Update Preview
      setConversations((prev) =>
        prev.map((conv) =>
          conv.other_user_id === selectedUserId
            ? { ...conv, last_message: newMsg.content }
            : conv
        )
      );
    }
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedUserId) return;

    const content = newMessage.trim();

    // Only update last message in sidebar immediately
    setConversations((prev) =>
      prev.map((conv) =>
        conv.other_user_id === selectedUserId
          ? { ...conv, last_message: content }
          : conv
      )
    );

    setNewMessage("");

    const { error } = await supabaseClient.from("messages").insert([
      {
        sender_id: user.user_id,
        receiver_id: selectedUserId,
        content,
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleClose = () => {
    const chatContainer = document.querySelector(
      ".chat-container"
    ) as HTMLElement;
    const messageContainer = document.querySelector(
      ".messages-container"
    ) as HTMLElement;
    const messagePreviews = document.querySelectorAll(".message-preview");

    messagePreviews.forEach((preview) => preview.classList.remove("active"));

    if (chatContainer) {
      chatContainer.style.opacity = "0";
      setTimeout(() => {
        chatContainer.style.display = "none";
      }, 300);
    }
    if (messageContainer) {
      messageContainer.classList.remove("shrink");
    }

    setSelectedUserId(null);
  };

  return (
    <div className="chat-container flex flex-col justify-between h-full">
      {!selectedUserId ? (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          Select a chat to start messaging
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="border-b py-2 border-gray-300 flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={
                  selectedUser?.avatar_url ||
                  "/src/assets/defaultProfilePicture.png"
                }
                alt="Profile"
                className="inline-block w-12 h-12 mx-2 rounded-full"
              />
              <h2 className="ml-2 text-xl font-bold">
                {selectedUser?.full_name || "Chat"}
              </h2>
            </div>
            <img
              src="/src/assets/ExitIcon.png"
              alt="Close"
              className="inline-block w-8 h-8 mx-4 cursor-pointer"
              onClick={handleClose}
            />
          </div>

          {/* Messages */}
          <div className="overflow-y-auto p-4 flex-grow">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">
                Say hi and start the conversation!
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex mb-2 ${
                    m.sender_id === user?.user_id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-5 py-3 rounded-2xl text-base ${
                      m.sender_id === user?.user_id
                        ? "text-black"
                        : "text-black"
                    }`}
                    style={{
                      backgroundColor:
                        m.sender_id === user?.user_id ? "#8EB486" : "#E5E7EB", // Your green vs gray
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef}></div>
          </div>

          {/* Send */}
          <div className="send-container border-t pb-3 pt-1 border-gray-300 mt-2 flex items-center justify-between w-full">
            <img
              src="/src/assets/PicIcon.png"
              alt="Camera"
              className="send-picture w-6 h-6 ml-4 mt-2"
            />
            <div className="bg-gray-200 px-4 py-2 rounded-xl text-left flex-grow mt-2 mr-4 ml-4">
              <textarea
                placeholder="Send Message..."
                className="bg-transparent w-full outline-none text-gray-600 resize-none overflow-auto"
                rows={1}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // prevents newline
                    handleSendMessage(); // triggers send
                  }
                }}
                style={{ maxHeight: "150px" }}
              />
            </div>
            <img
              src="/src/assets/SendIcon.png"
              alt="Send"
              className="send-msg w-6 h-6 mr-4 mt-2 cursor-pointer"
              onClick={handleSendMessage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatMessages;
