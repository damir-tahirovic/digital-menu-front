import React, { useState } from 'react';
import { FaReceipt, FaClock, FaCheckCircle, FaCog, FaTimes } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { takeOrder, completeOrder } from '../../api/services/app/OrderServices';
import toast from "react-hot-toast";
import '../../styles/OrderDetails.css';

const OrderDetails = ({ isOpen, onClose, order, userRole, onTakeOrder }) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen || !order) return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaClock className="od-status-icon-large pending" />;
            case 'completed':
                return <FaCheckCircle className="od-status-icon-large completed" />;
            case 'processing':
                return <FaCog className="od-status-icon-large processing" />;
            default:
                return <FaClock className="od-status-icon-large pending" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Na čekanju';
            case 'completed':
                return 'Završeno';
            case 'processing':
                return 'U obradi';
            default:
                return 'Na čekanju';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending':
                return 'od-status-pending-large';
            case 'completed':
                return 'od-status-completed-large';
            case 'processing':
                return 'od-status-processing-large';
            default:
                return 'od-status-pending-large';
        }
    };

    const totalItems = order.order_item_types?.reduce((sum, orderItem) => sum + orderItem.quantity, 0) || 0;
    const isAdmin = userRole === 'admin';

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleTakeOrder = async () => {
        if (isAdmin || isLoading) return;

        setIsLoading(true);
        try {
            await takeOrder(order.id);
            toast.success('Porudžbina je uspješno preuzeta!');

            if (onTakeOrder) {
                onTakeOrder(order.id);
            }

            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data ||
                'Greška pri preuzimanju porudžbine';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteOrder = async () => {
        if (isAdmin || isLoading) return;

        setIsLoading(true);
        try {
            await completeOrder(order.id);
            toast.success('Porudžbina je označena kao završena!');

            if (onTakeOrder) {
                onTakeOrder(order.id);
            }

            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data ||
                'Greška pri završavanju porudžbine';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="od-order-details-overlay" onClick={handleOverlayClick}>
            <div className="od-order-details-modal">
                <div className="od-order-modal-header">
                    <div className="od-modal-title-section">
                        <FaReceipt className="od-modal-receipt-icon" />
                        <h2 className="od-order-modal-title">Porudžbina #{order.id}</h2>
                        <div className={`od-order-status-large ${getStatusClass(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="od-status-text-large">{getStatusText(order.status)}</span>
                        </div>
                    </div>
                    <button className="od-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="od-modal-content">
                    <div className="od-order-info-section">
                        <div className="od-info-card">
                            <h3 className="od-section-title">
                                <MdLocationOn className="od-section-icon" />
                                Mjesto
                            </h3>
                            <div className="od-place-info">
                                <div className="od-place-name">{order.order_place?.name || 'Nepoznato mjesto'}</div>
                                <div className="od-place-code">Kod: {order.order_place?.code}</div>
                            </div>
                        </div>

                        <div className="od-info-card">
                            <div className="od-summary-info">
                                <button
                                    className="od-take-order-btn"
                                    onClick={order.status === 'processing' ? handleCompleteOrder : handleTakeOrder}
                                    disabled={isAdmin || isLoading || order.status === 'completed'}
                                >
                                    {isLoading
                                        ? order.status === 'processing'
                                            ? 'Završavanje...'
                                            : 'Preuzimanje...'
                                        : order.status === 'completed'
                                            ? 'Završeno'
                                            : order.status === 'processing'
                                                ? 'Označi kao završeno'
                                                : 'Preuzmi porudžbinu'
                                    }
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="od-items-section">
                        <h3 className="od-section-title">Artikli porudžbine</h3>
                        <div className="od-items-list-detailed">
                            {order.order_item_types?.map((orderItem, index) => (
                                <div key={orderItem.id} className="od-item-row">
                                    <div className="od-item-number">{index + 1}.</div>
                                    <div className="od-item-details">
                                        <div className="od-item-name">{orderItem.item_type?.name}</div>
                                        <div className="od-item-specs">
                                            {orderItem.item_type?.quantity}
                                            {orderItem.item_type?.unit} • €{orderItem.item_type?.price} po komadu
                                        </div>
                                    </div>
                                    <div className="od-item-quantity">
                                        <span className="od-quantity-label">x{orderItem.quantity}</span>
                                    </div>
                                    <div className="od-item-total">
                                        €{(orderItem.item_type?.price * orderItem.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="od-total-section">
                        <div className="od-total-row">
                            <span className="od-total-label-final">UKUPNO ZA PLAĆANJE:</span>
                            <span className="od-total-price-final">€{order.total_price}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;