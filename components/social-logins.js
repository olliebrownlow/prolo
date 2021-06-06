import { useState } from "react";
import styles from "./socialLogins.module.scss";

const SocialLogins = ({ onSubmit }) => {
  const providers = ["google", "github"];
  const [isRedirecting, setIsRedirecting] = useState(false);

  return (
    <>
      <div className={styles.orLoginWith}>..or login with</div>
      {providers.map((provider) => {
        return (
          <div key={provider}>
            <button
              type="submit"
              className={styles.socialBtn}
              onClick={() => {
                setIsRedirecting(true);
                onSubmit(provider);
              }}
              key={provider}
              style={{ backgroundImage: `url(${provider}.png)` }}
            >
              {/* turns "google" to "Google" */}
              {provider.replace(/^\w/, (c) => c.toUpperCase())}
            </button>
          </div>
        );
      })}
      {isRedirecting && (
        <div className={styles.redirecting}>Redirecting...</div>
      )}
    </>
  );
};

export default SocialLogins;
