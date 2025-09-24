import '../../styles/OrderPlaceCard.css';
import { FaUser } from "react-icons/fa6";
import { BsPersonCircle } from "react-icons/bs";

const UserCard = ({ user, onEdit }) => {

    const handleUserClick = () => {
        if (onEdit) {
            onEdit(user);
        }
    };

    const handleProfileClick = (e) => {
        e.stopPropagation();
        console.log('Profile clicked for user:', user.username);
    };

    return (
        <div className="order-place-card" onClick={handleUserClick}>
            <div className="order-place-image-container">
                <FaUser className="location-icon" />
            </div>
            <div className="order-place-content">
                <div className="order-place-info">
                    <h3 className="order-place-name">{user.name} {user.surname}</h3>
                    <p className="order-place-code">@{user.username}</p>
                </div>
                <div className="role-div">
                    {user.role === 'admin' ? 'Admin' : 'Konobar'}
                </div>
            </div>
        </div>
    );
};

export default UserCard;