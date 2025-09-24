import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { itemShow } from "../api/services/app/ItemServices.js";
import defaultImage from "../assets/default.avif";
import "../styles/ItemPage.css";
import { TbBasketPlus } from "react-icons/tb";
import ItemTypeOption from "../components/itemType/ItemType.jsx";
import { useBasketContext } from "../context/BasketContext.jsx";

const ItemPage = ({ setNavbarTitle }) => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedItemType, setSelectedItemType] = useState(0);
    const [flyStyle, setFlyStyle] = useState(null);

    const buttonRef = useRef(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const data = await itemShow(id);
                setItem(data);
                setNavbarTitle(data.name);
            } catch (error) {
                console.error("Error fetching item:", error);
            }
        };
        fetchItem();
    }, [id, setNavbarTitle]);

    const { addToBasket } = useBasketContext();

    const handleQuantityChange = (change) => {
        setQuantity((prev) => Math.max(1, prev + change));
    };

    const handleAddToBasket = () => {
        const currentItemType = item.item_types[selectedItemType];
        addToBasket({
            itemTypeId: currentItemType.id,
            itemTypeName: currentItemType.name,
            price: currentItemType.price,
            unit: currentItemType.unit,
            quantity: quantity,
            image: item?.media?.[0]?.original_url || defaultImage,
        });
        setQuantity(1);

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setFlyStyle({
                left: rect.left + rect.width / 2,
                top: rect.top,
            });

            setTimeout(() => setFlyStyle(null), 800);
        }
    };

    const getCurrentPrice = () => {
        return (
            (item?.item_types?.[selectedItemType]?.price * quantity || 0).toFixed(2)
        );
    };

    return (
        <div className="item-container">
            <div className="title-image">
                <img
                    src={
                        item?.media && item.media.length > 0
                            ? item.media[0].original_url
                            : defaultImage
                    }
                    alt={item?.name || "Item image"}
                />
            </div>
            {item ? (
                <div>
                    {item.description && item.description !== null && (
                        <div className="item-types-section">
                            <h3>Opis:</h3>
                            <div className="item-description">
                                {item.description}
                            </div>
                        </div>
                    )}
                    {item.item_types && item.item_types.length > 1 && (
                        <div className="item-types-section">
                            <h3>Opcije:</h3>
                            <div className="item-types-grid">
                                {item.item_types.map((itemType, index) => (
                                    <ItemTypeOption
                                        key={itemType.id}
                                        itemType={itemType}
                                        index={index}
                                        isSelected={selectedItemType === index}
                                        onSelect={setSelectedItemType}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="purchase-section">
                        <div className="quantity-counter">
                            <button
                                className="quantity-btn"
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span className="quantity-display">{quantity}</span>
                            <button
                                className="quantity-btn"
                                onClick={() => handleQuantityChange(1)}
                            >
                                +
                            </button>
                        </div>

                        <div className="price-section">
                            <span className="price">{getCurrentPrice()}€</span>
                            <button
                                ref={buttonRef}
                                className="add-to-basket-btn"
                                onClick={handleAddToBasket}
                            >
                                <TbBasketPlus style={{ fontSize: 24 }} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}

            {flyStyle && (
                <div
                    className="flying-indicator"
                    style={{
                        left: flyStyle.left,
                        top: flyStyle.top,
                    }}
                >
                    ✔
                </div>
            )}
        </div>
    );
};

export default ItemPage;
