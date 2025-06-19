import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import GenerationContextProvider from "./providers/GenerationContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GenerationContextProvider>
      <App />
    </GenerationContextProvider>
  </StrictMode>
);
