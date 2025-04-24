import React, { useContext, useState } from "react";
import supabaseClient from "../services/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const userContext = useContext(UserContext);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");
    
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password,
         
        });
    
        if (error) {
          setMessage(error.message);
          return;
        }
    
        if (data.user) {
            if (data.user.email) {
                userContext?.login({ 
                    ...data.user, 
                    email: data.user.email, 
                    full_name: data.user.user_metadata?.full_name || "Unknown" 
                }); // Ensure email and full_name are defined
            } else {
                setMessage("User email is undefined.");
            }
            navigate("/");
        }
    
        setEmail("");
        setPassword("");
      };
  

  return (
    <div>
      <h2>Register</h2>
      <br></br>
      {message && <span>{message}</span>}
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Log in</button>
      </form>
      <span>Don't have an account?</span>
      <Link to="/register">Create an Account.</Link>
    </div>
  );
}

export default Login