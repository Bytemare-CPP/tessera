import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import PeerCard from '../components/Cards/PeerCard.tsx';
import PostForm from './Post Components/PostForm.tsx';
import PostCard from './Post Components/PostCard.tsx';
import PostModal from "../components/Post Components/PostModal.tsx"
import { UserContext, User} from '../UserContext';

// Define interfaces for API data
interface Connection {
  connection_id: string;
  user_1: string;
  user_2: string;
  status: string;
  created_at: string;
}

function HomeView() {
  const userContext = useContext(UserContext);
  const [peers, setPeers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    const loadConnections = async () => {
      if (!userContext?.user) {
        setError('No user logged in');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch user's connections
        const connectionsResponse = await axios.get(
          `http://localhost:4000/api/connections/all?user_id=${userContext.user.user_id}`
        );
        const connections: Connection[] = connectionsResponse.data;

        // Get IDs of connected users
        const connectedUserIds = connections
          .map(conn => conn.user_1 === userContext.user!.user_id ? conn.user_2 : conn.user_1)
          .filter(id => id !== userContext.user!.user_id);

        // Fetch profile for each connected user
        const userProfiles: User[] = [];
        for (const userId of connectedUserIds) {
          try {
            const profileResponse = await axios.get(
              `http://localhost:4000/api/users/profile?user_id=${userId}`
            );
            userProfiles.push(profileResponse.data);
          } catch (profileError) {
            console.error(`Error fetching profile for ${userId}:`, profileError);
          }
        }

        setPeers(userProfiles);
        setError(null);
      } catch (err) {
        console.error('Error fetching connections:', err);
        setError('Failed to load connections');
        // Load fallback data
        setPeers(await loadMockData());
      } finally {
        setIsLoading(false);
      }
    };

    loadConnections();
  }, [userContext]);

  // Fallback mock data function
  const loadMockData = async (): Promise<User[]> => {
    return [
      { user_id: '1', full_name: 'Joseph Schmo', avatar_url: '/JohnPork.png', is_active: true },
      { user_id: '2', full_name: 'Jane Doe', avatar_url: '/JohnPork.png', is_active: true },
      { user_id: '3', full_name: 'John Smith', avatar_url: '/JohnPork.png', is_active: true },
      { user_id: '4', full_name: 'Alice Johnson', avatar_url: '/JohnPork.png', is_active: true },
      { user_id: '7', full_name: 'Charlie Davis', avatar_url: '/JohnPork.png', is_active: true },
      { user_id: '9', full_name: 'David Evans', avatar_url: '/JohnPork.png', is_active: true },
    ];
  };

  const handlePeerClick = () => {
    setIsPostModalOpen(true);
  }

  return (
    <div id="HomeViewGrid" className="max-w-7xl mx-auto p-4">
      {/* Current user indicator */}
      {userContext?.user && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
          <p className="font-medium text-black">Logged in as: {userContext.user.full_name}</p>
          <p className="text-xs text-gray-500">ID: {userContext.user.user_id}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading connections...</div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-gray-500 text-sm">Showing mock data instead</p>
        </div>
      ) : (
        <div className="w-[812px] mx-auto grid grid-cols-4 gap-x-6 gap-y-4">
          {peers.length === 0 ? (
            <div className="col-span-4 text-center py-8">
              No connections found. Add some connections to see them here!
            </div>
          ) : (
            peers.map((peer) => (
              <div key={peer.user_id} className="col-span-1">
                <PeerCard name={peer.full_name} profilePicture={peer.avatar_url} onClick={handlePeerClick} />
              </div>
            ))
          )}
        </div>
      )}
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-6 py-2 bg-[#8EB486] text-white rounded-lg"
      >
        New Post
      </button>

      {isModalOpen && <PostForm onClose={() => setIsModalOpen(false)} />}

        <PostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)}>
          <div >
            <PostCard />
          </div>
        </PostModal>
    </div>
  );
}

export default HomeView;