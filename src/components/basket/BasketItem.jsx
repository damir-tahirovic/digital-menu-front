import React from "react";

const BasketItem = ({ item, removeFromBasket }) => {
    return (
        <li key={item.itemTypeId} className="basket-item">
            <img src={item.image} alt={item.name} />
            <div className="basket-item-details">
                {item.name} - {item.itemTypeName} <span>x {item.quantity}</span>
            </div>
            <span className="basket-item-price">
                {(item.price * item.quantity).toFixed(2)}€
            </span>
            <button onClick={() => removeFromBasket(item.itemTypeId)}>X</button>
        </li>
    );
};

export default BasketItem;