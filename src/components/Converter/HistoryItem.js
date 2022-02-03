import { doc, getDocFromServer } from "@firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { faInfoCircle, faThumbtack, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/Converter/HistoryItem.module.scss";

const HistoryItem = ({
  deleteTranslation,
  id,
  isPinned: pinState,
  originalPhrase,
  convertedPhrases,
  handlePinState,
}) => {
  const [isPinned, setIsPinned] = useState(pinState);
  const [englishText, setEnglishText] = useState("");
  const [japaneseText, setJapaneseText] = useState("");
  const [translationTextError, setTranslationTextError] = useState("");
  const intervalCount = useRef(0);
  const intervalId = useRef();

  let pinButtonClassName = isPinned
    ? `success icon ${styles.pinned}`
    : `success icon`;

  useEffect(() => {
    if (convertedPhrases) {
      setJapaneseText(convertedPhrases.ja);
      setEnglishText(convertedPhrases.en);
    } else {
      if (!intervalId.current) {
        intervalId.current = setInterval(
          async () => await checkForConvertedPhrases(),
          1000
        );
      }
    }
  }, []);

  useEffect(() => {
    handlePinState(id, isPinned);
  }, [isPinned])

  const checkForConvertedPhrases = async () => {
    intervalCount.current = intervalCount.current + 1;
    if (!intervalId.current) {
      if (intervalCount > 3) {
        setTranslationTextError("Error translating, please refresh the page.");
        clearInterval(intervalId.current);
      }
      return;
    }
    const docRef = doc(db, "translations", id.toString());
    try {
      const doc = await getDocFromServer(docRef);
      if (doc.data().translated) {
        setEnglishText(doc.data().translated.en);
        setJapaneseText(doc.data().translated.ja);
        clearInterval(intervalId.current);
      }
    } catch (error) {
      console.log("Error getting document from server: ", error);
      setTranslationTextError("Error getting document from server.");
    }
  };

  const handlePinButtonClick = () => {
    setIsPinned(!isPinned);
    
  };

  const handleDeleteButtonClick = () => {
    deleteTranslation(id);
  };

  const originalPhraseLanguage = () => {
    let language = "";
    if (englishText && japaneseText) {
      if (originalPhrase === englishText) {
        language = "en";
      } else if (originalPhrase === japaneseText) {
        language = "ja";
      }
    }
    return language;
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3>
          {originalPhraseLanguage() === "en" ? (
            originalPhrase
          ) : (
            <span className={styles.japaneseText}>{originalPhrase}</span>
          )}
        </h3>
        {!englishText || !japaneseText ? (
          !translationTextError ? (
            <h2>Loading...</h2>
          ) : (
            <h2>{translationTextError}</h2>
          )
        ) : (
          <div>
            {originalPhraseLanguage() === "en" ? (
              <p className={styles.japaneseText}>{japaneseText}</p>
            ) : (
              <p>{englishText}</p>
            )}

            <a
              className={styles.moreInfo}
              href={`https://www.jisho.org/search/${japaneseText}`}
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faInfoCircle} size="sm"/>
            </a>
          </div>
        )}
      </div>
      <div className={styles.buttons}>
        <button
          className={pinButtonClassName}
          onClick={() => {
            handlePinButtonClick();
          }}
        >
          <FontAwesomeIcon icon={faThumbtack} size="2x" />
        </button>
        <button
          className="danger icon"
          onClick={() => {
            handleDeleteButtonClick();
          }}
        >
          <FontAwesomeIcon icon={faTrash} size="2x" />
        </button>
      </div>
    </div>
  );
};

export default HistoryItem;