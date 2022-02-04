import styles from "../styles/Error.module.scss";
import kitty from "../images/musclemouse.png";
import { Link } from "react-router-dom";

const Error = () => {
  return <div className={styles.container}>
    <img src={kitty} alt="404 kitty" />
    <p>Lost? Click <Link to="/">here</Link> to get back to the main page.</p>
  </div>;
};

export default Error;
