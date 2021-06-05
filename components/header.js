import { useContext } from "react";
import Link from "next/link";
import AuthButton from "./auth-button";
import Router from "next/router";
import { magic } from "../lib/magic";
import { UserContext } from "../lib/UserContext";
import { CallToAction, TextButton } from "@magiclabs/ui";

import styles from "./header.module.scss";

const Header = (props) => {
  const [user, setUser] = useContext(UserContext);
  const loginButton = props.authButtons[0];
  const logoutButton = props.authButtons[1];

  const logout = () => {
    magic.user.logout().then(() => {
      setUser({ user: null });
      Router.push("/login");
    });
  };

  const login = () => {
    Router.push("/login");
  };

  return (
    <div className={styles.Header}>
      <Link href="/">
        <div className={styles.Header}>{props.appTitle}</div>
      </Link>
      {user?.issuer && !user?.loading ? (
        //   <TextButton color="warning" size="sm" onPress={logout}>
        //   logout
        // </TextButton>
        <AuthButton
          auth={logout}
          key={logoutButton.path}
          path={logoutButton.path}
          label={logoutButton.label}
        />
      ) : null}
      {!user?.issuer && !user?.loading ? (
        <AuthButton
          auth={login}
          key={loginButton.path}
          path={loginButton.path}
          label={loginButton.label}
        />
      ) : null}

      {/* {user?.loading ? (
        // If loading, don't display any buttons specific to the loggedIn state
        <div style={{ height: "38px" }}></div>
      ) : user?.issuer ? (
        <>
          <li className={styles.li}>
            <a>
              <TextButton color="warning" size="sm" onPress={logout}>
                logout
              </TextButton>
            </a>
          </li>
        </>
      ) : (
        <li className={styles.li}>
          <Link href="/login">
            <CallToAction color="primary" size="sm">
              login
            </CallToAction>
          </Link>
        </li>
      )} */}
    </div>
  );
};

export default Header;
