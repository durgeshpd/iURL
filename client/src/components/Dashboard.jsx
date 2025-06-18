import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../utils/constants";

// API calls
const fetchUserProfile = async (token) => {
  const res = await axios.get(`${BASE_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const fetchUserUrls = async (token) => {
  const res = await axios.get(`${BASE_URL}/user/urls`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.urls;
};

const Dashboard = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [longUrl, setLongUrl] = useState("");
  const [error, setError] = useState("");
  const [latestShortId, setLatestShortId] = useState(null);

  // Redirect to login if token is missing
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token]);

  // React Query: User profile
  const {
    data: profile,
    isLoading: loadingProfile,
    isError: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchUserProfile(token),
    enabled: !!token,
  });

  // React Query: User URLs (auto-refresh every 5s)
  const {
    data: urls = [],
    isLoading: loadingUrls,
    isError: urlError,
    refetch,
  } = useQuery({
    queryKey: ["urls"],
    queryFn: () => fetchUserUrls(token),
    enabled: !!token,
    refetchInterval: 5000, // Refresh clicks every 5s
  });

  // Create a short URL
  const handleGenerate = async () => {
    if (!longUrl) return setError("Enter a valid URL");

    try {
      const res = await axios.post(
        `${BASE_URL}/url`,
        { url: longUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newShortId = res.data.id;
      setLatestShortId(newShortId);
      setLongUrl("");
      setError("");
      refetch(); // Refresh URL list
    } catch (err) {
      setError(err.response?.data?.error || "Error generating short URL");
    }
  };

  // Loading & error UI
  if (loadingProfile || loadingUrls) return <p className="p-8">Loading...</p>;
  if (profileError || urlError) return <p className="p-8 text-red-500">Error loading data</p>;

  return (
    <div className="p-8 min-h-screen bg-white text-gray-900 dark:bg-white dark:text-gray-900">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Profile section */}
        {profile && (
          <div className="mb-4">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        )}

        {/* URL input form */}
        <div className="mb-4">
          <input
            type="url"
            placeholder="Paste a long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Generate
        </button>

        {/* Error */}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* New short URL output */}
        {latestShortId && (
          <div className="mt-4 p-4 bg-green-50 border rounded">
            <p><strong>New Short URL:</strong> <a
              href={`${BASE_URL}/url/${latestShortId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
            >
              {BASE_URL}/url/{latestShortId}
            </a></p>
          </div>
        )}

        {/* User URLs list */}
        {urls.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Your URLs</h3>
            {urls.map((url) => (
              <div
                key={url.shortId}
                className="p-4 mb-3 border rounded bg-gray-50"
              >
                <p><strong>Short:</strong>{" "}
                  <a
                    href={`${BASE_URL}/url/${url.shortId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    {BASE_URL}/url/{url.shortId}
                  </a>
                </p>
                <p><strong>Original:</strong> {url.redirectURL}</p>
                <p><strong>Clicks:</strong> {url.totalClicks}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
