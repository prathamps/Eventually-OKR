import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Eventually_OKR from "./Eventually_OKR.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Eventually_OKR />
  </StrictMode>,
);
