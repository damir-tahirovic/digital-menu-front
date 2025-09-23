import React from 'react';
import '../../styles/MainCategory.css';
import {useNavigate} from "react-router-dom";
import defaultImage from "../../assets/default.avif";

const Item = ({item}) => {
    const navigate = useNavigate();

    const handeClick = () => {
        navigate(`/item/${item.id}`);
    }

    const backgroundStyle = {
        backgroundImage: item.media && item.media.length > 0
            ? `linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.7)), url(${item.media[0].original_url})`
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
                        {item.name}
                    </p>
                </div>
            </div>
        </>
    )
}

export default Item;