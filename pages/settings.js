import { useContext } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";

const Settings = () => {
  const [user] = useContext(UserContext);

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <div className="settings">
            <h1>app settings</h1>
            <div className="buttons">
              <button
                className="button"
                // onClick={handleSubmit}
              >
                eur
              </button>
              <button
                className="button"
                // onClick={handleSubmit}
              >
                gbp
              </button>
              <button
                className="button"
                // onClick={handleSubmit}
              >
                usd
              </button>
            </div>
          </div>
        )
      )}
      <style jsx>{`
        .settings {
          width: 100%;
          padding: 1rem;
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
        .buttons {
          display: flex;
          justify-content: space-around;
          align-items: center;

          max-width: 100%;
        }
        .button {
          padding: 5px 12px 5px 12px;
          border-radius: 5px;
          border: 1px solid white;
          background-color: black;
          font-family: Ubuntu;
          color: white;
      `}</style>
    </>
  );
};

export default Settings;
