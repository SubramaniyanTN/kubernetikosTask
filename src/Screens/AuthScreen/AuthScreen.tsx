// src/Screens/AuthScreen.jsx

import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import supabase from "../../utils/supabaseConfig";

const AuthScreen = () => {
  const navigate = useNavigate();
  const getUser = async () => {
    const response = await supabase.auth.getUser();
    console.log("getSession", await supabase.auth.getSession());
    console.log("getUserIdentities", await supabase.auth.getUserIdentities());
    console.log("getUser", await supabase.auth.getUser());

    if (response.data.user) {
      navigate("/user");
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div>
      {/* You can include common layout or styling for auth screens here */}
      <Outlet /> {/* This renders the child routes */}
    </div>
  );
};

export default AuthScreen;
