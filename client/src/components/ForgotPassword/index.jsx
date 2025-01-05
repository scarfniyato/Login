import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false); // To disable the button
  const [timer, setTimer] = useState(0); // Timer state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/password-reset/send-reset-email",
        { email }
      );
      setMessage(response.data.message);

      // Start the timer
      setIsDisabled(true);
      setTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  // Effect to handle the timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsDisabled(false); //Re-enable the button after timer ends
    }
    return () => clearInterval(interval); //Cleanup interval on component unmount
  }, [timer]);

  return (
    <div className={styles.container}>
      <h2>Forgot Password</h2>
      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={styles.button}
          disabled={isDisabled} //Disable button when timer is running
        >
          {isDisabled ? `Send Reset Link (${timer}s)` : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
