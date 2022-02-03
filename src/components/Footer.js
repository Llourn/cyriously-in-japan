import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.container}>
      <div className={styles.hr}>
        <div></div>
      </div>
      <div className={styles.createdBy}><span className={styles.statement}>Created by <a href="http://lornecyr.com" target="_blank" rel="noopener noreferrer">Lorne Cyr</a> </span><a href="http://twitter.com/llourn" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon className={styles.twitter} icon={faTwitterSquare} size="2x"/></a></div>
    </footer>
  )
}

export default Footer
