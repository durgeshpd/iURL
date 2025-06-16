import { useState } from "react";
import axios from "axios";

const URLForm = () => {
  const [url, setUrl] = useState("");
  const [shortId, setShortId] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/", { url });
      setShortId(res.data.id);
    } catch (err) {
      alert("Failed to generate short URL");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          placeholder="Enter a URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="btn">Shorten</button>
      </form>
      {shortId && (
        <div className="mt-4">
          <p>Short URL:</p>
          <a
            href={`http://localhost:8000/${shortId}`}
            className="text-blue-600 underline"
            target="_blank"
            rel="noreferrer"
          >
            {`http://localhost:8000/${shortId}`}
          </a>
        </div>
      )}
    </div>
  );
};

export default URLForm;
