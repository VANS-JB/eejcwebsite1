import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const root = document.getElementById("root")!;
const serverState = (window as Window & { __EEJC_SSR__?: { pathname: string; sermons: import("@/App").Sermon[] } }).__EEJC_SSR__;
const app = (
  <StrictMode>
    <App pathname={serverState?.pathname} sermons={serverState?.sermons} />
  </StrictMode>
);
const isAdminRoute =
  window.location.pathname.startsWith("/admin") ||
  window.location.hash.startsWith("#/admin");

if (isAdminRoute) {
  root.replaceChildren();
  createRoot(root).render(app);
} else {
  hydrateRoot(root, app);
}
