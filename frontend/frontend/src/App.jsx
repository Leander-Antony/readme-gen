import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import RepoList from './components/RepoList';
import RepoContent from './components/RepoContent';
import Layout from './components/Layout';
import './App.css';


const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/repos" element={<RepoList />} />
          <Route path="/repo/:owner/:repo" element={<RepoContent />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
