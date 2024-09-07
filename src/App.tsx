import { RouterProvider } from "react-router-dom";
import router from "./Router/Router";
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { createTheme, MantineProvider } from "@mantine/core";
function App() {
  const theme = createTheme({});
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
