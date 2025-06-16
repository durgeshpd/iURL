import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => alert("Failed to fetch profile"));
  }, []);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 space-y-2">
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default Profile;
