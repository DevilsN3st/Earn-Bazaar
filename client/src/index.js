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
    <GoogleOAuthProvider clientId="706957351927-2fuq9fc5qsl69oueof5f38pq001anil4.apps.googleusercontent.com">
      <ContextSocketProvider>
        <ContextProvider>
          <App />
        </ContextProvider>
      </ContextSocketProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
