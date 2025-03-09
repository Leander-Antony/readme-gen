// src/components/Login.js
import React from 'react';

const Login = () => {

  const handleGithubLogin = () => {
    window.location.href = 'http://127.0.0.1:8000/github-login/';
  };

  return (
    <div className="login-container">
      <button onClick={handleGithubLogin}>Login with GitHub</button>
    </div>
  );
};

export default Login;
