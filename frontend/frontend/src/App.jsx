// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import RepoList from './components/RepoList';
import RepoContent from './components/RepoContent';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/repos" element={<RepoList />} />
        <Route path="/repo/:owner/:repo" element={<RepoContent />} />
      </Routes>
    </Router>
  );
};

export default App;
