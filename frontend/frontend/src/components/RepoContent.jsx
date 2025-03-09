// src/components/RepoContent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RepoContent = () => {
  const { owner, repo } = useParams();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch repo content
    const fetchRepoContent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/repo-data/${owner}/${repo}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setFiles(response.data);
      } catch (error) {
        console.error('Failed to fetch repo content', error);
      }
    };

    fetchRepoContent();
  }, [owner, repo]);

  return (
    <div className="repo-content">
      <h2>{repo}</h2>
      {files.map((file, index) => (
        <div key={index}>
          <h4>{file.file_name}</h4>
          <pre>{file.content}</pre>
        </div>
      ))}
    </div>
  );
};

export default RepoContent;
