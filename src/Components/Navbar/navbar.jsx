import './navbar.scss';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useScroll from '../../Hooks/useScroll';
import LoginForm from '../Login/login';
import { useAuth } from '../../Hooks/AuthContext';
import { LogOut, Settings, User, Shield, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar({ navlinks, isAuthenticated, isAdmin }) {
    const [isMobileMenu, setIsMobileMenu] = useState(false); // মোবাইল মেনু স্টেট
    const [isForm, setIsForm] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const isScrolled = useScroll();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setShowUserMenu(false);
        setIsMobileMenu(false);
    };

    return (
        <section className={`Navbar ${isScrolled ? "active-nav" : ""}`}>
            <nav>
                <div className='nav-left'>
                    <Link to="/" className="logo" onClick={() => setIsMobileMenu(false)}>
                        <span className="logo-text">Crack<span>Mods</span></span>
                    </Link>
                </div>

                {/* --- Desktop & Mobile Links --- */}
                <div className={`nav-links ${isMobileMenu ? "mobile-active" : ""}`}>
                    <ul>
                        {navlinks.map((links, index) => (
                            <li key={index}>
                                <Link to={links.path} onClick={() => setIsMobileMenu(false)}>
                                    {links.label}
                                </Link>
                            </li>
                        ))}

                        {isAuthenticated ? (
                            <li className="user-menu-wrapper">
                                <div className="user-info" onClick={() => setShowUserMenu(!showUserMenu)}>
                                    <div className="avatar"><User size={18} /></div>
                                    <span className="username">{user?.username || "Account"}</span>
                                    <ChevronDown size={14} className={showUserMenu ? "rotate" : ""} />
                                </div>

                                {showUserMenu && (
                                    <div className="user-dropdown">
                                        {isAdmin && (
                                            <Link to="/admin" onClick={() => {setShowUserMenu(false); setIsMobileMenu(false)}}>
                                                <Shield size={16} /> Admin Panel
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="logout-btn">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </li>
                        ) : (
                            <li className="login-btn-nav" onClick={() => {setIsForm(true); setIsMobileMenu(false)}}>
                                Login
                            </li>
                        )}
                    </ul>
                </div>

                {/* --- Right Side Actions --- */}
                <div className='nav-right'>
                    <div className="navbar-ad-desk">
                        {/* Ad Slot */}
                    </div>

                    {/* Hamburger Icon for Mobile */}
                    <div className="mobile-toggle" onClick={() => setIsMobileMenu(!isMobileMenu)}>
                        {isMobileMenu ? <X size={28} /> : <Menu size={28} />}
                    </div>
                </div>
            </nav>

            {/* Overlay for mobile menu background dim */}
            {isMobileMenu && <div className="nav-overlay" onClick={() => setIsMobileMenu(false)}></div>}

            <LoginForm isForm={isForm} setIsForm={setIsForm} />
        </section>
    );
}