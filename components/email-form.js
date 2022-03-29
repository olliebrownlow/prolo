import { useState } from "react";
import { Send } from "react-feather";
import styles from "./emailForm.module.scss";
import { motion } from "framer-motion";

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
          <motion.button
            className={styles.button}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.25 }}
            animate={disabled ? { scale: [1, 0.5, 1] } : {}}
            disabled={disabled}
            onClick={handleSubmit}
          >
            send magic link
          </motion.button>
        </div>
        <div className={styles.send}>
          <Send size={32} />
        </div>
      </form>
    </>
  );
};

export default EmailForm;
