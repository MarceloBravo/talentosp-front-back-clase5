import PulseLoader from 'react-spinners/PulseLoader'
import styles from './SpinnerComponent.module.css'

export const SpinnerComponent = () => {
  return (
    <div className={styles.spinnerContent}>
        <div className={styles.spinnerBackend}></div>
        <PulseLoader />
    </div>
  )
}