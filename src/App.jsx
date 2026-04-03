import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Components
import Navbar from './Components/Navbar/navbar';
import Footer from './Components/Footer/footer';
import ScrollToTop from './Components/ScrollTop';

// Lazy Loading (পারফরম্যান্স এবং SEO এর জন্য ভালো)
const Home = lazy(() => import('./PublicPages/HomePage/home').then(module => ({ default: module.Home })));
const AppDetails = lazy(() => import('./PublicPages/appDetails/appdetails').then(module => ({ default: module.AppDetails })));
const CategoryPage = lazy(() => import('./PublicPages/categoryPage/CategoryPage').then(module => ({ default: module.CategoryPage })));
const Terms = lazy(() => import('./PublicPages/terms'));
const PrivacyPolicy = lazy(() => import('./PublicPages/privecy'));
const AdminPanel = lazy(() => import('./AdminPages/AdminPage').then(module => ({ default: module.AdminPanel })));

// --- Admin Protection Logic ---
const PrivateRoute = ({ children }) => {
    const isAdmin = document.cookie.includes('token'); // এখানে তোমার টোকেন চেক লজিক দাও
    return isAdmin ? children : <Navigate to="/" />;
};

function App() {
    const navlinks = [
        { label: "Home", path: "/" },
        { label: "Tools", path: "/category/tools" },
        { label: "Games", path: "/category/games" },
        { label: "Entertainment", path: "/category/entertainment" },
        { label: "Premium/VPNs", path: "/category/prices" }
    ];

    return (
        <HelmetProvider>
            <Router>
                <ScrollToTop /> {/* পেজ পরিবর্তন হলে স্ক্রল টপে নিয়ে যাবে */}
                <Navbar navlinks={navlinks} />
                
                {/* Lazy loading এর সময় এই Loading টি দেখাবে */}
                <Suspense fallback={<div className="loading-screen">Loading...</div>}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path='/' element={<Home />} />
                        <Route path="/app/:id" element={<AppDetails />} />
                        <Route path="/category/:slug" element={<CategoryPage />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<Terms />} />

                        {/* Protected Admin Route */}
                        <Route 
                            path='/admin' 
                            element={
                                
                                    <AdminPanel />
                               
                            } 
                        />

                        {/* 404 Page (SEO এর জন্য জরুরি) */}
                        <Route path="*" element={<div className="not-found">404 - Page Not Found</div>} />
                    </Routes>
                </Suspense>

                <Footer />
            </Router>
        </HelmetProvider>
    );
}

export default App;