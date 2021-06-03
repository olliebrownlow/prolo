import Link from "next/link";
 
// import "./AuthButton.scss";
 
const AuthButton = (props) => (
  <Link href={props.path}>
    <button onClick={props.auth} className="AuthButton">
      <span className="Label">{props.label}</span>
    </button>
  </Link>
);
 
export default AuthButton;
 