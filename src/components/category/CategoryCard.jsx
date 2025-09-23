// src/components/category/CategoryCard.jsx
import '../../styles/MainCategoryCard.css';

const CategoryCard = ({ category, mainCategoryName, onEdit }) => {
    const getImageUrl = () => {
        if (category.media && category.media.length > 0) {
            return category.media[0].original_url;
        }
        // Default slika ako nema uploadovane slike
        return 'src/assets/default.avif';
    };

    const handleCategoryClick = () => {
        // Pozivamo onEdit funkciju iz parent komponente
        if (onEdit) {
            onEdit(category);
        }
    };

    return (
        <div className="main-category-card" onClick={handleCategoryClick}>
            <div className="category-image-container">
                <img
                    src={getImageUrl()}
                    alt={category.name}
                    className="category-image"
                    onError={(e) => {
                        e.target.src = '/images/default-category.png';
                    }}
                />
            </div>
            <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
            </div>
        </div>
    );
};

export default CategoryCard;