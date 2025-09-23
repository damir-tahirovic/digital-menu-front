import {useEffect, useState} from "react";
import {mainCategoryList} from "../api/services/app/MainCategoryServices.js";
import MainCategory from "../components/mainCategory/MainCategory.jsx";
import '../styles/HomePage.css';

const HomePage = ({setNavbarTitle}) => {

    const [mainCategories, setmainCategories] = useState([]);

    useEffect(() => {
        const fetchMainCategories = async () => {
            try {
                const data = await mainCategoryList();
                setmainCategories(data);
                setNavbarTitle("Home");
                console.log(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchMainCategories();
    }, []);

    return (
        <div className="main-category-container">
            {mainCategories?.map(mainCategory => (
                <MainCategory key={mainCategory.id} mainCategory={mainCategory}/>
            ))}
        </div>
    )

}

export default HomePage;

