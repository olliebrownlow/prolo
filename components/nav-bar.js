import { useContext } from "react";
import { UserContext } from "../lib/UserContext";
import styles from "./navBar.module.scss";
import navButtons from "../config/navButtons";
import NavButton from "./nav-button";

const NavBar = () => {
  const [user, setUser] = useContext(UserContext);

  return (
    <>
      {user?.issuer && !user?.loading ? (
        <div className={styles.NavBar}>
          {navButtons.map((button) => (
            <NavButton
              key={button.path}
              path={button.path}
              label={button.label}
              icon={button.icon}
            />
          ))}
        </div>
      ) : null}
    </>
  );
};

export default NavBar;
