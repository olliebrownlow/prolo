import { useState, useEffect, useContext } from "react";
import Router from "next/router";
import { magic } from "../lib/magic";
import { UserContext } from "../lib/UserContext";
import EmailForm from "../components/email-form";
import SocialLogins from "../components/social-logins";
import styles from "../pageStyles/login.module.scss";

const Login = () => {
  const [disabled, setDisabled] = useState(false);
  const [user, setUser] = useContext(UserContext);

  // Redirect to /pocket if the user is logged in
  useEffect(() => {
    user?.issuer && Router.push("/pocket");
  }, [user]);

  async function handleLoginWithEmail(email) {
    try {
      setDisabled(true); // disable login button to prevent multiple emails from being triggered

      // Trigger Magic link to be sent to user
      let didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL("/callback", window.location.origin).href, // optional redirect back to your app after magic link is clicked
      });

      // Validate didToken with server
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
      });

      if (res.status === 200) {
        // Set the UserContext to the now logged in user
        let userMetadata = await magic.user.getMetadata();
        await setUser(userMetadata);
        Router.push("/pocket");
      }
    } catch (error) {
      setDisabled(false); // re-enable login button - user may have requested to edit their email
      console.log(error);
    }
  }

  async function handleLoginWithSocial(provider) {
    await magic.oauth.loginWithRedirect({
      provider, // google, apple, etc
      redirectURI: new URL("/callback", window.location.origin).href, // required redirect to finish social login
    });
  }

  return (
    <div className={styles.login}>
      <EmailForm disabled={disabled} onEmailSubmit={handleLoginWithEmail} />
      <SocialLogins onSubmit={handleLoginWithSocial} />
    </div>
  );
};

export default Login;
