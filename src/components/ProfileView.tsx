import { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import PostCard from './PostCard';

function ProfileView() {
  const [activeTab, setActiveTab] = useState('posts');
  const userContext = useContext(UserContext);
  if (!userContext) {
    return <div>Error: UserContext is not provided</div>;
  }
  const { user } = userContext;

  if (!user) {
    return <div>Error: User is not available</div>;
  }

  return (
    <div className="profile-layout">
      {/* Profile Section (Left Panel) */}
      <div className="profile-sidebar">
        <img src="/src/assets/defaultProfilePicture.png" alt="Profile" className="profile-image" />
        <h2 className="profile-name">{user.full_name}</h2>
        <h3 className="profile-bio">Just a regular old guy!</h3>
        <p className="profile-location">Pomona, CA | Joined 20XX</p>
        <button className="edit-btn">Edit Profile</button>
        <button className="share-btn">Share Profile</button>
      </div>

      {/* Posts Section (Right Panel) */}
      <div className="profile-content">
        <div className="profile-tabs">
          <h2 className={activeTab === 'posts' ? "active-tab" : ""} onClick={() => setActiveTab('posts')}>Posts</h2>
          <h2 className={activeTab === 'replies' ? "active-tab" : ""} onClick={() => setActiveTab('replies')}>Replies</h2>
          <h2 className={activeTab === 'bookmarks' ? "active-tab" : ""} onClick={() => setActiveTab('bookmarks')}>Bookmarks</h2>
        </div>
        <div className="profile-posts">
          {activeTab === 'posts' && <div> <PostCard /> <PostCard/> <PostCard/> </div>} 
          {activeTab === 'replies' && <p>Placeholder for replies...</p>}
          {activeTab === 'bookmarks' && <p>Placeholder for bookmarks...</p>}
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
