import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ContextProvider } from "./context/Context";
import "bootstrap/dist/css/bootstrap.min.css";
import { ContextSocketProvider } from "./pages/videoChat/Context";
import { GoogleOAuthProvider } from "@react-oauth/google";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <ContextSocketProvider>
        <ContextProvider>
          <App />
        </ContextProvider>
      </ContextSocketProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
