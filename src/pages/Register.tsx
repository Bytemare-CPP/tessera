import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import bird from "../assets/bird.jpeg"

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [full_name,setName] = useState("");


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options:{
        data:{
          full_name :full_name,
          
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
    
  };

  return (
    <div className="login-box border border-black flex flex-row ">
    
    <div className = 'border border-black w-1/2'>
        <img className='h-1/2' src = {bird} alt = "placeholder"/>
    </div>

    <div className = "bg-gray-200 w-150 h-250 content-center ">
     
      <br></br>
      {message && <span>{message}</span>}
      <form className="flex flex-col w-100 pl-20" onSubmit={handleSubmit}>
      <h2 className="text-black border border-black">Register</h2>
        <input 
          className="border border-black text-black"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
          required
        />
        <label>Email</label>
        <input
          className="border border-black text-black"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          required
        />
        <label>Password</label>
        <input 
            className="border border-black text-black"
            onChange={(e) => setName(e.target.value)}
            value = {full_name}
            type = "Name"
            placeholder="Name"
            required
        />
        <label>Name</label>
        
        
        <button type="submit">Create Account</button>
      </form>
      <span className="text-black text-xl">Already have an account?</span>
      <Link to="/">Log in.</Link>
    </div>
    
    </div>
  );
}

export default Register;