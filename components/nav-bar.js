import styles from "./navBar.module.scss";
import NavButton from "./nav-button";

const NavBar = (props) => (
  <div className={styles.NavBar}>
    {props.navButtons.map((button) => (
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
