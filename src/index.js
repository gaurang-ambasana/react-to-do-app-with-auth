import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SessionProvider } from "@inrupt/solid-ui-react";

ReactDOM.render(
  <SessionProvider>
    <App />
  </SessionProvider>,
  document.getElementById("root")
);
