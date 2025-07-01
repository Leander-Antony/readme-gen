import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RepoList = () => {
  const [repos, setRepos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  console.log(document.cookie); // To verify if the token is available in cookies

  // Helper function to get token from cookies
  const getTokenFromCookies = () => {
    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
    if (match) return match[2];
    return null;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get("token");

    if (tokenFromURL) {
      localStorage.setItem("token", tokenFromURL);
      window.history.replaceState({}, document.title, "/repos");
    }

    const storedToken = localStorage.getItem("token");
    console.log("Token from localStorage:", storedToken);

    const fetchRepos = async () => {
      if (!storedToken) {
        setErrorMessage("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/all-repos/", {
          withCredentials: true,
          headers: {
            Authorization: `Token ${storedToken}`,
          },
        });

        if (response.data && response.data.length > 0) {
          setRepos(response.data);
          console.log("Fetched repos:", response.description);
        } else {
          setErrorMessage("No repositories found.");
        }
      } catch (error) {
        console.error("Failed to fetch repos:", error);
        setErrorMessage("Error fetching repositories.");
      }
    };

    fetchRepos();
  }, []);

  const handleRepoClick = (owner, repo) => {
    navigate(`/repo/${owner}/${repo}`);
  };

  return (
    <div className="repo-list">
      {errorMessage && <p>{errorMessage}</p>}
      {repos.length > 0
        ? repos.map((repo) => (
            <div
              className="repo-card"
              key={repo.id}
              onClick={() => handleRepoClick(repo.owner.login, repo.name)}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                margin: "10px 0",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              <h3>{repo.name}</h3>
              <p>
                {repo.description || `A mysterious repo named "${repo.name}"`}
              </p>
            </div>
          ))
        : !errorMessage && <p>Loading repositories...</p>}
    </div>
  );
};

export default RepoList;
