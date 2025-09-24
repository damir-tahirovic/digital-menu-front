import React, { useState } from 'react';
import '../../styles/OrderCard.css';
import { FaReceipt, FaClock, FaCheckCircle, FaCog } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import OrderDetails from './OrderDetails';
import cookies from 'js-cookie';

const OrderCard = ({ order, onTakeOrder}) => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleOrderClick = () => {
        setIsDetailsModalOpen(true);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaClock className="status-icon pending" />;
            case 'completed':
                return <FaCheckCircle className="status-icon completed" />;
            case 'processing':
                return <FaCog className="status-icon processing" />;
            default:
                return <FaClock className="status-icon pending" />;
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
                return 'status-pending';
            case 'completed':
                return 'status-completed';
            case 'processing':
                return 'status-processing';
            default:
                return 'status-pending';
        }
    };

    const totalItems = order.order_item_types?.reduce((sum, orderItem) => sum + orderItem.quantity, 0) || 0;

    return (
        <>
            <div className="order-card" onClick={handleOrderClick}>
                <div className="order-image-container">
                    <FaReceipt className="order-icon" />
                    <div className="order-id-badge">#{order.id}</div>
                </div>
                <div className="order-content">
                    <div className="order-header">
                        <div className="order-place-info">
                            <div className="order-place-name">
                                <MdLocationOn className="location-small-icon" />
                                {order.order_place?.name || 'Nepoznato mjesto'}
                            </div>
                            <div className="order-place-code">{order.order_place?.code}</div>
                        </div>
                        <div className={`order-status ${getStatusClass(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="status-text">{getStatusText(order.status)}</span>
                        </div>
                    </div>

                    <div className="order-details">
                        <div className="order-items-summary">
                            <span className="items-count">{totalItems} artikala</span>
                            <div className="items-list">
                                {order.order_item_types?.slice(0, 2).map((orderItem, index) => (
                                    <span key={orderItem.id} className="item-preview">
                                        {orderItem.item_type?.name}
                                        {index < Math.min(order.order_item_types.length, 2) - 1 && ', '}
                                    </span>
                                ))}
                                {order.order_item_types?.length > 2 && (
                                    <span className="more-items">+{order.order_item_types.length - 2} više</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="order-footer">
                        <div className="order-total">
                            <span className="total-label">Ukupno:</span>
                            <span className="total-price">€{order.total_price}</span>
                        </div>
                    </div>
                </div>
            </div>

            <OrderDetails
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                order={order}
                userRole={cookies.get("role") ?? null}
                onTakeOrder={onTakeOrder}
            />
        </>
    );
};

export default OrderCard;