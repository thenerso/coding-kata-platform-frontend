import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <p>Home</p>
      <Link to="/login">Login</Link>
      <br />
      <Link to="/adognewogawnigiewoan">404 page</Link>
    </>
  );
};

export default Home;
