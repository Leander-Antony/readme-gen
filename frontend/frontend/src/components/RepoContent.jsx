import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const RepoContent = () => {
  const { owner, repo } = useParams();
  const [files, setFiles] = useState([]);
  const [readme, setReadme] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [readmeEditable, setReadmeEditable] = useState("");

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

  const generateReadme = async () => {
    const token = localStorage.getItem("token");

    const prompt = `Generate a professional README.md for the following project files:\n\n${files
      .map((file) => `File: ${file.file_name}\nContent:\n${file.content}\n\n`)
      .join("")}`;

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/llama-readme/",
        { prompt },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.response) {
        setReadme(response.data.response);
        setReadmeEditable(response.data.response);
        setShowModal(true);
      } else {
        alert("Failed to generate README.");
      }
    } catch (error) {
      console.error("Error generating README:", error);
      alert("Error generating README");
    }
  };

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
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
        <button
          onClick={generateReadme}
          style={{
            padding: "10px 20px",
            backgroundColor: "#80d8ff",
            color: "#000",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Generate README
        </button>
      </div>

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

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "50px",
            right: "50px",
            width: "500px",
            height: "70vh",
            backgroundColor: "#1e1e1e",
            color: "#e0e0e0",
            border: "1px solid #444",
            borderRadius: "10px",
            zIndex: 9999,
            boxShadow: "0 0 20px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "10px 20px",
              borderBottom: "1px solid #333",
              backgroundColor: "#292929",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            <strong>📝 Edit README</strong>
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: "none",
                color: "#fff",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
          <textarea
            value={readmeEditable}
            onChange={(e) => setReadmeEditable(e.target.value)}
            style={{
              flex: 1,
              padding: "15px",
              backgroundColor: "#121212",
              color: "#e0e0e0",
              fontSize: "14px",
              border: "none",
              resize: "none",
              outline: "none",
              fontFamily: "monospace",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          />
          <button
            onClick={async () => {
              const token = localStorage.getItem("token");
              try {
                await axios.post(
                  `http://127.0.0.1:8000/commit-readme/${owner}/${repo}/`,
                  { content: readmeEditable },
                  {
                    headers: {
                      Authorization: `Token ${token}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                alert("README committed to GitHub!");
                setShowModal(false);
              } catch (error) {
                console.error("Failed to commit README:", error);
                alert("Error committing README");
              }
            }}
            style={{
              backgroundColor: "#80d8ff",
              color: "#000",
              padding: "10px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            ✅ Set README to Repo
          </button>
        </div>
      )}
    </div>
  );
};

export default RepoContent;
