import { useContext } from "react";
import Link from "next/link";
import Router from "next/router";
import { magic } from "../lib/magic";
import { UserContext } from "../lib/UserContext";
import { CallToAction, TextButton } from "@magiclabs/ui";

import styles from "./header.module.scss";

const Header = () => {
  const [user, setUser] = useContext(UserContext);

  const logout = () => {
    magic.user.logout().then(() => {
      setUser({ user: null });
      Router.push("/login");
    });
  };

  return (
    <header>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          {user?.loading ? (
            // If loading, don't display any buttons specific to the loggedIn state
            <div style={{ height: "38px" }}></div>
          ) : user?.issuer ? (
            <>
              <li className={styles.li1st}>
                <Link href="/">
                  <TextButton color="primary" size="sm">
                    home
                  </TextButton>
                </Link>
              </li>
              <li className={styles.li}>
                <Link href="/balances">
                  <TextButton color="primary" size="sm">
                    balances
                  </TextButton>
                </Link>
              </li>
              <li className={styles.li}>
                <Link href="/trades">
                  <TextButton color="primary" size="sm">
                    trades
                  </TextButton>
                </Link>
              </li>
              <li className={styles.li}>
                <Link href="/settings">
                  <TextButton color="primary" size="sm">
                    settings
                  </TextButton>
                </Link>
              </li>
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
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
