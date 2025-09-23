// src/components/sidebar/Sidebar.jsx
import {useAuth} from '../../context/AuthContext';
import {useState, useEffect} from 'react';
import { updateMyProfile, changePassword } from '../../api/services/app/UserServices';
import UniversalModal from '../modal/UniversalModal';
import '../../styles/Sidebar.css';
import toast from "react-hot-toast";

const Sidebar = ({activeSection, setActiveSection}) => {
    const {user, logout} = useAuth();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { updateUser } = useAuth();

    const menuItems = [
        {id: 'main_categories', label: 'Glavne kategorije', icon: ''},
        {id: 'categories', label: 'Kategorije', icon: ''},
        {id: 'items', label: 'Stavke', icon: ''},
        {id: 'order_places', label: 'Mjesta', icon: ''},
        {id: 'users', label: 'Korisnici', icon: ''},
        {id: 'orders', label: 'Porudžbine', icon: ''},
        {id: 'my_orders', label: 'Moje porudžbine', icon: ''},
    ];

    // Close mobile menu when section changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [activeSection]);

    // Close mobile menu on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && !event.target.closest('.sidebar') && !event.target.closest('.mobile-menu-toggle')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileMenuOpen]);

    const handleEditProfile = () => {
        setIsProfileModalOpen(true);
    };

    const handleProfileSubmit = async (data) => {
        try {
            if (data.type === 'info') {
                const updatedUser = await updateMyProfile({
                    name: data.name,
                    surname: data.surname,
                    username: data.username,
                    email: data.email,
                });
                updateUser(updatedUser);
                toast.success('Profil uspješno ažuriran');
            } else if (data.type === 'password') {
                await changePassword({
                    current_password: data.old_password,
                    new_password: data.new_password,
                    confirm_new_password: data.confirm_new_password,
                });
                toast.success('Lozinka uspješno promijenjena');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    // Filter menu items based on user role
    const filteredMenuItems = user?.role === 'admin'
        ? menuItems.filter(item => item.id !== 'my_orders') // Admin sees all except "my_orders"
        : user?.role === 'waiter'
            ? menuItems.filter(item => item.id === 'orders' || item.id === 'my_orders') // Waiter sees both orders sections
            : [];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Mobile Menu Toggle Button */}
            <button
                className="mobile-menu-toggle"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}

            <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <span>Admin Panel</span>
                    </div>
                </div>

                <div className="user-info">
                    <div className="avatar">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="user-details">
                        <span className="user-name">{user?.name} {user?.surname}</span>
                        <span className="user-role">{user?.role}</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {filteredMenuItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(item.id)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <button
                    className={`nav-item ${activeSection === 'edit_profile' ? 'active' : ''}`}
                    onClick={handleEditProfile}
                    title='Izmijeni profil'
                >
                    <span className="nav-icon"></span>
                    <span className="nav-label">Uredi profil</span>
                </button>
                <div className="sidebar-footer">
                    <button
                        className="logout-btn"
                        onClick={logout}
                        title='Odjavi se'
                    >
                        <span className="logout-icon"></span>
                        <span>Odjavi se</span>
                    </button>
                </div>

                <UniversalModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    onSubmit={handleProfileSubmit}
                    actionType="update"
                    entityType="profile"
                    initialData={user}
                />
            </div>
        </>
    );
};

export default Sidebar;