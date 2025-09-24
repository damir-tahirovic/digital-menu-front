import '../../styles/MainCategoryCard.css';

const MainCategoryCard = ({ mainCategory, onEdit }) => {
    const getImageUrl = () => {
        if (mainCategory.media && mainCategory.media.length > 0) {
            return mainCategory.media[0].original_url;
        }
        return 'src/assets/default.avif'
    };

    const handleCategoryClick = () => {
        if (onEdit) {
            onEdit(mainCategory);
        }
    };

    return (
        <div className="main-category-card" onClick={handleCategoryClick}>
            <div className="category-image-container">
                <img
                    src={getImageUrl()}
                    alt={mainCategory.name}
                    className="category-image"
                    onError={(e) => {
                        e.target.src = '/images/default-category.png';
                    }}
                />
            </div>
            <div className="category-content">
                <h3 className="category-name">{mainCategory.name}</h3>
            </div>
        </div>
    );
};

export default MainCategoryCard;