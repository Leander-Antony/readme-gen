import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RepoList = () => {
  const [repos, setRepos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  console.log(document.cookie);  // To verify if the token is available in cookies


  // Helper function to get token from cookies
  const getTokenFromCookies = () => {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) return match[2];
    return null;
  };

  useEffect(() => {
    // Store token in localStorage for API use
    const token = getTokenFromCookies();
    if (token) {
      localStorage.setItem('token', token);
    }

    // Fetch all repos from the backend
    const fetchRepos = async () => {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);  // Debugging to check if the token exists
      
      try {
        const response = await axios.get('http://127.0.0.1:8000/all-repos/', {
          withCredentials: true,  // Ensure cookies are being sent
          headers: { Authorization: `Token ${token}` },  // Ensure the token is being sent
        });
        
        if (response.data && response.data.length > 0) {
          setRepos(response.data);
        } else {
          setErrorMessage('No repositories found.');
        }
      } catch (error) {
        console.error('Failed to fetch repos', error);
        setErrorMessage('Error fetching repositories.');
      }
    };
    
    
    
    

    fetchRepos(); // Only call it once
  }, []); // Dependency array is empty to ensure it only runs once after the component mounts

  const handleRepoClick = (owner, repo) => {
    navigate(`/repo/${owner}/${repo}`);
  };

  return (
    <div className="repo-list">
      {errorMessage && <p>{errorMessage}</p>}
      {repos.length > 0 ? (
        repos.map((repo) => (
          <div
            className="repo-card"
            key={repo.id}
            onClick={() => handleRepoClick(repo.owner.login, repo.name)}
            style={{
              border: '1px solid #ddd',
              padding: '10px',
              margin: '10px 0',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            <h3>{repo.name}</h3>
            <p>{repo.description || 'No description available'}</p>
          </div>
        ))
      ) : (
        !errorMessage && <p>Loading repositories...</p>
      )}
    </div>
  );
};

export default RepoList;
