import { useEffect, useState } from "react";
import authService from "../services/authService";
import UserInfo from "./users/UserInfo";

const Profile = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = authService.getUser();
    if (user && user.userId) {
      setUserId(user.userId.toString()); // Assuming userId is a number
    }
  }, []);

  if (userId === null) {
    // You might want to handle loading or null user ID appropriately here
    return <div>Loading...</div>;
  }

  return <UserInfo userId={userId} title="Profile" />;
};

export default Profile;
