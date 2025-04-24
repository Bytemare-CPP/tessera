import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import ProfileView from "../components/ProfileView";
import supabaseClient from "../services/supabaseClient";


interface User {
    user_id: string;
    full_name: string;
    avatar_url: string;
    is_active: boolean;
}

function ProfileWrapper() {
    // Extract the username from the route
    const { username } = useParams<{ username: string }>();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the user data from Supabase based on the username
        async function fetchUserByUsername() {
            setLoading(true);

            try{
                const { data, error } = await supabaseClient
                    .from("profiles")
                    .select("*")
                    .eq("username", username)
                    .single();

                if (error) {
                    console.error("Error fetching user data:", error);
                } else {
                    setProfileUser(data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        }

        if (username) {
            fetchUserByUsername();
        } else {
            setLoading(false);
        }

        }, [username]);

        if (loading) {
            return <div>Loading Profile...</div>;
        }

        if (!loading && !profileUser) return <Navigate to="/error" replace />;

        return(
            <div className="profile-container">
                <ProfileView profileUser={profileUser || undefined} />
            </div>);
    }

    export default ProfileWrapper;