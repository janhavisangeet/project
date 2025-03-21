import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import PdfsPage from './pages/PdfsPage';
import AuthLayout from './layouts/AuthLayout';
import CreatePdf from './pages/CreatePdf';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/dashboard/home" />,
    },
    {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
            {
                path: 'home',
                element: <HomePage />,
            },
            {
                path: 'pdfs',
                element: <PdfsPage />,
            },
            {
                path: 'pdfs/create',
                element: <CreatePdf />,
            },
        ],
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'register',
                element: <RegisterPage />,
            },
        ],
    },
]);

export default router;
