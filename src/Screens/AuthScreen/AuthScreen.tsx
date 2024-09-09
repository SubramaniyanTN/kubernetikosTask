// src/Screens/AuthScreen.jsx

import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import supabase from "../../utils/supabaseConfig";
import useUserData from "../../Store/Store";

const AuthScreen = () => {
  const navigate = useNavigate();
  const getUser = async () => {
    const response = await supabase.auth.getUser();
    await supabase.auth.refreshSession();
    if (response.data.user) {
      console.log(import.meta.env.BASE_URL + "user");
      navigate(import.meta.env.BASE_URL + "user");
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
