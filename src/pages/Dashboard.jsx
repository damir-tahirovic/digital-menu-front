import {useAuth} from '../context/AuthContext';
import {useEffect, useState} from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import MainCategoryCard from '../components/mainCategory/MainCategoryCard.jsx';
import CategoryCard from '../components/category/CategoryCard.jsx';
import ItemCard from '../components/item/ItemCard.jsx';
import OrderCard from '../components/order/OrderCard.jsx';
import UniversalModal from '../components/modal/UniversalModal.jsx';
import {mainCategoryList, mainCategoryCreate, mainCategoryUpdate} from '../api/services/app/MainCategoryServices.js';
import {categoryCreate, categoryList, categoryUpdate} from '../api/services/app/CategoryServices.js';
import {
    orderPlaceList,
    orderPlaceCreate,
    orderPlaceUpdate,
    orderPlaceDelete
} from '../api/services/app/OrderPlaceServices.js';
import {userList, userUpdate} from '../api/services/app/UserServices.js';
import {orderList, myOrders as myOrdersList} from '../api/services/app/OrderServices.js';
import {registerUser} from "../api/services/auth/AuthServices.js";
import toast, {Toaster} from 'react-hot-toast';
import '../styles/Dashboard.css';
import '../styles/MainCategory.css';
import {itemCreate, itemUpdate} from "../api/services/app/ItemServices.js";
import OrderPlaceCard from "../components/orderPlace/OrderPlaceCard.jsx";
import UserCard from "../components/user/UserCard.jsx";

