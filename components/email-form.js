import { useState } from "react";
import { Send } from "react-feather";
const feather = require("feather-icons");

const EmailForm = ({ onEmailSubmit, disabled }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    onEmailSubmit(email);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3 className="form-header">login to pro.lo-</h3>
        <div className="input-wrapper">
          <input
            className="input"
            placeholder="user@email.com..."
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button disabled={disabled} onClick={handleSubmit}>send magic link</button>
        </div>
        <div className="send">
          <Send />
        </div>
      </form>
      <style jsx>{`
        form,
        label {
          display: flex;
          flex-flow: column;
          text-align: center;
        }
        button {
          padding: 5px 12px 5px 12px;
          border-radius: 5px;
          border: 1px solid white;
          background-color: red;
          font-family: Ubuntu;
          color: white;
        }
        .form-header {
          font-size: 32px;
          margin: 25px 0;
        }
        .input-wrapper {
          margin: 0 auto 10px;
        }
        .input {
          font-size: 17px;
          padding: 5px 0 5px 5px;
          border-radius: 5px;
          border: 1px solid red;
          font-family: Ubuntu;
        }
        .send {
          margin-top: 5px;
        }
      `}</style>
    </>
  );
};

export default EmailForm;
