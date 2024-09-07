import { RouterProvider } from "react-router-dom";
import router from "./Router/Router";
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "react-toastify/dist/ReactToastify.css";

import { createTheme, MantineProvider } from "@mantine/core";
import { ToastContainer } from "react-toastify";
function App() {
  const theme = createTheme({});
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        closeButton={true}
      />
    </MantineProvider>
  );
}

export default App;
