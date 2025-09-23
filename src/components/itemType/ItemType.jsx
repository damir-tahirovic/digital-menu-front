import React from 'react';

const ItemTypeOption = ({ itemType, index, isSelected, onSelect }) => {
    return (
        <div
            className={`item-type-option ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(index)}
        >
            <div className="item-type-name">{itemType.name}</div>
            <div className="item-type-details">
                {itemType.quantity}{itemType.unit} - {(itemType.price).toFixed(2)}€
            </div>
        </div>
    );
};

export default ItemTypeOption;