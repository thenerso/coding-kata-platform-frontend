import { useEffect } from "react";
import { useNavigate} from "react-router-dom";
import authService from "../services/authService";
import UserInfo from "./users/UserInfo";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      // Assuming that 'id' is the property holding the user id
      const userId = user.userId;
      navigate(`/users/${userId}`);
    }
  }, [navigate]);

  return <UserInfo title="Profile" />;
};

export default Profile;
