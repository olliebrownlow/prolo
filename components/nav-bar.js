import styles from "./navBar.module.scss";
import navButtons from "../config/navButtons";
import NavButton from "./nav-button";

const NavBar = () => (
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
);

export default NavBar;
