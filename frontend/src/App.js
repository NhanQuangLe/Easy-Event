import "./App.css";
import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthPage from "./pages/Auth/Auth";
import EventsPage from "./pages/Event/Events";
import BookingsPage from "./pages/Booking/Bookings";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";

function App() {
  const [state, setState] = useState({
    token: null,
    userId: null,
  });
  let navigate = useNavigate();
  const login = (token, userId) => {
    setState({ token: token, userId: userId });
    navigate("/events");
  };

  const logout = () => {
    setState({ token: null, userId: null });
    navigate("/auth");
  };
  return (
    <React.Fragment>
      <AuthContext.Provider
        value={{
          token: state.token,
          userId: state.userId,
          login: login,
          logout: logout,
        }}
      >
        <MainNavigation />
        <main className="main-content">
          <Routes>
            {!state.token && (
              <Route path="/" element={<Navigate to="/auth" />} />
            )}
            {!state.token && <Route path="/auth" element={<AuthPage />} />}
            <Route path="/events" element={<EventsPage />} />
            {state.token && (
              <Route path="/bookings" element={<BookingsPage />} />
            )}
          </Routes>
        </main>
      </AuthContext.Provider>
    </React.Fragment>
  );
}

export default App;
