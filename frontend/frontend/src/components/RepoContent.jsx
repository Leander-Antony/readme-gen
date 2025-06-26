import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const RepoContent = () => {
  const { owner, repo } = useParams();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchRepoContent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://127.0.0.1:8000/repo-data/${owner}/${repo}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setFiles(response.data);
      } catch (error) {
        console.error("Failed to fetch repo content", error);
      }
    };

    fetchRepoContent();
  }, [owner, repo]);

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
        backgroundColor: "#121212",
        color: "#e0e0e0",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          marginBottom: "30px",
          borderBottom: "2px solid #333",
          paddingBottom: "10px",
        }}
      >
        Repository: <span style={{ color: "#80d8ff" }}>{repo}</span>
      </h2>

      {files.map((file, index) => (
        <div
          key={index}
          style={{
            marginBottom: "40px",
            border: "1px solid #2c2c2c",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            padding: "20px",
            background: "#1e1e1e",
            textAlign: "left",
          }}
        >
          <h4
            style={{
              fontSize: "20px",
              marginBottom: "15px",
              color: "#ffffff",
              borderBottom: "1px solid #333",
              paddingBottom: "5px",
            }}
          >
            📄 {file.file_name}
          </h4>
          <SyntaxHighlighter
            language="python"
            style={atomOneDark}
            customStyle={{
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#1e1e1e",
              fontSize: "14px",
              lineHeight: "1.6",
              overflowX: "auto",
            }}
          >
            {file.content}
          </SyntaxHighlighter>
        </div>
      ))}
    </div>
  );
};

export default RepoContent;
