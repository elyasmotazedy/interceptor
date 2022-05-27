import React, { useState, useEffect } from 'react';
import { setAuth } from '@services/api';
import { login } from '@services/api/auth';

import { useRouter } from 'next/router';
// import './style.css';
const Login = () => {
  const router = useRouter();
  useEffect(() => {
    const accessToken =
      localStorage.getItem('accessToken') &&
      localStorage.getItem('accessToken');
    //set token for apis that need token
    if (accessToken) {
      setAuth(accessToken);
    }
  }, []);

  const [loginData, setLoginData] = useState({
    username: '09121370379',
    password: '123456',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    const username = loginData.username;
    const password = loginData.password;
    try {
      await login(username, password);
      router.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <h1>LOGIN</h1>
        <input
          type="text"
          onChange={handleChange}
          placeholder="username"
          name="username"
          value={loginData.username}
        />
        <input
          type="password"
          onChange={handleChange}
          placeholder="password"
          name="password"
          value={loginData.password}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
