import { useEffect } from "react";
import Messages from '../components/Messages';

function DirectMessages() {
    useEffect(() => {
        document.body.style.overflow = "hidden"; // Disable scrolling
        return () => {
            document.body.style.overflow = "auto"; // Re-enable scrolling when leaving
        };
    }, []);

    return <Messages />;
}

export default DirectMessages;