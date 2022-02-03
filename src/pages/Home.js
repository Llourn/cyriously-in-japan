import styles from "../styles/Home.module.scss";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage, faTasks, faToriiGate } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { updatePageInfo } from "../utilities/utilities";

const Home = () => {
  const { user, login } = useAuth();

  const navigate = useNavigate();

  updatePageInfo("頑張って！🎌", "Tools and resources to help you on your journey to Japan.")

  const iconClickHandler = (location) => {
    if(user){
      if(location === "placesToGo"){
        navigate("/placestogo")
      }
      if(location === "kanaCheck"){
        navigate("/kanacheck")
      }
      if(location === "converter"){
        navigate("/converter")
      }
    } else {
      login();
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.splash}>
        <div className={styles.splashText}>
          <h1>頑張って</h1>
          <p><ruby>頑張<rt>がんば</rt></ruby>って - Do one&apos;s best.</p>
          <p>
            It&apos;s one one of my goals to visit Japan some day. And I made
            this web app to help me prepare!
          </p>
          {!user ? (
            <p>
              Log in at the top of the page, then click the menu icon to check
              out all the features.
            </p>
          ) : (
            <p>Click the menu icon to check out all the features.</p>
          )}
        </div>
      </div>
      <div className={styles.headerContainer}>
        <h1>Features</h1>
      </div>
        <div className={styles.cardContainer}>
          <div className={styles.featureCard}>
            <div className={styles.featureCardImage}>
              <FontAwesomeIcon icon={faToriiGate} size="lg" style={{width:"100%"}} onClick={() => iconClickHandler("placesToGo")}/>
            </div>
            <h2>Places To Go</h2>
            <div className={styles.featureCardText}>
              <p>There are so many amazing places to visit in Japan it&apos;s hard to keep track of them all! Check out the Places To Go section to keep records of all the places you want to check out!</p>
            </div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureCardImage}>
              <FontAwesomeIcon icon={faTasks} size="lg" style={{width:"100%"}} onClick={() => iconClickHandler("kanaCheck")}/>
            </div>
            <h2>Kana Check</h2>
            <div className={styles.featureCardText}>
              <p>Learning the Japanese language is hard! If you&apos;re just starting out learning the basic kana is a great place to begin your language learning journey. Check out Kana Check for resources and to test your kana knowledge!</p>
            </div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureCardImage}>
              <FontAwesomeIcon icon={faLanguage} size="lg" style={{width:"100%"}} onClick={() => iconClickHandler("converter")}/>
            </div>
            <h2>JA ⇔ EN Converter</h2>
            <div className={styles.featureCardText}>
              <p>JA ⇔ EN Converter is a Japanese-to-English and English-to-Japanese language converter leveraging google&apos;s translate technology. Translate anything you need and pin the most useful ones so you can reference them in a pinch!</p>
            </div>
          </div>
        </div>
    </main>
  );
};

export default Home;
