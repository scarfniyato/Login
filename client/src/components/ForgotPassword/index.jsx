import React, { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // client/src/components/ForgotPassword/index.jsx

const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
        const response = await axios.post("http://localhost:8080/api/password-reset/send-reset-email", {
            email,
        });
        setMessage(response.data.message);
    } catch (err) {
        setError(err.response?.data?.message || "Something went wrong.");
    }
};


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
        <button type="submit" className={styles.button}>
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
