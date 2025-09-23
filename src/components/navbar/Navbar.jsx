// src/components/navbar/Navbar.jsx
import React, { useState } from 'react';
import '../../styles/Navbar.css';
import {TbBasket} from "react-icons/tb";
import {RiArrowLeftSLine} from "react-icons/ri";
import {IoMdHome} from "react-icons/io";
import {useNavigate, useLocation} from "react-router-dom";
import Basket from '../basket/Basket';
import { RiLoginBoxLine } from "react-icons/ri";
import LoginModal from '../auth/LoginModal.jsx';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({title = "Main Category"}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isBasketOpen, setIsBasketOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleBasketClick = () => {
        setIsBasketOpen(!isBasketOpen);
    };

    const handleLogout = () => {
        logout();
    };

    const isHomePage = location.pathname === '/';

    return (
        <>
            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
            />

            <div className="navbar-container">
                <div className="navbar-side">
                    {isHomePage ? (
                        isAuthenticated ? (
                            <button className="home-btn" onClick={handleLogout} title={`Odjavi ${user?.name}`}>
                                <RiLoginBoxLine />
                            </button>
                        ) : (
                            <button className="home-btn" onClick={() => setLoginModalOpen(true)}>
                                <RiLoginBoxLine />
                            </button>
                        )
                    ) : (
                        <button className="back-btn" onClick={handleBackClick}>
                            <RiArrowLeftSLine/>
                        </button>
                    )}
                </div>
                <div className="navbar-title">
                    {title}
                </div>
                <div className="navbar-side">
                    <button className="basket-btn" onClick={handleBasketClick}>
                        <TbBasket/>
                    </button>
                </div>
            </div>

            {isBasketOpen && (
                <Basket
                    isOpen={isBasketOpen}
                    onClose={() => setIsBasketOpen(false)}
                />
            )}
        </>
    );
};

export default Navbar;