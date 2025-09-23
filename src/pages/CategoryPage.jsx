import {useParams} from "react-router-dom";
import '../styles/HomePage.css';
import React, {useEffect} from "react";
import {categoryShow} from "../api/services/app/CategoryServices.js";
import MainCategory from "../components/mainCategory/MainCategory.jsx";
import Item from "../components/item/Item.jsx";

const CategoryPage = ({setNavbarTitle}) => {

    const {id} = useParams();
    const [items, setItems] = React.useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await categoryShow(id);
                setItems(data.items);
                setNavbarTitle(data.name);
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        }
        fetchCategory();
    }, [id, setNavbarTitle]);

    return (
        <div className="main-category-container">
            {items?.map(item => (
                <Item key={item.id} item={item}/>
            ))}
        </div>
    )

}

export default CategoryPage;