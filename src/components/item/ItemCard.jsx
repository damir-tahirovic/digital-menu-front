// src/components/item/ItemCard.jsx
import '../../styles/MainCategoryCard.css';

const ItemCard = ({ item, categoryName, onEdit }) => {
    const getImageUrl = () => {
        if (item.media && item.media.length > 0) {
            return item.media[0].original_url;
        }
        // Default slika ako nema uploadovane slike
        return 'src/assets/default.avif';
    };

    const handleItemClick = () => {
        // Pozivamo onEdit funkciju iz parent komponente
        if (onEdit) {
            onEdit(item);
        }
    };

    // Funkcija za formatiranje cene
    const formatPrice = (price) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(price);
    };

    // Prikazuje cene iz item_types
    const renderPrices = () => {
        if (!item.item_types || item.item_types.length === 0) {
            return (
                <div className="price-single">
                    <span className="price">N/A</span>
                </div>
            );
        }

        if (item.item_types.length === 1) {
            const itemType = item.item_types[0];
            return (
                <div className="price-single">
                    <span className="price">{formatPrice(itemType.price)}</span>
                    {/*<span className="quantity">({itemType.quantity}{itemType.unit})</span>*/}
                </div>
            );
        }

        // Ako ima više tipova, prikaži range cena
        const prices = item.item_types.map(type => type.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return (
            <div className="price-range">
                <span className="price">
                    {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                </span>
                {/*<span className="types-count">({item.item_types.length} opcija/e)</span>*/}
            </div>
        );
    };

    return (
        <div className="main-category-card item-card" onClick={handleItemClick}>
            <div className="category-image-container">
                <img
                    src={getImageUrl()}
                    alt={item.name}
                    className="category-image"
                    onError={(e) => {
                        e.target.src = '/images/default-category.png';
                    }}
                />
                {/* Badge za broj tipova ako ima više od jednog */}
                {item.item_types && item.item_types.length > 1 && (
                    <div className="types-badge">
                        {item.item_types.length} opcije
                    </div>
                )}
            </div>
            <div className="category-content item-content">
                <h3 className="category-name item-name">{item.name}</h3>

                {/* Opis itema ako postoji */}
                <p className="item-description">
                    {item.description ? item.description : 'N/A'}
                </p>

                {/* Prikaz cena */}
                <div className="item-pricing">
                    {renderPrices()}
                </div>

                {/* Lista tipova ako ima više od jednog */}
                <div className="item-types-preview">
                    {item.item_types && item.item_types.length > 0 ? (
                        <>
                            {item.item_types.slice(0, 2).map((type) => (
                                <div key={type.id} className="type-preview">
                                    <span className="type-name">{type.name}</span>
                                    <span className="quantity">({type.quantity} {type.unit})</span>
                                    <span className="type-price">{formatPrice(type.price)}</span>
                                </div>
                            ))}
                            {item.item_types.length > 2 && (
                                <div className="more-types">
                                    +{item.item_types.length - 2} još...
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="type-preview no-types">N/A</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemCard;