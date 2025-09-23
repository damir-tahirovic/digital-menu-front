import React from 'react';
import '../../styles/MainCategory.css';
import {useNavigate} from "react-router-dom";
import defaultImage from '../../assets/default.avif';

const Category = ({category}) => {
    const navigate = useNavigate();

    const handeClick = () => {
        navigate(`/category/${category.id}`);
    }

    const backgroundStyle = {
        backgroundImage: category.media && category.media.length > 0
            ? `linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.7)), url(${category.media[0].original_url})`
            : `linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.7)), url(${defaultImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <>
            <div className='main-category' onClick={handeClick} style={backgroundStyle}>
                <div className='title-div'>
                    <p>
                        {category.name}
                    </p>
                </div>
            </div>
        </>
    )
}

export default Category;