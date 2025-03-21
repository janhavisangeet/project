import React from "react";
import ReactDOM from "react-dom/client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster richColors theme="light" />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
