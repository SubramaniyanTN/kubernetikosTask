import { createBrowserRouter } from "react-router-dom";
import {
  Login,
  SignUp,
  AuthScreen,
  UserRouter,
  Dashboard,
  Settings,
} from "../Screens";

const router = createBrowserRouter([
  {
    path: import.meta.env.BASE_URL,
    element: <AuthScreen />,
    // errorElement: <ErrorPage />, // Handle errors for auth routes
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: import.meta.env.BASE_URL + "signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: import.meta.env.BASE_URL + "user",
    element: <UserRouter />,
    // errorElement: <ErrorPage />, // Handle errors for dashboard routes
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
