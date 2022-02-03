import { faBan, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import styles from "../../styles/PlacesToGo/PlaceForm.module.scss";
import GoogleMap from "../GoogleMap";
import { useAuth } from "../../context/AuthContext";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../../firebase/firebase.config";

const AddPlace = ({
  closeFormAndUpdatePlaces,
  currentTitle = "",
  currentDescription,
  currentLocation,
  id,
}) => {
  // Add props with default blank values, add those to the useState inits for those variables.
  const [title, setTitle] = useState(currentTitle || "");
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("")
  const [description, setDescription] = useState(currentDescription || "");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  const { user } = useAuth();

  const imageWarning = () => {
    if(imageError) {
      return <p className={styles.imageErrorMessage}>{imageError}</p>
    } else {
      return "";
    }
  }

  const handleSubmit = () => {
    if (isFormReady()) {
      if (id) {
        if (image) {
          updatePlaceWithImage();
        } else {
          console.log("update place without an image.")
          updatePlace();
        }
      } else {
        if (image) {
          addToDbWithImage();
        } else {
          addToDb();
        }
      }
    }
  };

  const addToDb = async (path = "") => {
    try {
      await addDoc(collection(db, "places"), {
        owner: user.uid,
        created: Date.now(),
        lastUpdated: Date.now(),
        title: title,
        imagePath: path,
        description: description,
        location: { lat: location.lat(), lng: location.lng() },
      });
    } catch (e) {
      console.error("Error adding place: ", e);
    }
    handleClose(true);
  };

  const addToDbWithImage = () => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${user.uid}/${image.name}`);

    uploadBytes(storageRef, image).then((snapshot) => {
      addToDb(snapshot.metadata.fullPath);
    });
  };

  const updatePlace = async () => {
    updateDb();
  };

  const updatePlaceWithImage = async () => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${user.uid}/${image.name}`);

    uploadBytes(storageRef, image).then((snapshot) => {
      updateDb(snapshot.metadata.fullPath);
    });
  };

  const updateDb = async (path = "") => {
    if (path) {
      try {
        await updateDoc(doc(db, "places", id), {
          lastUpdated: Date.now(),
          title: title,
          imagePath: path,
          description: description,
          location: { lat: location.lat(), lng: location.lng() },
        });
      } catch (error) {
        console.error("Error updating document with image: ", error);
      }
    } else {
      console.log("updateDb, made it to the update doc part.")
      try {
        await updateDoc(doc(db, "places", id), {
          lastUpdated: Date.now(),
          title: title,
          description: description,
          location: { lat: location.lat(), lng: location.lng() },
        });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
    handleClose(true);
  };

  const handleFileChange = (e) => {
    setImageError("");
    if(e.target.files[0].size < 8388609){
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
      }
    } else {
      setImageError("⛔ Max image size: 8MB. Please upload a different image.");
    }
  };

  const handleClose = (updatePlaces) => {
    clearAllFields();
    closeFormAndUpdatePlaces(updatePlaces);
  };

  const clearAllFields = () => {
    setTitle("");
    setImage(null);
    setDescription("");
    setLocation(null);
    setImageError("");
  };

  const isFormReady = () => {
    let isTitleReady = true;
    let isLocationReady = true;
    let titleError = <span>Enter a Title.</span>;
    let locationError = <span>Select a location.</span>;

    if (title.length <= 0) {
      isTitleReady = false;
    }
    if (!location) {
      isLocationReady = false;
    }

    setError(
      <div className={styles.errors}>
        {!isTitleReady && titleError}
        {!isLocationReady && locationError}
      </div>
    );

    return isTitleReady && isLocationReady;
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>Add A New Place</h1>
        <p>Fill out the form below, then click the green icon map pin icon at the bottom to add it to the list!</p>
        <div>
          <label>
            <input
              className={styles.titleInput}
              type="text"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="Title"
              value={title}
            />
          </label>
          <br />
          <label>
            Cover Image:
            <input
              className={styles.fileInput}
              type="file"
              accept=".gif,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </label>
          {imageWarning()}
          <textarea
            className={styles.textAreaInput}
            cols="30"
            rows="10"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></textarea>
          <br />
          <div className={styles.mapContainer}>
            <GoogleMap
              setLocation={setLocation}
              currentLocation={currentLocation}
            />
          </div>
          <div className={styles.buttonContainer}>
            <div>{error}</div>
            <button className="icon success" onClick={handleSubmit}>
              <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
            </button>
            <button className="icon danger" onClick={() => handleClose(false)}>
              <FontAwesomeIcon icon={faBan} size="2x" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlace;
