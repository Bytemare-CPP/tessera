import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import defaultProfilePicture from '../assets/defaultProfilePicture.png';
import PostCard from '../components/Post Components/PostCard.tsx';


interface ProfileViewProps {
  // If profileUser is provided then display that user's profile
  // If not, fall back to the logged-in user from UserContext
  profileUser?: {
    user_id: string;
    full_name: string;
    avatar_url: string;
    is_active: boolean;
  }
}

function ProfileView({profileUser }: ProfileViewProps) {
  const userContext = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('posts');
  const navigate = useNavigate();

  if (!userContext) {
    return <div>Error: UserContext is not provided</div>;
  }

  const { user: loggedInUser } = userContext;

  // If profileUser is provided, display that; otherwise, use loggedInUser
  const displayedUser = profileUser || loggedInUser;  

  // If no user is available, show an error message
  if (!displayedUser) {
    return <div>Error: User is not available</div>;
  }

  // Determine if we are viewing our own profile or someone else's
  const isOwnProfile = loggedInUser && displayedUser.user_id === loggedInUser?.user_id;


  const handleMessageClick = () => {
    if (!loggedInUser || !profileUser) return;
  
    navigate('/direct-messages', { state: { selectedUserId: profileUser.user_id } });
  }
  
  

  return (
    <div className="profile-layout">
      {/* Profile Section (Left Panel) */}
      <div className="profile-sidebar">
        <img 
          src={ displayedUser.avatar_url || defaultProfilePicture} 
          alt="Profile" 
          className="profile-image" />
        <h2 className="profile-name">{displayedUser.full_name}</h2>
        <h3 className="profile-bio">Just a regular old guy!</h3>
        <p className="profile-location">Pomona, CA | Joined 20XX</p>
        {/* Only show the message button if you're viewing someone else's profile */}
        {!isOwnProfile && (
          <button 
            className="edit-btn" 
            onClick={() => handleMessageClick()}
          >
            Message
          </button>
        )}
        {/* Only show the edit button if you are on your own profile */}
        {isOwnProfile && <button className="edit-btn">Edit Profile</button>}
        <button className="share-btn">Share Profile</button>
      </div>

      


      {/* Posts Section (Right Panel) */}
      <div className="profile-content">

        {/* Only show all tabs if we are viewing the logged-in user */}
        {isOwnProfile ? (
          <div className="profile-tabs">
            <h2 className={activeTab === 'posts' ? "active-tab" : ""} onClick={() => setActiveTab('posts')}>Posts</h2>
            <h2 className={activeTab === 'replies' ? "active-tab" : ""} onClick={() => setActiveTab('replies')}>Replies</h2>
            <h2 className={activeTab === 'bookmarks' ? "active-tab" : ""} onClick={() => setActiveTab('bookmarks')}>Bookmarks</h2>
          </div>
        ) :(
          // If viewing someone else's profile, only show posts
          <div className="profile-tabs">
            <h2 className="active-tab">Posts</h2>
          </div>
        )}

        <div className="profile-posts">
          {activeTab === 'posts' && <div> <PostCard /> <PostCard/> <PostCard/> </div>} 
          {isOwnProfile && activeTab === 'replies' && <p>Placeholder for replies...</p>}
          {isOwnProfile && activeTab === 'bookmarks' && <p>Placeholder for bookmarks...</p>}
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
