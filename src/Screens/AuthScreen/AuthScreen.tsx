// src/Screens/AuthScreen.jsx

import { Outlet } from "react-router-dom";

const AuthScreen = () => {
  return (
    <div>
      {/* You can include common layout or styling for auth screens here */}
      <Outlet /> {/* This renders the child routes */}
    </div>
  );
};

export default AuthScreen;
