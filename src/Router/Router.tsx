import { createBrowserRouter } from "react-router-dom";
import { Dashboard, Login, SignUp, AuthScreen } from "../Screens";

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
    element: <Dashboard />,
    // errorElement: <ErrorPage />, // Handle errors for dashboard routes
    children: [
      // You can add nested routes here
    ],
  },
]);

export default router;
