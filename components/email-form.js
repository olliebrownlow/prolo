import { useState } from "react";
import { Send } from "react-feather";
const feather = require("feather-icons");
import styles from "./emailForm.module.scss"

const EmailForm = ({ onEmailSubmit, disabled }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    onEmailSubmit(email);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h3 className={styles.formHeader}>
          login to pro.<span className={styles.span}>lo-</span>
        </h3>
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            placeholder="user@email.com..."
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button className={styles.button} disabled={disabled} onClick={handleSubmit}>
            send magic link
          </button>
        </div>
        <div className={styles.send}>
          <Send />
        </div>
      </form>
    </>
  );
};

export default EmailForm;
