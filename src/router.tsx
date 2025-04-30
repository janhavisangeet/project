import { createBrowserRouter, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import PdfsPage from "./pages/PdfsPage";
import AuthLayout from "./layouts/AuthLayout";
import CreatePdf from "./pages/CreatePdf";
import AllPdfsPage from "./pages/AllPdfsPage";
import RequestsPage from "./pages/RequestPage";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/allPdfs",
    element: <AllPdfsPage />,
  },
  {
    path: "/auth",
    element: <AuthLayout />, // Wrapper for auth pages
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "pdfs",
        element: <PdfsPage />,
      },
      {
        path: "pdfs/create",
        element: <CreatePdf />,
      },
    ],
  },
  {
    path: "/adminDashboard",
    element: <AdminDashboardLayout />,
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "pdfs",
        element: <PdfsPage />,
      },
      {
        path: "pdfs/create",
        element: <CreatePdf />,
      },
      {
        path: "requests", // ✅ New route for admin requests tab
        element: <RequestsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default router;
