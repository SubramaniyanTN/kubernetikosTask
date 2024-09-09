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
    path: import.meta.env.BASE_URL, // Base URL is only needed at the root level
    element: <AuthScreen />,
    // errorElement: <ErrorPage />, // Handle errors for auth routes
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "signup", // Relative to base path
        element: <SignUp />,
      },
    ],
  },
  {
    path: import.meta.env.BASE_URL + "user", // Base URL for user routes
    element: <UserRouter />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "settings", // Child routes do not need base URL
        element: <Settings />,
      },
    ],
  },
]);

export default router;
