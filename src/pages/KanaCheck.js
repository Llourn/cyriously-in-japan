import { useState, useEffect } from "react";
import styles from "../styles/KanaCheck/KanaCheck.module.scss";
import {
  collectionName,
  hiragana,
  hiraganaDakuten,
  hiraganaHandakuten,
  hiraganaCombo,
  katakana,
  katakanaDakuten,
  katakanaHandakuten,
  katakanaCombo,
} from "../data/kana";
import KanaCollectionErrorDetails from "../components/KanaCheck/KanaCollectionErrorDetails";
import { useAuth } from "../context/AuthContext";
import { updatePageInfo } from "../utilities/utilities";

const KanaCheck = () => {
  const [includeHiragana, setHiragana] = useState(true);
  const [includeHiraganaDakuten, setHiraganaDakuten] = useState(false);
  const [includeHiraganaHandakuten, setHiraganaHandakuten] = useState(false);
  const [includeHiraganaCombo, setHiraganaCombo] = useState(false);
  const [includeKatakana, setKatakana] = useState(false);
  const [includeKatakanaDakuten, setKatakanaDakuten] = useState(false);
  const [includeKatakanaHandakuten, setKatakanaHandakuten] = useState(false);
  const [includeKatakanaCombo, setKatakanaCombo] = useState(false);

  const [reviewErrors, setReviewErrors] = useState(false);

  const [kanaCollection, setKanaCollection] = useState();
  const [targetKana, setTargetKana] = useState(null);
  const [kanaToReview, setKanaToReview] = useState([]);
  const [sessionActive, setSessionActive] = useState(false);

  const [textInput, setTextInput] = useState("");
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const [hiraganaAttemptCount, setHiraganaAttemptCount] = useState(0);
  const [hiraganaDakutenAttemptCount, setHiraganaDakutenAttemptCount] =
    useState(0);
  const [hiraganaHandakutenAttemptCount, setHiraganaHandakutenAttemptCount] =
    useState(0);
  const [hiraganaComboAttemptCount, setHiraganaComboAttemptCount] = useState(0);
  const [katakanaAttemptCount, setKatakanaAttemptCount] = useState(0);
  const [katakanaDakutenAttemptCount, setKatakanaDakutenAttemptCount] =
    useState(0);
  const [katakanaHandakutenAttemptCount, setKatakanaHandakutenAttemptCount] =
    useState(0);
  const [katakanaComboAttemptCount, setKatakanaComboAttemptCount] = useState(0);
  const [firstAttempt, setFirstAttempt] = useState(true);
  const [showCorrectReading, setShowCorrectReading] = useState(false);
  const [showCorrectResponse, setShowCorrectResponse] = useState(false);
  const [showIncorrectResponse, setShowIncorrectResponse] = useState(false);

  const hiraganaErrorCount = kanaToReview.filter(
    (kana) => kana.collection === collectionName.hiragana
  ).length;
  const hiraganaDakutenErrorCount = kanaToReview.filter(
    (kana) => kana.collection === collectionName.hiraganaDakuten
  ).length;
  const hiraganaHandakutenErrorCount = kanaToReview.filter(
    (kana) => kana.collection === collectionName.hiraganaHandakuten
  ).length;
  const hiraganaComboErrorCount = kanaToReview.filter(
    (kana) => kana.collection === collectionName.hiraganaCombo
  ).length;
  const katakanaErrorCount = kanaToReview.filter(
    (kana) => kana.collection === collectionName.katakana
  ).length;
  const katakanaDakutenErrorCount = kanaToReview.filter(
    (kana) => kana.collection === collectionName.katakanaDakuten
  ).length;
  const katakanaHandakutenErrorCount = kanaToReview.filter(
    (kana) => kana.collection === collectionName.katakanaHandakuten
  ).length;
  const katakanaComboErrorCount = kanaToReview.filter(
    (kana) => kana.collection === collectionName.katakanaCombo
  ).length;

  const { user } = useAuth();

  updatePageInfo("頑張って！🎌 - Kana Match", "Practice your kana!");

  useEffect(() => {
    if (!sessionActive && !targetKana && kanaCollection) {
      setSessionActive(true);
      selectNextKana();
    }
  }, [kanaCollection]);

  // UI handlers, buttons and text input.

  const handleStartButton = (e) => {
    e.preventDefault();
    resetSessionState();
    createKanaCollection();
  };

  const handleEndSessionButton = (e) => {
    e.preventDefault();
    endSession();
  };

  const handleCheckButton = (e) => {
    e.preventDefault();
    if (textInput.length > 0) {
      submit();
      setTextInput("");
    }
  };

  const handleShowButton = (e) => {
    e.preventDefault();
    if (firstAttempt) {
      setFirstAttempt(false);
      incrementAllAttemptCounts();
      setKanaToReview((prevState) => {
        let newCollection = [...prevState];
        newCollection.push(targetKana);
        return newCollection;
      });
    }
    updateResponseDisplay("show");
  };

  const handleNextButton = (e) => {
    e.preventDefault();
    setShowCorrectReading(false);
    clearAllResponses();
    selectNextKana();
    setTextInput("");
    setFirstAttempt(true);
  };

  const handleInputKeyDown = (e) => {
    if (showCorrectResponse || showIncorrectResponse || setShowCorrectReading)
      clearAllResponses();
    if (e.key === "Enter" && textInput.length > 0) {
      submit();
      setTextInput("");
    }
  };

  const endSession = () => {
    clearAllResponses();
    setSessionActive(false);
  };

  // logic functions

  const submit = () => {
    if (firstAttempt) {
      incrementAllAttemptCounts();
    }
    if (kanaCheck()) {
      if (firstAttempt) setTotalCorrect(totalCorrect + 1);
      updateResponseDisplay("correct");
      selectNextKana();
      setFirstAttempt(true);
    } else {
      if (firstAttempt) {
        setKanaToReview((prevState) => {
          let newCollection = [...prevState];
          newCollection.push(targetKana);
          return newCollection;
        });
      }
      setFirstAttempt(false);
      updateResponseDisplay("incorrect");
    }
  };

  const selectNextKana = () => {
    if (kanaCollection && kanaCollection.length > 0) {
      let index = Math.floor(Math.random() * kanaCollection.length);
      setTargetKana(kanaCollection[index]);
      setKanaCollection((prevState) => {
        let newCollection = [...prevState];
        newCollection.splice(index, 1);
        return newCollection;
      });
    } else {
      endSession();
    }
  };

  const updateResponseDisplay = (result) => {
    clearAllResponses();
    if (result === "correct") {
      setShowCorrectResponse(true);
    } else if (result === "incorrect") {
      setShowIncorrectResponse(true);
    } else if (result === "show") {
      setShowCorrectReading(true);
    }
  };

  // reset functions

  const clearAllResponses = () => {
    setShowCorrectReading(false);
    setShowCorrectResponse(false);
    setShowIncorrectResponse(false);
  };

  const resetSessionState = () => {
    setTargetKana(null);
    setReviewErrors(false);
    setTotalAttempts(0);
    setTotalCorrect(0);
    setShowCorrectReading(false);
    setFirstAttempt(true);
    setKanaToReview([]);
    setTextInput("");
    setHiraganaAttemptCount(0);
    setHiraganaDakutenAttemptCount(0);
    setHiraganaHandakutenAttemptCount(0);
    setHiraganaComboAttemptCount(0);
    setKatakanaAttemptCount(0);
    setKatakanaDakutenAttemptCount(0);
    setKatakanaHandakutenAttemptCount(0);
    setKatakanaComboAttemptCount(0);
    clearAllResponses();
  };

  // state functions

  const incrementAllAttemptCounts = () => {
    setTotalAttempts(totalAttempts + 1);
    if (targetKana.collection === collectionName.hiragana) {
      setHiraganaAttemptCount(hiraganaAttemptCount + 1);
    } else if (targetKana.collection === collectionName.hiraganaDakuten) {
      setHiraganaDakutenAttemptCount(hiraganaDakutenAttemptCount + 1);
    } else if (targetKana.collection === collectionName.hiraganaHandakuten) {
      setHiraganaHandakutenAttemptCount(hiraganaHandakutenAttemptCount + 1);
    } else if (targetKana.collection === collectionName.hiraganaCombo) {
      setHiraganaComboAttemptCount(hiraganaComboAttemptCount + 1);
    } else if (targetKana.collection === collectionName.katakana) {
      setKatakanaAttemptCount(katakanaAttemptCount + 1);
    } else if (targetKana.collection === collectionName.katakanaDakuten) {
      setKatakanaDakutenAttemptCount(katakanaDakutenAttemptCount + 1);
    } else if (targetKana.collection === collectionName.katakanaHandakuten) {
      setKatakanaHandakutenAttemptCount(katakanaHandakutenAttemptCount + 1);
    } else if (targetKana.collection === collectionName.katakanaCombo) {
      setKatakanaComboAttemptCount(katakanaComboAttemptCount + 1);
    }
  };

  const createKanaCollection = () => {
    let kana = [];
    if (reviewErrors) {
      kana = [...kanaToReview];
    } else {
      if (includeHiragana) {
        kana.push(...hiragana);
      }
      if (includeHiraganaDakuten) {
        kana.push(...hiraganaDakuten);
      }
      if (includeHiraganaHandakuten) {
        kana.push(...hiraganaHandakuten);
      }
      if (includeHiraganaCombo) {
        kana.push(...hiraganaCombo);
      }
      if (includeKatakana) {
        kana.push(...katakana);
      }
      if (includeKatakanaDakuten) {
        kana.push(...katakanaDakuten);
      }
      if (includeKatakanaHandakuten) {
        kana.push(...katakanaHandakuten);
      }
      if (includeKatakanaCombo) {
        kana.push(...katakanaCombo);
      }
    }
    setKanaCollection(kana);
  };

  // check functions
  const kanaCheck = () => {
    let isMatch = false;
    targetKana.readings.forEach((kana) => {
      if (!isMatch) isMatch = textInput.toLowerCase() === kana;
    });
    return isMatch;
  };

  const confirmAtLeastOneCollectionSelected = () => {
    return (
      includeHiragana ||
      includeHiraganaDakuten ||
      includeHiraganaHandakuten ||
      includeHiraganaCombo ||
      includeKatakana ||
      includeHiraganaDakuten ||
      includeKatakanaHandakuten ||
      includeKatakanaCombo ||
      reviewErrors
    );
  };

  if (!user) {
    return <p style={{textAlign:"center"}}>Please log in to view this page.</p>
  }


  return (
    <div className={styles.container}>
      <form className={styles.collections}>
        <div className={styles.hiraganaCollection}>
          <label>
            <input
              type="checkbox"
              disabled={sessionActive || reviewErrors}
              onChange={(e) => {
                setHiragana(e.target.checked);
              }}
              checked={includeHiragana}
              id="hiraganaCheckBox"
            />{" "}
            hiragana
          </label>
          <label>
            <input
              type="checkbox"
              disabled={sessionActive || reviewErrors}
              onChange={(e) => {
                setHiraganaDakuten(e.target.checked);
              }}
              checked={includeHiraganaDakuten}
              id="hiraganaDakutenCheckBox"
            />{" "}
            hiragana dakuten
          </label>
          <label>
            <input
              type="checkbox"
              disabled={sessionActive || reviewErrors}
              onChange={(e) => {
                setHiraganaHandakuten(e.target.checked);
              }}
              checked={includeHiraganaHandakuten}
              id="hiraganaHandakutenCheckBox"
            />{" "}
            hiragana handakuten
          </label>
          <label>
            <input
              type="checkbox"
              disabled={sessionActive || reviewErrors}
              onChange={(e) => {
                setHiraganaCombo(e.target.checked);
              }}
              checked={includeHiraganaCombo}
              id="hiraganaYoonCheckBox"
            />{" "}
            hiragana combo
          </label>
        </div>
        <div className={styles.katakanaCollection}>
          <label>
            <input
              type="checkbox"
              disabled={sessionActive || reviewErrors}
              onChange={(e) => {
                setKatakana(e.target.checked);
              }}
              checked={includeKatakana}
              id="katakanaCheckBox"
            />{" "}
            katakana
          </label>
          <label>
            <input
              type="checkbox"
              disabled={sessionActive || reviewErrors}
              onChange={(e) => {
                setKatakanaDakuten(e.target.checked);
              }}
              checked={includeKatakanaDakuten}
              id="katakanaDakutenCheckBox"
            />{" "}
            katakana dakuten
          </label>
          <label>
            <input
              type="checkbox"
              disabled={sessionActive || reviewErrors}
              onChange={(e) => {
                setKatakanaHandakuten(e.target.checked);
              }}
              checked={includeKatakanaHandakuten}
              id="katakanaHandakutenCheckBox"
            />{" "}
            katakana handakuten
          </label>
          <label>
            <input
              type="checkbox"
              disabled={sessionActive || reviewErrors}
              onChange={(e) => {
                setKatakanaCombo(e.target.checked);
              }}
              checked={includeKatakanaCombo}
              id="katakanaYoonCheckBox"
            />{" "}
            katakana combo
          </label>
        </div>
      </form>
      <section className={styles.main}>
        <div className={styles.kanaDisplay}>
          {sessionActive && targetKana.kana !== "" ? targetKana.kana : "日本語"}
        </div>
        <div className={styles.responseDisplay}>
          <div className={styles.responses}>
            <p
              className={`${styles.correctResponse} ${
                showCorrectResponse && sessionActive ? styles.showResponse : ""
              }`}
            >
              CORRECT
            </p>
            <p
              className={`${styles.incorrectResponse} ${
                showIncorrectResponse && sessionActive
                  ? styles.showResponse
                  : ""
              }`}
            >
              INCORRECT
            </p>
          </div>
          <p
            className={`${styles.correctReading} ${
              showCorrectReading && sessionActive ? styles.showResponse : ""
            }`}
          >
            The correct answer is{" "}
            <b>{targetKana ? targetKana.readings.join(", ") : ""}</b>
          </p>
        </div>
        <div className={styles.mainInputContainer}>
          <input
            type="text"
            disabled={!sessionActive || showCorrectReading}
            value={textInput}
            onKeyDown={(e) => handleInputKeyDown(e)}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <br />
          <div className={styles.buttonContainer}>
            <button
              disabled={!sessionActive}
              className="danger"
              onClick={(e) => handleShowButton(e)}
            >
              Show
            </button>
            {showCorrectReading ? (
              <button
                disabled={!sessionActive}
                className="success"
                onClick={(e) => handleNextButton(e)}
              >
                Next
              </button>
            ) : (
              <button
                disabled={!sessionActive}
                className="success"
                onClick={(e) => handleCheckButton(e)}
              >
                Check
              </button>
            )}
          </div>
        </div>
      </section>
      <section className={styles.kanaStats}>
        <div className={styles.persistentStats}>
          <p>Total Attempts:</p>
          <p>{totalAttempts}</p>
        </div>
        <div className={styles.persistentStats}>
          <p>Number correct:</p>
          <p>{totalCorrect}</p>
        </div>
        <div className={styles.persistentStats}>
          <p>Percentage Correct:</p>
          <p>{Math.floor((totalCorrect / totalAttempts) * 100) || 0}%</p>
        </div>
        {!sessionActive && totalAttempts > 0 ? (
          <div className={styles.kanaToReview}>
            <p>Session Details:</p>
            <p>Click the categories below to see the kana you missed.</p>
            {hiraganaAttemptCount > 0 && (
              <KanaCollectionErrorDetails
                collectionName={collectionName.hiragana}
                errorCount={hiraganaErrorCount}
                collectionAttemptCount={hiraganaAttemptCount}
                kanaToReview={kanaToReview.filter(
                  (kana) => kana.collection === collectionName.hiragana
                )}
              />
            )}
            {hiraganaDakutenAttemptCount > 0 && (
              <KanaCollectionErrorDetails
                collectionName={collectionName.hiraganaDakuten}
                errorCount={hiraganaDakutenErrorCount}
                collectionAttemptCount={hiraganaDakutenAttemptCount}
                kanaToReview={kanaToReview.filter(
                  (kana) => kana.collection === collectionName.hiraganaDakuten
                )}
              />
            )}
            {hiraganaHandakutenAttemptCount > 0 && (
              <KanaCollectionErrorDetails
                collectionName={collectionName.hiraganaHandakuten}
                errorCount={hiraganaHandakutenErrorCount}
                collectionAttemptCount={hiraganaHandakutenAttemptCount}
                kanaToReview={kanaToReview.filter(
                  (kana) =>
                    kana.collection === collectionName.hiraganaHandakuten
                )}
              />
            )}
            {hiraganaComboAttemptCount > 0 && (
              <KanaCollectionErrorDetails
                collectionName={collectionName.hiraganaCombo}
                errorCount={hiraganaComboErrorCount}
                collectionAttemptCount={hiraganaComboAttemptCount}
                kanaToReview={kanaToReview.filter(
                  (kana) => kana.collection === collectionName.hiraganaCombo
                )}
              />
            )}
            {katakanaAttemptCount > 0 && (
              <KanaCollectionErrorDetails
                collectionName={collectionName.katakana}
                errorCount={katakanaErrorCount}
                collectionAttemptCount={katakanaAttemptCount}
                kanaToReview={kanaToReview.filter(
                  (kana) => kana.collection === collectionName.katakana
                )}
              />
            )}
            {katakanaDakutenAttemptCount > 0 && (
              <KanaCollectionErrorDetails
                collectionName={collectionName.katakanaDakuten}
                errorCount={katakanaDakutenErrorCount}
                collectionAttemptCount={katakanaDakutenAttemptCount}
                kanaToReview={kanaToReview.filter(
                  (kana) => kana.collection === collectionName.katakanaDakuten
                )}
              />
            )}
            {katakanaHandakutenAttemptCount > 0 && (
              <KanaCollectionErrorDetails
                collectionName={collectionName.katakanaHandakuten}
                errorCount={katakanaHandakutenErrorCount}
                collectionAttemptCount={katakanaHandakutenAttemptCount}
                kanaToReview={kanaToReview.filter(
                  (kana) =>
                    kana.collection === collectionName.katakanaHandakuten
                )}
              />
            )}
            {katakanaComboAttemptCount > 0 && (
              <KanaCollectionErrorDetails
                collectionName={collectionName.katakanaCombo}
                errorCount={katakanaComboErrorCount}
                collectionAttemptCount={katakanaComboAttemptCount}
                kanaToReview={kanaToReview.filter(
                  (kana) => kana.collection === collectionName.katakanaCombo
                )}
              />
            )}
          </div>
        ) : (
          ""
        )}
        <div className={styles.mainButtonContainer}>
          {sessionActive ? (
            <button onClick={(e) => handleEndSessionButton(e)}>
              END CURRENT SESSION
            </button>
          ) : (
            <div className={styles.centerVertically}>
              {kanaToReview.length > 0 ? (
                <label className={styles.centerVertically}>
                  Review errors from last session{" "}
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setReviewErrors(e.target.checked);
                    }}
                    checked={reviewErrors}
                  />
                </label>
              ) : (
                ""
              )}
              <button
                onClick={(e) => handleStartButton(e)}
                disabled={!confirmAtLeastOneCollectionSelected()}
              >
                START
              </button>
            </div>
          )}
        </div>
        <p>
          The answers are based off of wikipedia&apos;s{" "}
          <a
            href="https://en.wikipedia.org/wiki/Hiragana#Table_of_hiragana"
            target="_blank"
            rel="noopener noreferrer"
          >
            hiragana
          </a>{" "}
          and{" "}
          <a
            href="https://en.wikipedia.org/wiki/Katakana#Table_of_katakana"
            target="_blank"
            rel="noopener noreferrer"
          >
            katakana
          </a>{" "}
          charts.
        </p>
      </section>
    </div>
  );
};

export default KanaCheck;
