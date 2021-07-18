import { useContext } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";

const Home = () => {
  const [user] = useContext(UserContext);

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <>
            <div>logged in as {user.email}</div>
          </>
        )
      )}
    </>
  );
};

export default Home;
