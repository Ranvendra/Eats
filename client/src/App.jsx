import React from "react";
import { ToastProvider } from "./Toast/ToastContext";
import Home from "./HomePage/Home";

function App() {
  return (
    <ToastProvider>
      <Home />
    </ToastProvider>
  );
}

export default App;
