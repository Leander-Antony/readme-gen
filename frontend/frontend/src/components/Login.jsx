// src/components/Login.js
import React from 'react';

const Login = () => {

  const handleGithubLogin = () => {
    window.location.href = 'http://127.0.0.1:8000/github-login/';
  };

  return (
    <div className="login-container">
  <div className="login-box">
    <h1>ReadmeGen</h1>
    <p>Create your readme files in seconds</p>
    <button onClick={handleGithubLogin}>Login with GitHub</button>
  </div>
</div>

  );
};

export default Login;
