import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import { AuthWrapper } from "./context/wrapContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </StrictMode>
);
