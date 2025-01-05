import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const user = localStorage.getItem("token");

  return (
    <Routes>
      {user && <Route path="/" exact element={<Main />} />}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login key={Date.now()} />} /> {/* Add key */}
      <Route path="/forgot-password" exact element={<ForgotPassword />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/password-reset/:userId/:token" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;

