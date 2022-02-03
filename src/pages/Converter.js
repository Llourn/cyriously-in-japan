import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "@firebase/firestore";
import { faEraser, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import HistoryItem from "../components/Converter/HistoryItem";
import { db } from "../firebase/firebase.config";
import styles from "../styles/Converter.module.scss";
import { useAuth } from "../context/AuthContext";
import { updatePageInfo } from "../utilities/utilities";

const Converter = () => {
  const [inputText, setInputText] = useState("");
  const [translations, setTranslations] = useState([]);
  const [pinnedTranslations, setPinnedTranslations] = useState([]);
  const [unpinnedTranslations, setUnpinnedTranslations] = useState([]);

  const maxEntries = 20;

  const { user } = useAuth();

  updatePageInfo("頑張って！🎌 - Language Converter", "Look up and translate phrases!")
  
  useEffect(() => {
    if (user) getTranslations();
  }, [user]);
  
  const sortTranslations = () => {
    const pt = translations.filter((entry) => entry.data().isPinned);
    const upt = translations.filter((entry) => !entry.data().isPinned);

    setPinnedTranslations(pt);
    setUnpinnedTranslations(upt);
  };

  useEffect(() => {
    sortTranslations();
  }, [translations]);
  
  if(!user) {
    return <p style={{textAlign:"center"}}>Please log in to view this page.</p>
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(db, "translations"), {
        owner: user.uid,
        created: Date.now(),
        isPinned: false,
        input: inputText,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    getTranslations();
    setInputText("");
  };

  const handleClear = (e) => {
    e.preventDefault();
    setInputText("");
  };

  const getTranslations = async () => {
    // const querySnapshot = await getDocs(collection(db, "translations"));
    const q = query(
      collection(db, "translations"),
      orderBy("isPinned", "desc"),
      orderBy("created", "desc")
    );
    const querySnapshot = await getDocs(q);
    let translationList = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().owner === user.uid) {
        translationList.push(doc);
      }
    });

    setTranslations(translationList);
  };



  const deleteTranslation = async (id) => {
    await deleteDoc(doc(db, "translations", id));
    getTranslations();
  };

  const handlePinState = async (id, pinState) => {
    await updateDoc(doc(db, "translations", id), {
      isPinned: pinState,
    });
    getTranslations();
  };

  return (
    <section className={styles.container}>
      {/* <Head>
        <title>頑張って！🎌 - Language Converter</title>
        <meta name="description" content="Look up and translate phrases!" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <div>
        <form className={styles.form}>
            <input
              type="text"
              disabled={translations.length >= maxEntries}
              onChange={(e) => {if(e.target.value.length < 101)setInputText(e.target.value)}}
              value={inputText}
            />
          <div className={styles.buttons}>
            <button
              className="success icon"
              disabled={inputText.length <= 0 || translations.length >= maxEntries}
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} size="2x" />
            </button>
            <button
              className="danger icon"
              disabled={inputText.length <= 0}
              onClick={(e) => {
                handleClear(e);
              }}
            >
              <FontAwesomeIcon icon={faEraser} size="2x" />
            </button>
          </div>
        </form>
      </div>
      <div className={styles.history}>
        <p className={styles.description}>
          {translations.length >= maxEntries && <p className={styles.maxEntriesWarning}>Maximum number of entries is {maxEntries}. Please delete an entry before adding another.</p>}
          Enter a word or phrase to have it translated! (100 character max.)
          <br />
          English &gt; Japanese or Japanese &gt; English. Be sure to check your spelling before submitting your phrase for more accurate results.
        </p>
        <div className={styles.translationsContainer}>
          <div className={styles.pinnedTranslations}>
            {pinnedTranslations ? (
              pinnedTranslations.map((translation) => (
                <HistoryItem
                  key={translation.id}
                  deleteTranslation={deleteTranslation}
                  id={translation.id}
                  isPinned={translation.data().isPinned}
                  originalPhrase={translation.data().input}
                  convertedPhrases={translation.data().translated}
                  handlePinState={handlePinState}
                />
              ))
            ) : (
              <h2>LOADING PINS...</h2>
            )}

          </div>
          <div className={styles.unpinnedTranslations}>
            {unpinnedTranslations ? (
              unpinnedTranslations.map((translation) => (
                <HistoryItem
                  key={translation.id}
                  deleteTranslation={deleteTranslation}
                  id={translation.id}
                  isPinned={translation.data().isPinned}
                  originalPhrase={translation.data().input}
                  convertedPhrases={translation.data().translated}
                  handlePinState={handlePinState}
                />
              ))
            ) : (
              <h2>LOADING REMAINING...</h2>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default Converter;
// {translations ? (
//   translations.map((translation) => (
//     <HistoryItem
//       key={translation.id}
//       deleteTranslation={deleteTranslation}
//       id={translation.id}
//       isPinned={translation.data().isPinned}
//       originalPhrase={translation.data().input}
//       convertedPhrases={translation.data().translated}
//       handlePinState={handlePinState}
//     />
//   ))
// ) : (
//   <h2>LOADING...</h2>
// )}

// {pinnedTranslations.length > 0 && (
//   <div className={styles.pinnedTranslations}>
//     {pinnedTranslations.map((translation) => {
//       <HistoryItem
//         key={translation.id}
//         deleteTranslation={deleteTranslation}
//         id={translation.id}
//         isPinned={translation.data().isPinned}
//         originalPhrase={translation.data().input}
//         convertedPhrases={translation.data().translated}
//         handlePinState={handlePinState}
//       />;
//     })}
//   </div>
// )}
