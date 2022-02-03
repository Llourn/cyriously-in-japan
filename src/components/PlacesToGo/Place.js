import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import styles from "../../styles/PlacesToGo/Place.module.scss";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { getDownloadURL, getStorage, ref } from "@firebase/storage";


const Place = ({ title, id, imagePath, description, location, editPlace, getPlaces}) => {
  const [imageUrl, setImageUrl] = useState("./images/default.jpg");
  const storage = getStorage();
  const descriptionCutoff = 100;
  
  useEffect(() => {
    if (imagePath) {
      const currentRef = ref(storage, imagePath);
      getDownloadURL(currentRef).then((url) => {
        setImageUrl(url);
      });
    }
  }, []);

  const deletePlace = async () => {
    await deleteDoc(doc(db, "places", id));
    getPlaces();
  };

  return (
    <div className={styles.container}>
      <img className={styles.image} src={imageUrl} alt="thumbnail" />
      <div className={styles.textContent}>
        <h1>{title}</h1>
        <div className={styles.description}>{description.length > descriptionCutoff ? `${description.slice(0, descriptionCutoff)}...` : description}</div>
      </div>
      <div className={styles.buttonContainer}>
        <button
          className="icon success"
          onClick={() => editPlace({ title, id, description, location })}
        >
          <FontAwesomeIcon icon={faPencilAlt} size="2x" />
        </button>
        <button className="icon danger" onClick={() => {deletePlace()}}>
          <FontAwesomeIcon icon={faTrash} size="2x" />
        </button>
      </div>
    </div>
  );
};

export default Place;
