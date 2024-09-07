import { createBrowserRouter } from "react-router-dom";
import { Login, SignUp, AuthScreen, UserRouter, Dashboard } from "../Screens";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthScreen />,
    // errorElement: <ErrorPage />, // Handle errors for auth routes
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
    path: "/dashboard",
    element: <UserRouter />,
    // errorElement: <ErrorPage />, // Handle errors for dashboard routes
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
