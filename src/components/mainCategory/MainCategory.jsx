import React from 'react';
import '../../styles/MainCategory.css';
import {useNavigate} from "react-router-dom";
import defaultImage from '../../assets/default.avif';


const MainCategory = ({mainCategory}) => {
    const navigate = useNavigate();

    const handeClick = () => {
        navigate(`/main-category/${mainCategory.id}`);
    }

    const backgroundStyle = {
        backgroundImage: mainCategory.media && mainCategory.media.length > 0
            ? `linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.7)), url(${mainCategory.media[0].original_url})`
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
                        {mainCategory.name}
                    </p>
                </div>
            </div>
        </>
    )
}

export default MainCategory;