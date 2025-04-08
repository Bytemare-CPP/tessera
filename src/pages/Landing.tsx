import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  
  if (!userContext) {
    return <div>Error: UserContext is not provided</div>;
  }

  // Bob Brown's user info from the API
  const bobBrownUser = {
    user_id: '34f622cb-81e7-4e80-b769-3a655d1df57e',
    full_name: 'Bob Brown',
    avatar_url: 'https://placekitten.com/201/201',
    is_active: true
  };
  
  const handleLogin = () => {
    // Login with Bob Brown (our test user)
    userContext.login(bobBrownUser);
    
    // Navigate to home page
    navigate('/');
  };
  
  const handleRegister = () => {
    // Use the same test user for register too
    userContext.login(bobBrownUser);
    
    // Navigate to home page
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAE8E0] to-[#FDF7F4] flex items-center justify-center">
      <div className="container max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#424242] leading-tight mb-6">
          Real updates from real people.
        </h1>
        <p className="text-xl text-[#666666] mb-8 mx-auto">
          Chronological, intentional, and real. Tessera helps you stay in touch with people you actually care about.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="bg-[#E7A691] hover:bg-[#D8957F] text-[#424242] text-lg font-medium py-3 px-8 rounded-lg shadow-md transition-all duration-300"
            onClick={handleLogin}
          >
            Log In (Test User: Bob Brown)
          </button>
          <button 
            className="bg-transparent hover:bg-[#FAE8E0] text-[#424242] border-2 border-[#E7A691] text-lg font-medium py-3 px-8 rounded-lg shadow-md transition-all duration-300"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;