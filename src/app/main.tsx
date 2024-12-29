import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

export const bootstrap = async () => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

bootstrap();