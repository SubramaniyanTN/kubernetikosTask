import { createBrowserRouter, createHashRouter } from "react-router-dom";
import {
  Login,
  SignUp,
  AuthScreen,
  UserRouter,
  Dashboard,
  Settings,
} from "../Screens";

const router = createHashRouter([
  {
    path: "/",
    element: <AuthScreen />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/user",
    element: <UserRouter />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

export default router;
