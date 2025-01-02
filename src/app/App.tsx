import { InternalRouterProvider } from "@/shared";
import { RouterProvider } from "react-router-dom";
import { createRouter } from "./router";

function App() {
  return (
    <InternalRouterProvider>
      <RouterProvider router={createRouter()} />
    </InternalRouterProvider>
  );
}

export default App;
