import React from 'react';
import '../../styles/Basket.css';
import { IoMdClose } from "react-icons/io";
import { useBasketContext } from "../../context/BasketContext.jsx";
import BasketItem from "./BasketItem.jsx";
import { createOrder } from "../../api/services/app/OrderServices.js";
import Cookies from 'js-cookie';

const Basket = ({ isOpen, onClose }) => {
    const { basket, removeFromBasket, clearBasket } = useBasketContext();

    const total = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        const orderPlaceCode = Cookies.get('order_place_code'); // Retrieve from cookies
        if (!orderPlaceCode) {
            alert('Kod mjesta narudžbe nije pronađen. Molimo skenirajte QR kod.');
            return;
        }

        const orderData = {
            order_place_code: orderPlaceCode,
            order_items: basket.map(item => ({
                itemTypeId: item.itemTypeId,
                quantity: item.quantity,
                price: item.price,
            })),
        };

        try {
            const order = await createOrder(orderData);
            console.log('Order created successfully:', order);
            clearBasket(); // Clear the basket after successful order
            alert('Narudžba je uspješno kreirana!');
        } catch (error) {
            alert('Greška prilikom kreiranja narudžbe: ' + (error.response?.data || error.message));
        }
    };

    return (
        <>
            {/* Overlay */}
            <div className={`basket-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>

            {/* Basket Sidebar */}
            <div className={`basket-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="basket-header">
                    <h3>Tvoja korpa</h3>
                    <button className="close-btn" onClick={onClose}>
                        <IoMdClose />
                    </button>
                </div>

                <div className="basket-content">
                    {basket.length === 0 ? (
                        <p>Korpa je prazna</p>
                    ) : (
                        <ul>
                            {basket.map((item) => (
                                <BasketItem
                                    key={item.itemTypeId}
                                    item={item}
                                    removeFromBasket={removeFromBasket}
                                />
                            ))}
                        </ul>
                    )}
                </div>

                <div className="basket-footer">
                    <p className="basket-total">Ukupno: {total.toFixed(2)}€</p>
                    <button className="checkout-btn" onClick={handleCheckout}>
                        Nastavi sa porudžbinom
                    </button>
                    <button className="clear-basket-btn" onClick={clearBasket}>
                        Isprazni korpu
                    </button>
                </div>
            </div>
        </>
    );
};

export default Basket;