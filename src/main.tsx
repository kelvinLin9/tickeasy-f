import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@/core/styles/global.css";
import App from "./App.tsx";
import "@/core/icons/register";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Theme>
  </StrictMode>
);
