import { useContext } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";

const Balances = () => {
  const [user] = useContext(UserContext);

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <>
            <h1>balances</h1>
            <div className="label">Email</div>
            <div className="profile-info">{user.email}</div>

            <div className="label">User Id</div>
            <div className="profile-info">{user.issuer}</div>
          </>
        )
      )}
      <style jsx>{`
        h1 {
          font-size: 36px;
          text-align: center;
        }
        .label {
          font-size: 12px;
          color: #6851ff;
          margin: 30px 0 5px;
        }
        .profile-info {
          font-size: 17px;
          word-wrap: break-word;
        }
      `}</style>
    </>
  );
};

export default Balances;
