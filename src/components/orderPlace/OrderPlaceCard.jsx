import '../../styles/OrderPlaceCard.css';
import { FaLocationDot } from "react-icons/fa6";
import { BsQrCode } from "react-icons/bs";
import { axiosInstance, BASE_URL } from "../../api/api.config";
import toast from 'react-hot-toast';

const OrderPlaceCard = ({ orderPlace, onEdit }) => {

    const handleOrderPlaceClick = () => {
        if (onEdit) {
            onEdit(orderPlace);
        }
    };

    const handleQRCodeClick = async (e) => {
        e.stopPropagation();

        try {
            const response = await axiosInstance.get(`${BASE_URL}/qr-code/generate-pdf?order_place_id=${orderPlace.id}`);

            if (response.data.url) {
                window.open(response.data.url, '_blank');
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            toast.error('Greška prilikom generisanja QR koda');
        }
    };

    return (
        <div className="order-place-card" onClick={handleOrderPlaceClick}>
            <div className="order-place-image-container">
                <FaLocationDot className="location-icon" />
            </div>
            <div className="order-place-content">
                <div className="order-place-info">
                    <h3 className="order-place-name">{orderPlace.name}</h3>
                    <p className="order-place-code">{orderPlace.code}</p>
                </div>
                <button
                    className="qr-code-btn"
                    onClick={handleQRCodeClick}
                    title="Generiši QR kod"
                >
                    <BsQrCode />
                </button>
            </div>
        </div>
    );
};

export default OrderPlaceCard;