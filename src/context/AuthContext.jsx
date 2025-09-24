import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { logoutUser } from '../api/services/auth/AuthServices';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');
        const name = Cookies.get('name');
        const surname = Cookies.get('surname');
        const username = Cookies.get('username');
        const email = Cookies.get('email');
        const role = Cookies.get('role');

        if (token && username) {
            const userData = { name, surname, username, email, role, token };
            setUser(userData);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        Cookies.set('token', userData.token, { expires: 7 });
        Cookies.set('name', userData.name, { expires: 7 });
        Cookies.set('surname', userData.surname, { expires: 7 });
        Cookies.set('username', userData.username, { expires: 7 });
        Cookies.set('email', userData.email || '', { expires: 7 });
        Cookies.set('role', userData.role, { expires: 7 });

        setUser({
            name: userData.name,
            surname: userData.surname,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            token: userData.token
        });
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            Cookies.remove('token');
            Cookies.remove('name');
            Cookies.remove('surname');
            Cookies.remove('username');
            Cookies.remove('email');
            Cookies.remove('role');

            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUser = (updatedData) => {
        if (updatedData.name) Cookies.set('name', updatedData.name, { expires: 7 });
        if (updatedData.surname) Cookies.set('surname', updatedData.surname, { expires: 7 });
        if (updatedData.username) Cookies.set('username', updatedData.username, { expires: 7 });
        if (updatedData.email) Cookies.set('email', updatedData.email || '', { expires: 7 });
        if (updatedData.role) Cookies.set('role', updatedData.role, { expires: 7 });

        setUser((prevUser) => ({
            ...prevUser,
            ...updatedData,
        }));
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
