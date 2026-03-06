"use client";

import { useState } from "react";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;

    setLoading(true);

    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    setImage(data.image);
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>AI Image Generator</h1>
      <input
        type="text"
        placeholder="Describe the image..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginTop: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <br />
      <button
        onClick={generateImage}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        Generate Image
      </button>

      {loading && <p>Generating image...</p>}

      {image && (
        <div style={{ marginTop: "30px" }}>
          <img
            src={image}
            alt="Generated"
            style={{
              maxWidth: "600px",
              borderRadius: "10px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      )}
    </div>
  );
}