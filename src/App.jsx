// src/App.jsx
import {BrowserRouter as Router, Routes, Route, useLocation, useNavigate} from "react-router-dom";
import MainCategoryPage from "./pages/MainCategoryPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import './styles/App.css';
import Navbar from "./components/navbar/Navbar.jsx";
import {useState, useEffect} from "react";
import CategoryPage from "./pages/CategoryPage.jsx";
import ItemPage from "./pages/ItemPage.jsx";
import {BasketProvider} from "./context/BasketContext.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {Toaster} from "react-hot-toast";
import Cookies from 'js-cookie';

function AppContent() {
    const [navbarTitle, setNavbarTitle] = useState("");
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlCode = params.get("code");
        const cookieCode = Cookies.get("order_place_code");

        if (urlCode) {
            // Ako nema cookie ili postoji cookie → zamijeni sa novim kodom
            Cookies.set("order_place_code", urlCode, { expires: 1/288 }); // 5 minuta
            // Opcionalno: ukloni ?code iz URL-a
            navigate(location.pathname, { replace: true });
        }
        // Ako nema urlCode → ne radimo ništa (cookie ostaje)
    }, [location, navigate]);

    if (isDashboard) {
        return (
            <div className="dashboard-wrapper">
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute requiredRole={["admin", "waiter"]}>
                                <Dashboard setNavbarTitle={setNavbarTitle}/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        );
    }

    return (
        <div className="app-container">
            <Navbar title={navbarTitle}/>
            <div className="content-container">
                <Routes>
                    <Route
                        path="/"
                        element={<HomePage setNavbarTitle={setNavbarTitle}/>}
                    />
                    <Route
                        path="/main-category/:id"
                        element={<MainCategoryPage setNavbarTitle={setNavbarTitle}/>}
                    />
                    <Route
                        path="/category/:id"
                        element={<CategoryPage setNavbarTitle={setNavbarTitle}/>}
                    />
                    <Route
                        path="/item/:id"
                        element={<ItemPage setNavbarTitle={setNavbarTitle}/>}
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <Dashboard setNavbarTitle={setNavbarTitle}/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <BasketProvider>
                    <Router>
                        <AppContent/>
                        <Toaster position="top-center" reverseOrder={false}/>
                    </Router>
            </BasketProvider>
        </AuthProvider>
    );
}

export default App;