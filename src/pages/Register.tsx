import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [full_name,setName] = useState("");
  const [avatar_url,setAvatarUrl] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options:{
        data:{
          full_name :full_name,
          avatar_url: avatar_url
        },
      },
    
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data) {
      setMessage("User account created!");
    }

    setEmail("");
    setPassword("");
    setName("");
    setAvatarUrl("");
  };

  return (
    <div className = "bg-gray-200 ">
      <h2>Register</h2>
      <br></br>
      {message && <span>{message}</span>}
      <form onSubmit={handleSubmit}>
        <input 
          className="border border-black text-black"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
          required
        />
        <input
          className="border border-black text-black"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          required
        />
        <input 
            className="border border-black text-black"
            onChange={(e) => setName(e.target.value)}
            value = {full_name}
            type = "Name"
            placeholder="Name"
            required
        />

        <input 
            className="border border-black text-black"
            onChange={(e) => setAvatarUrl(e.target.value)}
            value = {avatar_url}
            type = "text"
            placeholder="Avatar URL"
            required
        />
        
        <button type="submit">Create Account</button>
      </form>
      <span>Already have an account?</span>
      <Link to="/login">Log in.</Link>
    </div>
  );
}

export default Register;