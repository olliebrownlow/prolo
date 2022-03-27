import React from "react";
import styles from "./errorBoundary.module.scss";
import { XCircle } from "react-feather";
import { motion } from "framer-motion";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false, attempts: 0 };
  }
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className={styles.container}>
          <XCircle size={104} fill={"lightgrey"} stroke={"red"} />
          <div className={styles.heading}>oops, there was an error!</div>
          <motion.button
            className={styles.button}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.75 }}
            onClick={() =>
              this.setState({
                hasError: false,
                attempts: this.state.attempts + 1,
              })
            }
          >
            try again?
          </motion.button>
          {this.state.attempts > 0 ? (
            <>
              <div className={styles.attempts}>
                attempts: {this.state.attempts}
              </div>
              <div className={styles.attempts}>
                if this error persists, please contact
                <br />
                prolo@gmail.com
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
