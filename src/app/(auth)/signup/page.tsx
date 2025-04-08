"use client"
import { SignUpAction } from '@/actions/post/sign-up-action';
import React, { useState } from 'react'

export default function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [response, setResponse] = useState<string>("Click submit");

  const handleSubmit = async () => {
    const response = await SignUpAction({
      username, email, password
    });

    setResponse(response.message);
  };

  return (
    <div>
      <div>
        <label htmlFor="username">Username</label>
        <input type="text" id='username' placeholder='enter your username' onChange={ (e) => setUsername(e.target.value) } />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="text" id='email' placeholder='enter your email' onChange={ (e) => setEmail(e.target.value )}  />
      </div>
      <div>
        <label htmlFor="passowrd">Password</label>
        <input type="text" id='password' placeholder='enter your password' onChange={ (e) => setPassword(e.target.value) }/>
      </div>

      <button onClick={ handleSubmit }>Submit</button>

      <br />
      <br />

      <p>{ response }</p>
    </div>
  )
}
