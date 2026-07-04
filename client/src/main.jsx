import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { SoundProvider } from "./context/SoundContext.jsx";
import { AuthUserProvider } from "./context/AuthUser.jsx";
import { UserProvider } from "./context/FetchUsers.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <UserProvider>
        <AuthUserProvider>
          <NotificationProvider>
            <SoundProvider>
              <App />
            </SoundProvider>
          </NotificationProvider>
        </AuthUserProvider>
      </UserProvider>
    </StrictMode>
  </BrowserRouter>,
);
