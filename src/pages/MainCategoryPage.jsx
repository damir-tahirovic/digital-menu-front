import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {mainCategoryShow} from "../api/services/app/MainCategoryServices.js";
import '../styles/HomePage.css';
import MainCategory from "../components/mainCategory/MainCategory.jsx";
import Category from "../components/category/Category.jsx";

const MainCategoryPage = ({setNavbarTitle}) => {

    const {id} = useParams();
    const [categories, setCategories] = React.useState(null);

    useEffect(() => {
        const fetchMainCategory = async () => {
            try {
                const data = await mainCategoryShow(id);
                setCategories(data.categories);
                setNavbarTitle(data.name);
            } catch (error) {
                console.error("Error fetching main category:", error);
            }
        }
        fetchMainCategory();
    }, [id, setNavbarTitle]);

    if (!categories) return <div>Loading...</div>;

    return (
        <div className="main-category-container">
            {categories?.map((category) => (
                <Category key={category.id} category={category}/>
            ))}
        </div>
    )
}

export default MainCategoryPage;