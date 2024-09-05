import { createBrowserRouter } from "react-router-dom";
import { Dashboard, Login } from "../Screens";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    //   errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      //   {
      //     index: true,
      //     element: <Projects />,
      //   },
    ],
  },
]);

export default router;
