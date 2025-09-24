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
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';


function AppContent() {
    const [navbarTitle, setNavbarTitle] = useState("");
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';
    const navigate = useNavigate();
    const TOKEN = Cookies.get('token');
    const USERNAME = Cookies.get('username');

    useEffect(() => {
        if (!TOKEN || !USERNAME) {
            return;
        }

        console.log('Initializing Echo for user:', USERNAME);

        const echo = new Echo({
            broadcaster: 'reverb',
            key: 'otgeqph5dewzab5a8yki',
            wsHost: '192.168.1.101',
            wsPort: '8081',
            forceTLS: false,
            encrypted: false,
            enabledTransports: ['ws'],
            authEndpoint: 'http://192.168.1.101:8000/broadcasting/auth',
            auth: {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: 'application/json',
                }
            }
        });

        echo.connector.pusher.connection.bind("connected", () => {
            console.log("Connected to socket");
            console.log("Socket ID:", echo.connector.pusher.connection.socket_id);
        });

        echo.connector.pusher.connection.bind("error", (error) => {
            console.error("Socket connection error:", error);
        });

        echo.connector.pusher.connection.bind("disconnected", () => {
            console.log("Disconnected from socket");
        });

        echo.connect();

        setTimeout(() => {
            console.log('Subscribing to channel: private-channel.user.' + USERNAME);

            const privateChannel = echo.private(`private-channel.user.${USERNAME}`);

            privateChannel.subscribed(() => {
                console.log('Successfully subscribed to private channel');
            });

            privateChannel.error((error) => {
                console.error('Private channel subscription error:', error);
            });

            privateChannel.listen('PrivateChannelEvent', (e) => {
                console.log('📨 Private event received:', e);

                if (e.title === "order") {
                    window.dispatchEvent(new CustomEvent("order-received", { detail: e }));
                }
            });

        }, 1000);

        return () => {
            try {
                echo.disconnect();
            } catch (error) {
                console.error('Error disconnecting:', error);
            }
        }
    }, [TOKEN, USERNAME]);


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlCode = params.get("code");
        const cookieCode = Cookies.get("order_place_code");

        if (urlCode) {
            Cookies.set("order_place_code", urlCode, { expires: 1/288 }); // 5 minuta
            navigate(location.pathname, { replace: true });
        }
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