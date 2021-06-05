import { useContext } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";

const Trades = () => {
  const [user] = useContext(UserContext);

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <div className="trades">
            <h1>trades</h1>
            <div className="label">Email</div>
            <div className="profile-info">{user.email}</div>

            <div className="label">User Id</div>
            <div className="profile-info">{user.issuer}</div>
          </div>
        )
      )}
      <style jsx>{`
        .trades {
          max-width: 100%;
          padding: 1rem
        }
        h1 {
          font-size: 36px;
          text-align: center;
        }
        .label {
          // text-align: center;
          font-size: 12px;
          color: #6851ff;
          margin: 30px 0 5px;
        }
        .profile-info {
          font-size: 17px;
          // text-align: center;
          word-wrap: break-word;
        }
      `}</style>
    </>
  );
};

export default Trades;