const Dashboard = ({setNavbarTitle}) => {
    const {user} = useAuth();
    const [activeSection, setActiveSection] = useState('main_categories');
    const [mainCategories, setMainCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orderPlaces, setOrderPlaces] = useState([])
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [modalState, setModalState] = useState({
        isOpen: false,
        actionType: null, // 'create', 'update', 'delete'
        entityType: null, // 'main_category', 'category', 'item', 'order_place', 'user', 'order'
        initialData: null
    });

    useEffect(() => {
        if (user?.role === 'waiter') {
            setActiveSection('orders');
        } else {
            setActiveSection('main_categories');
        }
    }, [user]);

    const openModal = (actionType, entityType, initialData = null) => {
        setModalState({
            isOpen: true,
            actionType,
            entityType,
            initialData
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            actionType: null,
            entityType: null,
            initialData: null
        });
    };

    const handleAddMainCategory = () => {
        openModal('create', 'main_category');
    };

    const handleAddCategory = () => {
        openModal('create', 'category');
    };

    const handleAddItem = () => {
        openModal('create', 'item');
    };

    const handleAddOrderPlace = () => {
        openModal('create', 'order_place');
    }

    const handleAddUser = () => {
        openModal('create', 'user');
    };

    const handleEditMainCategory = (mainCategory) => {
        openModal('update', 'main_category', mainCategory);
    };

    const handleEditCategory = (category) => {
        openModal('update', 'category', category);
    };

    const handleEditItem = (item) => {
        openModal('update', 'item', item);
    };

    const handleEditOrderPlace = (orderPlace) => {
        openModal('update', 'order_place', orderPlace);
    };

    const handleEditUser = (user) => {
        openModal('update', 'user', user);
    };

    const handleModalSubmit = async (formData, imageFile) => {
        const {actionType, entityType} = modalState;

        try {
            switch (actionType) {
                case 'create':
                    if (entityType === 'main_category') {
                        await mainCategoryCreate(formData, imageFile);
                        toast.success('Glavna kategorija je uspješno kreirana!');
                        console.log('Creating main category:', formData);
                        fetchMainCategories();
                    } else if (entityType === 'category') {
                        await categoryCreate(formData, imageFile);
                        toast.success('Kategorija je uspješno kreirana!');
                        console.log('Creating category:', formData);
                        fetchMainCategories();
                    } else if (entityType === 'item') {
                        await itemCreate(formData, imageFile);
                        toast.success('Artikal je uspješno kreirana!');
                        console.log('Creating item:', formData);
                        fetchCategories();
                    } else if (entityType === 'order_place') {
                        await orderPlaceCreate(formData);
                        toast.success('Mjesto je uspješno kreirano!');
                        console.log('Creating order place:', formData);
                        fetchOrderPlaces();
                    } else if (entityType === 'user') {
                        await registerUser(formData);
                        toast.success('Korisnik je uspješno kreiran!');
                        console.log('Creating user:', formData);
                        fetchUsers();
                    }
                    break;

                case 'update':
                    if (entityType === 'main_category') {
                        await mainCategoryUpdate(modalState.initialData.id, formData, imageFile);
                        toast.success('Glavna kategorija je uspješno azurirana!');
                        console.log('Updating main category:', formData);
                        fetchMainCategories();
                    } else if (entityType === 'category') {
                        await categoryUpdate(modalState.initialData.id, formData, imageFile);
                        toast.success('Kategorija je uspješno azurirana!');
                        console.log('Updating category:', formData);
                        fetchMainCategories();
                    } else if (entityType === 'item') {
                        await itemUpdate(modalState.initialData.id, formData, imageFile);
                        toast.success('Artikal je uspješno azurirana!');
                        console.log('Updating item:', formData);
                        fetchCategories();
                    } else if (entityType === 'order_place') {
                        await orderPlaceUpdate(modalState.initialData.id, formData);
                        toast.success('Mjesto je uspješno azurirano!');
                        console.log('Updating order place:', formData);
                        fetchOrderPlaces();
                    } else if (entityType === 'user') {
                        await userUpdate(modalState.initialData.id, formData);
                        toast.success('Korisnik je uspješno azuriran!');
                        console.log('Updating user:', formData);
                        fetchUsers();
                    }
                    break;

                case 'delete':
                    if (entityType === 'main_category') {
                        console.log('Deleting main category:', modalState.initialData.id);
                        fetchMainCategories();
                    } else if (entityType === 'category') {
                        console.log('Deleting category:', modalState.initialData.id);
                        fetchMainCategories();
                    } else if (entityType === 'item') {
                        console.log('Deleting item:', modalState.initialData.id);
                        fetchCategories();
                    } else if (entityType === 'order_place') {
                        await orderPlaceDelete(modalState.initialData.id);
                        toast.success('Mjesto je uspješno obrisano!');
                        console.log('Deleting order place:', modalState.initialData.id);
                        fetchOrderPlaces();
                    }
                    break;
            }
        } catch (error) {
            console.error('Error in modal submit:', error);
            throw error;
        }
    };

    const fetchMainCategories = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await mainCategoryList();
            setMainCategories(data);
        } catch (err) {
            setError(err.message || 'Greška prilikom učitavanja glavnih kategorija');
            console.error('Error fetching main categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await categoryList();
            setCategories(data);
        } catch (err) {
            setError(err.message || 'Greška prilikom učitavanja kategorija');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderPlaces = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await orderPlaceList();
            setOrderPlaces(data);
        } catch (err) {
            setError(err.message || 'Greška prilikom učitavanja mjesta');
            console.error('Error fetching order places:', err);
        } finally {
            setLoading(false);
        }
    }

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await userList();
            setUsers(data);
        } catch (err) {
            setError(err.message || 'Greška prilikom učitavanja korisnika');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    }

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await orderList();
            setOrders(data);
        } catch (err) {
            setError(err.message || 'Greška prilikom učitavanja porudžbina');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    }

    const fetchMyOrders = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await myOrdersList();
            setMyOrders(data);
        } catch (err) {
            setError(err.message || 'Greška prilikom učitavanja porudžbina');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (activeSection === 'main_categories') {
            fetchMainCategories();
        } else if (activeSection === 'categories') {
            fetchMainCategories();
        } else if (activeSection === 'items') {
            fetchCategories();
        } else if (activeSection === 'order_places') {
            fetchOrderPlaces();
        } else if (activeSection === 'users') {
            fetchUsers();
        } else if (activeSection === 'orders') {
            fetchOrders();
        } else if (activeSection === 'my_orders') {
            fetchMyOrders();
        }
    }, [activeSection]);

    useEffect(() => {
        const handleOrderEvent = (e) => {
            console.log("📥 Primljen order event u Dashboard:", e.detail);
            fetchOrders();
        };

        window.addEventListener("order-received", handleOrderEvent);

        return () => {
            window.removeEventListener("order-received", handleOrderEvent);
        };
    }, []);

    const renderMainCategories = () => {
        const headerContent = (
            <div className="main-categories-header">
                <h2 style={{color: 'black'}}>Glavne kategorije</h2>
                <button className="btn-add-category" onClick={handleAddMainCategory}>
                    + Dodaj Glavnu kategoriju
                </button>
            </div>
        );

        if (loading) {
            return (
                <div>
                    {headerContent}
                    <div className="loading-message">Učitavanje glavnih kategorija...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div>
                    {headerContent}
                    <div className="error-message">
                        {error}
                        <button
                            onClick={fetchMainCategories}
                            style={{marginLeft: '10px', padding: '5px 10px'}}
                        >
                            Pokušaj ponovo
                        </button>
                    </div>
                </div>
            );
        }

        if (mainCategories.length === 0) {
            return (
                <div>
                    {headerContent}
                    <div className="no-categories-message">Nema dostupnih glavnih kategorija</div>
                </div>
            );
        }

        return (
            <div>
                {headerContent}
                <div className="main-categories-grid">
                    {mainCategories.map(mainCategory => (
                        <MainCategoryCard
                            key={mainCategory.id}
                            mainCategory={mainCategory}
                            onEdit={handleEditMainCategory}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const renderCategories = () => {
        const headerContent = (
            <div className="main-categories-header">
                <h2 style={{color: 'black'}}>Kategorije</h2>
                <button className="btn-add-category" onClick={handleAddCategory}>
                    + Dodaj Kategoriju
                </button>
            </div>
        );

        if (loading) {
            return (
                <div>
                    {headerContent}
                    <div className="loading-message">Učitavanje kategorija...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div>
                    {headerContent}
                    <div className="error-message">
                        {error}
                        <button
                            onClick={fetchMainCategories}
                            style={{marginLeft: '10px', padding: '5px 10px'}}
                        >
                            Pokušaj ponovo
                        </button>
                    </div>
                </div>
            );
        }

        if (mainCategories.length === 0) {
            return (
                <div>
                    {headerContent}
                    <div className="no-categories-message">Nema dostupnih kategorija</div>
                </div>
            );
        }

        const mainCategoriesWithCategories = mainCategories.filter(
            mainCategory => mainCategory.categories && mainCategory.categories.length > 0
        );

        if (mainCategoriesWithCategories.length === 0) {
            return (
                <div>
                    {headerContent}
                    <div className="no-categories-message">Nema dostupnih kategorija</div>
                </div>
            );
        }

        return (
            <div>
                {headerContent}
                {mainCategoriesWithCategories.map(mainCategory => (
                    <div key={mainCategory.id} className="category-section">
                        <div className="category-section-header">
                            <h3 className="category-section-title">
                                {mainCategory.name}
                                <span className="count-badge">{mainCategory.categories.length}</span>
                            </h3>
                        </div>
                        <div className="main-categories-grid">
                            {mainCategory.categories.map(category => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    mainCategoryName={mainCategory.name}
                                    onEdit={handleEditCategory}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderItems = () => {
        const headerContent = (
            <div className="main-categories-header">
                <h2 style={{color: 'black'}}>Artikli</h2>
                <button className="btn-add-category" onClick={handleAddItem}>
                    + Dodaj Artikal
                </button>
            </div>
        );

        if (loading) {
            return (
                <div>
                    {headerContent}
                    <div className="loading-message">Učitavanje Artikala...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div>
                    {headerContent}
                    <div className="error-message">
                        {error}
                        <button
                            onClick={fetchCategories}
                            style={{marginLeft: '10px', padding: '5px 10px'}}
                        >
                            Pokušaj ponovo
                        </button>
                    </div>
                </div>
            );
        }

        if (categories.length === 0) {
            return (
                <div>
                    {headerContent}
                    <div className="no-categories-message">Nema dostupnih artikala</div>
                </div>
            );
        }

        const categoriesWithItems = categories.filter(
            category => category.items && category.items.length > 0
        );

        if (categoriesWithItems.length === 0) {
            return (
                <div>
                    {headerContent}
                    <div className="no-categories-message">Nema dostupnih artikala</div>
                </div>
            );
        }

        return (
            <div>
                {headerContent}
                {categoriesWithItems.map(category => (
                    <div key={category.id} className="category-section">
                        <div className="category-section-header">
                            <h3 className="category-section-title">
                                {category.name}
                                <span className="count-badge">{category.items.length}</span>
                            </h3>
                        </div>
                        <div className="main-categories-grid">
                            {category.items.map(item => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    categoryName={category.name}
                                    onEdit={handleEditItem}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderOrderPlaces = () => {
        const headerContent = (
            <div className="main-categories-header">
                <h2 style={{color: 'black'}}>Mjesta</h2>
                <button className="btn-add-category" onClick={handleAddOrderPlace}>
                    + Dodaj Mjesto
                </button>
            </div>
        );

        if (loading) {
            return (
                <div>
                    {headerContent}
                    <div className="loading-message">Učitavanje mjesta...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div>
                    {headerContent}
                    <div className="error-message">
                        {error}
                        <button
                            onClick={fetchOrderPlaces}
                            style={{marginLeft: '10px', padding: '5px 10px'}}
                        >
                            Pokušaj ponovo
                        </button>
                    </div>
                </div>
            );
        }

        if (orderPlaces.length === 0) {
            return (
                <div>
                    {headerContent}
                    <div className="no-categories-message">Nema dostupnih mjesta</div>
                </div>
            );
        }

        return (
            <div>
                {headerContent}
                <div className="main-categories-grid">
                    {orderPlaces.map(orderPlace => (
                        <OrderPlaceCard
                            key={orderPlace.id}
                            orderPlace={orderPlace}
                            onEdit={handleEditOrderPlace}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const renderUsers = () => {
        const headerContent = (
            <div className="main-categories-header">
                <h2 style={{color: 'black'}}>Korisnici</h2>
                <button className="btn-add-category" onClick={handleAddUser}>
                    + Dodaj Korisnika
                </button>
            </div>
        );

        if (loading) {
            return (
                <div>
                    {headerContent}
                    <div className="loading-message">Učitavanje korisnika...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div>
                    {headerContent}
                    <div className="error-message">
                        {error}
                        <button
                            onClick={fetchUsers}
                            style={{marginLeft: '10px', padding: '5px 10px'}}
                        >
                            Pokušaj ponovo
                        </button>
                    </div>
                </div>
            );
        }

        if (users.length === 0) {
            return (
                <div>
                    {headerContent}
                    <div className="no-categories-message">Nema dostupnih korisnika</div>
                </div>
            );
        }

        return (
            <div>
                {headerContent}
                <div className="main-categories-grid">
                    {users.map(user => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onEdit={handleEditUser}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const renderOrders = () => {
        if (loading) {
            return <div className="loading-message">Učitavanje porudžbina...</div>;
        }

        if (error) {
            return (
                <div className="error-message">
                    {error}
                    <button
                        onClick={fetchOrders}
                        style={{marginLeft: '10px', padding: '5px 10px'}}
                    >
                        Pokušaj ponovo
                    </button>
                </div>
            );
        }

        if (orders.length === 0) {
            return <div className="no-categories-message">Nema dostupnih porudžbina</div>;
        }

        return (
            <div>
                <div className="main-categories-header">
                    <h2 style={{color: 'black'}}>Porudžbine</h2>
                </div>
                <div className="main-categories-grid">
                    {orders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onTakeOrder={handleTakeOrder}
                        />
                    ))}
                </div>
            </div>
        );
    }

    const renderMyOrders = () => {
        if (loading) {
            return <div className="loading-message">Učitavanje mojih porudžbina...</div>;
        }

        if (error) {
            return (
                <div className="error-message">
                    {error}
                    <button
                        onClick={fetchMyOrders}
                        style={{marginLeft: '10px', padding: '5px 10px'}}
                    >
                        Pokušaj ponovo
                    </button>
                </div>
            );
        }

        if (orders.length === 0) {
            return <div className="no-categories-message">Nema dostupnih porudžbina</div>;
        }

        return (
            <div>
                <div className="main-categories-header">
                    <h2 style={{color: 'black'}}>Porudžbine</h2>
                </div>
                <div className="main-categories-grid">
                    {myOrders.map(myOrder => (
                        <OrderCard
                            key={myOrder.id}
                            order={myOrder}
                            onTakeOrder={handleTakeOrder}
                        />
                    ))}
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeSection) {
            case 'main_categories':
                return (
                    <div className="section-content">
                        {renderMainCategories()}
                    </div>
                );
            case 'categories':
                return (
                    <div className="section-content">
                        {renderCategories()}
                    </div>
                );
            case 'items':
                return (
                    <div className="section-content">
                        {renderItems()}
                    </div>
                );
            case 'orders':
                return (
                    <div className="section-content">
                        {renderOrders()}
                    </div>
                );
            case 'order_places':
                return (
                    <div className="section-content">
                        {renderOrderPlaces()}
                    </div>
                );
            case 'users':
                return (
                    <div className="section-content">
                        {renderUsers()}
                    </div>
                );
            case 'my_orders':
                return (
                    <div className="section-content">
                        {renderMyOrders()}
                    </div>
                );
            default:
                return <div>Sekcija nije pronađena</div>;
        }
    };

    const handleTakeOrder = (orderId) => {
        if (activeSection !== 'my_orders') {
            setActiveSection('my_orders');
        } else {
            fetchMyOrders();
        }
        fetchOrders();
    };

    return (
        <div className="dashboard-layout">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection}/>
            <div className="dashboard-content">
                {renderContent()}
            </div>

            <UniversalModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
                actionType={modalState.actionType}
                entityType={modalState.entityType}
                initialData={modalState.initialData}
                mainCategories={mainCategories || []}
                categories={mainCategories.flatMap(mainCategory => mainCategory.categories || [])}
                users={users || []}
            />

            <Toaster/>
        </div>
    );
};

export default Dashboard;