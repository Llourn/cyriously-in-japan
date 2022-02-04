import {
  faBars,
  faSignInAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/NavBar.module.scss";
import { useNavigate, Link } from "react-router-dom";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/images/default.jpg");
  const { user, login, logout } = useAuth();

  const navigate = useNavigate();

  let menuClassName = menuOpen
    ? `${styles.menuList} ${styles.open} `
    : `${styles.menuList} ${styles.closed}`;

  useEffect(() => {
    if (user) {
      setProfileImage(user.photoURL);
    } else {
      setProfileImage("/images/default.jpg");
    }
  }, [user]);

  const menuClickHandler = () => {
    setMenuOpen(!menuOpen);
  };

  const logInHandler = (e) => {
    e.preventDefault();
    login();
  };

  const logOutHandler = (e) => {
    e.preventDefault();
    logout();
  };

  const goHome = () => {
    navigate("/");
    if (menuOpen) {
      menuClickHandler();
    }
  };

  return (
    <nav className={styles.navBar}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={goHome}>
          頑張って
        </div>
        <div className={styles.navigation}>
          {user ? (
            <div
              onClick={(e) => {
                menuClickHandler(e);
              }}
              className={styles.menuImageContainer}
            >
              <div className={styles.menuImage}>
                <FontAwesomeIcon icon={faBars} />
              </div>
              <div className={menuClassName}>
                <ul>
                  <Link to="/placestogo">
                    <li>Places To Go</li>
                  </Link>
                  <Link to="/kanacheck">
                    <li>Kana Check</li>
                  </Link>
                  <Link to="/converter">
                    <li className={styles.last}>JA ⇔ EN Converter</li>
                  </Link>
                </ul>
              </div>
            </div>
          ) : (
            ""
          )}
          {user && (
            <div className={styles.profilePicture}>
              <img src={profileImage} alt="User Profile" />
            </div>
          )}
          <div className={styles.menuImageContainer}>
            {user ? (
              <div
                onClick={(e) => {
                  logOutHandler(e);
                }}
                className={styles.menuImage}
              >
                <div onClick={() => navigate("/")}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </div>
              </div>
            ) : (
              <div
                onClick={(e) => logInHandler(e)}
                className={styles.menuImage}
              >
                <FontAwesomeIcon icon={faSignInAlt} />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
