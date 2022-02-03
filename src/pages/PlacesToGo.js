import { useState, useEffect } from "react";
import PlaceForm from "../components/PlacesToGo/PlaceForm";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, orderBy, query } from "@firebase/firestore";
import { db } from "../firebase/firebase.config";
import Place from "../components/PlacesToGo/Place";
import styles from "../styles/PlacesToGo/PlacesToGo.module.scss";
import { updatePageInfo } from "../utilities/utilities";

const PlacesToGo = () => {
  const [showForm, setShowForm] = useState(false);
  const [places, setPlaces] = useState([]);
  const [placeAttributes, setPlaceAttributes] = useState(undefined);
  const maxEntries = 10;

  const { user } = useAuth();

  updatePageInfo(
    "頑張って！🎌 - Places to Go",
    "Make a list of places you want to visit!"
  );

  useEffect(() => {
    if (user && places.length <= 0) getPlaces();
  }, [user]);

  const addPlaceButtonHandler = () => {
    if (places.length <= maxEntries) {
      setShowForm(!showForm);
      setPlaceAttributes(null);
    }
  };

  const closeFormAndUpdatePlaces = (updatePlaces) => {
    setShowForm(false);
    if (updatePlaces) getPlaces();
  };

  const editPlace = (attr) => {
    setPlaceAttributes(attr);
    setShowForm(!showForm);
  };

  const getPlaces = async () => {
    setPlaces([]);
    const q = query(collection(db, "places"), orderBy("created", "desc"));
    const querySnapshot = await getDocs(q);
    let placesList = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().owner === user.uid) {
        placesList.push(doc);
      }
    });
    setPlaces(placesList);
  };

  if (!user) {
    return (
      <p style={{ textAlign: "center" }}>Please log in to view this page.</p>
    );
  }

  return (
    <div className={styles.container}>
      {showForm && (
        <PlaceForm
          closeFormAndUpdatePlaces={closeFormAndUpdatePlaces}
          currentTitle={placeAttributes?.title}
          currentDescription={placeAttributes?.description}
          currentLocation={placeAttributes?.location}
          id={placeAttributes?.id}
        />
      )}
      <div className={styles.intro}>
        <h1>Places To Go</h1>
        <p>
          Make a list of places you want to visit! You can add different
          locations and add some notes about why you want to check it out.
        </p>
        <div className={styles.buttonContainer}>
          <button
            onClick={addPlaceButtonHandler}
            disabled={places.length >= maxEntries}
          >
            Add a new place
          </button>
        </div>
        {places.length >= maxEntries && (
          <p className={styles.maxEntriesWarning}>
            Maximum number of entries is {maxEntries}. Please delete an entry
            before adding another.
          </p>
        )}
      </div>
      <div className={styles.placesContainer}>
        {places ? (
          places.map((place) => (
            <Place
              key={place.id}
              title={place.data().title}
              id={place.id}
              imagePath={place.data().imagePath}
              description={place.data().description}
              location={{
                lat: place.data().location.lat,
                lng: place.data().location.lng,
              }}
              editPlace={editPlace}
              getPlaces={getPlaces}
            />
          ))
        ) : (
          <h2>LOADING PLACES...</h2>
        )}
      </div>
    </div>
  );
};

export default PlacesToGo;
