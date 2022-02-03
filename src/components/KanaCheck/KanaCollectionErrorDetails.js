import styles from '../../styles/KanaCheck/KanaCollectionErrorDetails.module.scss'

const KanaCollectionErrorDetails = ({
  collectionName,
  errorCount,
  collectionAttemptCount,
  kanaToReview,
}) => {
  return (
    <details>
      <summary>
        {collectionName}: {collectionAttemptCount - errorCount}/{collectionAttemptCount} 
        {collectionAttemptCount > 0 ? ` (${Math.floor(((collectionAttemptCount - errorCount) / collectionAttemptCount) * 100) || 0}%)` : " (N/A)"}
      </summary>
      <div className={styles.kanaDetails}>
        {kanaToReview.length > 0 ? kanaToReview.map((kana, index) => {
          if (kana.collection === collectionName) {
            return (
              <p key={index}>
                {kana.kana} : {kana.readings.join(", ")}
              </p>
            );
          }
        }): <p>No errors! <b>やったね！</b>🎉</p>}
      </div>
    </details>
  );
};

export default KanaCollectionErrorDetails;

