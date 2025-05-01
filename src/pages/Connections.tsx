import { useEffect, useState, useContext, useRef } from 'react';
import PeerCard from '../components/Cards/PeerCard.tsx';
import VibeMatcherModal from '../components/VibeMatcherModal';
import { UserContext, User } from '../UserContext';
import { IoAdd } from 'react-icons/io5';
import { getUserConnections, getUserProfile } from '../services/userApi';

// Define connection interface
interface Connection {
  connection_id: string;
  user_1: string;
  user_2: string;
  status: string;
  created_at: string;
}

// --- Cache helpers ---
const CACHE_KEY_PREFIX = "connections_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function setCachedConnections(userId: string, data: User[]) {
  const cacheKey = `${CACHE_KEY_PREFIX}_${userId}`;
  localStorage.setItem(
    cacheKey,
    JSON.stringify({ data, timestamp: Date.now() })
  );
}

function Connections() {
  const userContext = useContext(UserContext);
  const [peers, setPeers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showVibeMatcher, setShowVibeMatcher] = useState<boolean>(false);

  // Track last cache timestamp for auto-refresh
  const lastCacheTimestamp = useRef<number | null>(null);

  // Fallback mock data function
  const loadMockData = async (): Promise<User[]> => {
    return [
      { id: '1', full_name: 'Joseph Schmo', avatar_url: '/JohnPork.png', is_active: true },
      { id: '2', full_name: 'Jane Doe', avatar_url: '/JohnPork.png', is_active: true },
      { id: '3', full_name: 'John Smith', avatar_url: '/JohnPork.png', is_active: true },
      { id: '4', full_name: 'Alice Johnson', avatar_url: '/JohnPork.png', is_active: true },
      { id: '7', full_name: 'Charlie Davis', avatar_url: '/JohnPork.png', is_active: true },
      { id: '9', full_name: 'David Evans', avatar_url: '/JohnPork.png', is_active: true },
    ];
  };

  // Extracted for reuse in refresh and auto-refresh
  const loadConnections = async () => {
    if (!userContext?.user) {
      setError('No user logged in');
      setIsLoading(false);
      return;
    }

    const myUserId = userContext.user.id;

    // Try cache first
    const cacheKey = `${CACHE_KEY_PREFIX}_${myUserId}`;
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
      try {
        const { data, timestamp } = JSON.parse(cachedRaw);
        lastCacheTimestamp.current = timestamp;
        if (Date.now() - timestamp < CACHE_TTL) {
          setPeers(data);
          setIsLoading(false);
          return;
        }
      } catch {
        // Ignore parse errors, fall through to fetch
      }
    }

    try {
      // Use our API service instead of direct axios call
      const { data: connections } = await getUserConnections(myUserId);

      // Get IDs of connected users - properly typed now
      const connectedUserIds = (connections as Connection[])
        .map((conn: Connection) => conn.user_1 === myUserId ? conn.user_2 : conn.user_1)
        .filter(id => id !== myUserId);

      // Fetch profile for each connected user
      const userProfiles: User[] = [];
      for (const userId of connectedUserIds) {
        try {
          const { data: profile } = await getUserProfile(userId);
          userProfiles.push(profile);
        } catch (profileError) {
          console.error(`Error fetching profile for ${userId}:`, profileError);
        }
      }

      setPeers(userProfiles);
      setCachedConnections(myUserId, userProfiles);
      lastCacheTimestamp.current = Date.now();
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

  // Auto-refresh: check cache age on mount and when window/tab regains focus
  useEffect(() => {
    loadConnections();

    // Handler for focus event
    const handleFocus = () => {
      if (!userContext?.user) return;
      const cacheKey = `${CACHE_KEY_PREFIX}_${userContext.user.id}`;
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        try {
          const { timestamp } = JSON.parse(cachedRaw);
          // If cache expired, reload
          if (Date.now() - timestamp >= CACHE_TTL) {
            setIsLoading(true);
            loadConnections();
          }
        } catch {
          setIsLoading(true);
          loadConnections();
        }
      } else {
        setIsLoading(true);
        loadConnections();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userContext]);

  console.log("Peers data:", peers);

  return (
    <div className='flex flex-col items-center justify-center'>
      <div id="ConnectionsViewGrid" className="max-w-7xl mx-auto p-4 relative">
        {/* Vibe Matcher button - now centered */}
        <div className="w-full flex justify-center mb-4">
          <button 
            onClick={() => setShowVibeMatcher(true)}
            className="w-16 h-16 rounded-full !bg-[#8EB486] shadow-lg flex items-center justify-center text-black hover:bg-[#7ca474] transition-colors duration-300"
            aria-label="Take a vibe selfie"
          >
            <IoAdd size={32} />
          </button>
        </div>
        
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
                <div key={peer.id} className="col-span-1">
                  <PeerCard 
                    name={peer.full_name} 
                    profilePicture={peer.avatar_url} 
                    userId={peer.id}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Vibe Matcher Modal */}
        <VibeMatcherModal 
          isOpen={showVibeMatcher} 
          onClose={() => setShowVibeMatcher(false)} 
        />
      </div>
    </div>
  );
}

export default Connections;