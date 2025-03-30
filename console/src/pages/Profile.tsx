import { useEffect } from "react";
import ProfileView from "../components/ProfileView";

function Profile() {
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable scrolling
    return () => {
      document.body.style.overflow = "auto"; // Re-enable scrolling when leaving
    };
  }, []);

  return (
    <div className="profile-container">
      <ProfileView />
    </div>
  );
}

export default Profile;
