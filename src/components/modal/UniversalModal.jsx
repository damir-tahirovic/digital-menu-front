import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import '../../styles/UniversalModal.css';

const UniversalModal = ({
                            isOpen,
                            onClose,
                            onSubmit,
                            onDelete,
                            actionType,
                            entityType,
                            initialData = null,
                            mainCategories = [],
                            categories = [],
                            users = []
                        }) => {
    const [formData, setFormData] = useState({});
    const [itemTypes, setItemTypes] = useState([]);
    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setError('');

            if (entityType === 'profile') {
                setActiveTab('info');
            } else {
                setActiveTab('item');
            }

            if ((actionType === 'update' || entityType === 'profile') && initialData) {
                if (entityType === 'profile') {
                    setFormData({
                        name: initialData.name || '',
                        surname: initialData.surname || '',
                        username: initialData.username || '',
                        email: initialData.email || '',
                        old_password: '',
                        new_password: '',
                        confirm_new_password: ''
                    });
                } else {
                    setFormData(initialData);
                    if (entityType === 'item' && initialData.item_types) {
                        setItemTypes(initialData.item_types.map(type => ({
                            ...type,
                            isExisting: true
                        })));
                    } else {
                        setItemTypes([]);
                    }
                }
            } else {
                let defaultData = {};
                switch (entityType) {
                    case 'main_category':
                        defaultData = { name: '' };
                        break;
                    case 'category':
                        defaultData = { name: '', main_category_id: '' };
                        break;
                    case 'item':
                        defaultData = { name: '', description: '', category_id: '' };
                        break;
                    case 'order_place':
                        defaultData = { name: '' };
                        break;
                    case 'user':
                        defaultData = {
                            name: '',
                            surname: '',
                            username: '',
                            email: '',
                            password: '',
                            confirm_password: '',
                            role: 'waiter'
                        };
                        break;
                    default:
                        defaultData = {};
                }
                setFormData(defaultData);
                setItemTypes([]);
            }
        }
    }, [isOpen, actionType, initialData, entityType]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !loading) {
            onClose();
        }
    };

    const handleDelete = () => {
        if (!onDelete) return;

        if (window.confirm(`Da li ste sigurni da želite da obrišete "${initialData?.name}"?`)) {
            setLoading(true);
            onDelete(initialData)
                .then(() => {
                    onClose();
                })
                .catch((error) => {
                    console.error('Error deleting:', error);
                    setError(error.response?.data?.message || 'Greška prilikom brisanja');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            media: file
        }));
    };

    const handleRemoveCurrentImage = () => {
        setFormData(prev => ({
            ...prev,
            removeCurrentImage: true,
            remove_current_image: true
        }));
    };

    const handleRestoreImage = () => {
        setFormData(prev => {
            const newFormData = { ...prev };
            delete newFormData.removeCurrentImage;
            delete newFormData.remove_current_image;
            return newFormData;
        });
    };

    const handleAddItemType = () => {
        const newItemType = {
            id: Date.now(),
            name: '',
            price: '',
            quantity: '',
            unit: '',
            isNew: true
        };
        setItemTypes(prev => [...prev, newItemType]);
    };

    const handleItemTypeChange = (index, field, value) => {
        setItemTypes(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleRemoveItemType = (index) => {
        setItemTypes(prev => prev.filter((_, i) => i !== index));
    };

    const validateUserForm = () => {
        const errors = {};

        if (!formData.name || !formData.name.trim()) {
            errors.name = 'Ime je obavezno';
        }

        if (!formData.surname || !formData.surname.trim()) {
            errors.surname = 'Prezime je obavezno';
        }

        if (!formData.username || !formData.username.trim()) {
            errors.username = 'Korisničko ime je obavezno';
        }

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email format nije valjan';
        }

        if (actionType === 'create') {
            if (!formData.password) {
                errors.password = 'Lozinka je obavezna';
            }

            if (!formData.confirm_password) {
                errors.confirm_password = 'Potvrda lozinke je obavezna';
            } else if (formData.password !== formData.confirm_password) {
                errors.confirm_password = 'Lozinke se ne poklapaju';
            }

            if (!formData.role) {
                errors.role = 'Uloga je obavezna';
            }
        }

        return errors;
    };

    const validateProfileForm = () => {
        const errors = {};

        if (!formData.name || !formData.name.trim()) {
            errors.name = 'Ime je obavezno';
        }

        if (!formData.surname || !formData.surname.trim()) {
            errors.surname = 'Prezime je obavezno';
        }

        if (!formData.username || !formData.username.trim()) {
            errors.username = 'Korisničko ime je obavezno';
        }

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email format nije valjan';
        }

        if (activeTab === 'password') {
            if (!formData.old_password) {
                errors.old_password = 'Stara lozinka je obavezna';
            }

            if (!formData.new_password) {
                errors.new_password = 'Nova lozinka je obavezna';
            }

            if (!formData.confirm_new_password) {
                errors.confirm_new_password = 'Potvrda nove lozinke je obavezna';
            } else if (formData.new_password !== formData.confirm_new_password) {
                errors.confirm_new_password = 'Nove lozinke se ne poklapaju';
            }
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (entityType === 'profile') {
                const validationErrors = validateProfileForm();
                if (Object.keys(validationErrors).length > 0) {
                    setError(Object.values(validationErrors)[0]);
                    setLoading(false);
                    return;
                }

                let submitData = {};
                if (activeTab === 'info') {
                    submitData = {
                        name: formData.name,
                        surname: formData.surname,
                        username: formData.username,
                        email: formData.email || null,
                        type: 'info'
                    };
                } else if (activeTab === 'password') {
                    submitData = {
                        old_password: formData.old_password,
                        new_password: formData.new_password,
                        confirm_new_password: formData.confirm_new_password,
                        type: 'password'
                    };
                }
                await onSubmit(submitData);
            } else if (entityType === 'user') {
                const validationErrors = validateUserForm();
                if (Object.keys(validationErrors).length > 0) {
                    setError(Object.values(validationErrors)[0]);
                    setLoading(false);
                    return;
                }

                let submitData = {
                    name: formData.name,
                    surname: formData.surname,
                    username: formData.username,
                    email: formData.email || null
                };

                if (actionType === 'create') {
                    submitData.password = formData.password;
                    submitData.confirm_password = formData.confirm_password;
                    submitData.role = formData.role;
                }

                await onSubmit(submitData);
            } else if (entityType === 'main_category') {
                let submitData = { name: formData.name };
                if (formData.removeCurrentImage) {
                    submitData.remove_current_image = true;
                }
                await onSubmit(submitData, formData.media);
            } else if (entityType === 'category') {
                let submitData = {
                    name: formData.name,
                    main_category_id: formData.main_category_id
                };
                if (formData.removeCurrentImage) {
                    submitData.remove_current_image = true;
                }
                await onSubmit(submitData, formData.media);
            } else if (entityType === 'item') {
                let submitData = {
                    name: formData.name,
                    description: formData.description,
                    category_id: formData.category_id,
                    item_types: itemTypes.filter(type =>
                        type.name && type.name.trim() !== '' &&
                        type.price && type.price !== ''
                    ).map(type => {
                        const cleanType = {
                            name: type.name,
                            price: parseFloat(type.price),
                            quantity: type.quantity ? parseInt(type.quantity) : null,
                            unit: type.unit || null
                        };

                        if (type.isExisting && type.id) {
                            cleanType.id = type.id;
                        }

                        return cleanType;
                    })
                };
                if (formData.removeCurrentImage) {
                    submitData.remove_current_image = true;
                }
                await onSubmit(submitData, formData.media);
            } else if (entityType === 'order_place') {
                await onSubmit({ name: formData.name });
            } else {
                await onSubmit(formData);
            }

            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(error.response?.data?.message || 'Greška prilikom čuvanja');
        } finally {
            setLoading(false);
        }
    };

    const getModalTitle = () => {
        if (entityType === 'profile') {
            return 'Uredi profil';
        }

        const entityNames = {
            main_category: 'glavnu kategoriju',
            category: 'kategoriju',
            item: 'artikal',
            order_place: 'mjesto',
            user: 'korisnika'
        };

        const actionNames = {
            create: 'Dodaj',
            update: 'Uredi',
            delete: 'Obriši'
        };

        return `${actionNames[actionType]} ${entityNames[entityType]}`;
    };

    const renderTabs = () => {
        if (entityType === 'profile') {
            return (
                <div className="modal-tabs">
                    <button
                        type="button"
                        className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        Osnovne informacije
                    </button>
                    <button
                        type="button"
                        className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveTab('password')}
                    >
                        Promjena lozinke
                    </button>
                </div>
            );
        }

        if (entityType !== 'item' || actionType === 'delete') return null;

        return (
            <div className="modal-tabs">
                <button
                    type="button"
                    className={`tab-button ${activeTab === 'item' ? 'active' : ''}`}
                    onClick={() => setActiveTab('item')}
                >
                    Artikal
                </button>
                <button
                    type="button"
                    className={`tab-button ${activeTab === 'types' ? 'active' : ''}`}
                    onClick={() => setActiveTab('types')}
                >
                    Tipovi artikala
                </button>
            </div>
        );
    };

    const renderProfileFields = () => {
        if (activeTab === 'info') {
            return (
                <div className="form-fields">
                    <div className="form-group">
                        <label htmlFor="name">Ime *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            placeholder="Unesite ime..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="surname">Prezime *</label>
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            value={formData.surname || ''}
                            onChange={handleInputChange}
                            placeholder="Unesite prezime..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Korisničko ime *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username || ''}
                            onChange={handleInputChange}
                            placeholder="Unesite korisničko ime..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            placeholder="Unesite email..."
                        />
                    </div>
                </div>
            );
        }

        if (activeTab === 'password') {
            return (
                <div className="form-fields">
                    <div className="form-group">
                        <label htmlFor="old_password">Stara lozinka *</label>
                        <input
                            type="password"
                            id="old_password"
                            name="old_password"
                            value={formData.old_password || ''}
                            onChange={handleInputChange}
                            placeholder="Unesite staru lozinku..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="new_password">Nova lozinka *</label>
                        <input
                            type="password"
                            id="new_password"
                            name="new_password"
                            value={formData.new_password || ''}
                            onChange={handleInputChange}
                            placeholder="Unesite novu lozinku..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm_new_password">Potvrdi novu lozinku *</label>
                        <input
                            type="password"
                            id="confirm_new_password"
                            name="confirm_new_password"
                            value={formData.confirm_new_password || ''}
                            onChange={handleInputChange}
                            placeholder="Potvrdite novu lozinku..."
                            required
                        />
                        {formData.new_password && formData.confirm_new_password && formData.new_password !== formData.confirm_new_password && (
                            <div className="error-message">Nove lozinke se ne poklapaju</div>
                        )}
                    </div>
                </div>
            );
        }
    };

    const renderItemTypeFields = () => {
        return (
            <div className="item-types-container">
                <div className="item-types-header">
                    <h3>Tipovi artikla</h3>
                    <p>Dodajte različite veličine/tipove za ovaj artikal</p>
                </div>

                <div className="item-types-list">
                    {itemTypes.map((itemType, index) => (
                        <div key={itemType.id || index} className="item-type-row">
                            <div className="item-type-fields">
                                <div className="form-group">
                                    <label htmlFor={`item-type-name-${index}`}>Naziv *</label>
                                    <input
                                        type="text"
                                        id={`item-type-name-${index}`}
                                        value={itemType.name || ''}
                                        onChange={(e) => handleItemTypeChange(index, 'name', e.target.value)}
                                        placeholder="Naziv tipa (npr. Mala, Velika)"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`item-type-price-${index}`}>Cijena *</label>
                                    <input
                                        type="number"
                                        id={`item-type-price-${index}`}
                                        step="0.01"
                                        value={itemType.price || ''}
                                        onChange={(e) => handleItemTypeChange(index, 'price', e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`item-type-quantity-${index}`}>Količina</label>
                                    <input
                                        type="number"
                                        id={`item-type-quantity-${index}`}
                                        value={itemType.quantity || ''}
                                        onChange={(e) => handleItemTypeChange(index, 'quantity', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`item-type-unit-${index}`}>Jedinica</label>
                                    <input
                                        type="text"
                                        id={`item-type-unit-${index}`}
                                        value={itemType.unit || ''}
                                        onChange={(e) => handleItemTypeChange(index, 'unit', e.target.value)}
                                        placeholder="g, ml, kom..."
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn-remove-item-type"
                                onClick={() => handleRemoveItemType(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    className="btn-add-item-type"
                    onClick={handleAddItemType}
                >
                    + Dodaj tip
                </button>
            </div>
        );
    };

    const renderUserFields = () => {
        return (
            <div className="form-fields">
                <div className="form-group">
                    <label htmlFor="name">Ime *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        placeholder="Unesite ime..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="surname">Prezime *</label>
                    <input
                        type="text"
                        id="surname"
                        name="surname"
                        value={formData.surname || ''}
                        onChange={handleInputChange}
                        placeholder="Unesite prezime..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="username">Korisničko ime *</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username || ''}
                        onChange={handleInputChange}
                        placeholder="Unesite korisničko ime..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        placeholder="Unesite email..."
                    />
                </div>

                {actionType === 'create' && (
                    <>
                        <div className="form-group">
                            <label htmlFor="role">Uloga *</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role || ''}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Izaberite ulogu</option>
                                <option value="admin">Admin</option>
                                <option value="waiter">Konobar</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Lozinka *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password || ''}
                                onChange={handleInputChange}
                                placeholder="Unesite lozinku..."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password">Potvrdi lozinku *</label>
                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                value={formData.confirm_password || ''}
                                onChange={handleInputChange}
                                placeholder="Potvrdite lozinku..."
                                required
                            />
                            {formData.password && formData.confirm_password && formData.password !== formData.confirm_password && (
                                <div className="field-error">Lozinke se ne poklapaju</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    };

    const renderFormFields = () => {
        if (actionType === 'delete') {
            return (
                <div className="delete-confirmation">
                    <p>Da li ste sigurni da želite da obrišete <strong>{initialData?.name}</strong>?</p>
                    <div className="warning-text">Ova akcija je nepovratna.</div>
                </div>
            );
        }

        if (entityType === 'profile') {
            return (
                <>
                    {renderTabs()}
                    <div className="tab-content">
                        {renderProfileFields()}
                    </div>
                </>
            );
        }

        if (entityType === 'user') {
            return renderUserFields();
        }

        if (entityType === 'item') {
            return (
                <>
                    {renderTabs()}
                    <div className="tab-content">
                        {activeTab === 'item' ? renderItemForm() : renderItemTypeFields()}
                    </div>
                </>
            );
        }

        return renderRegularForm();
    };

    const renderItemForm = () => {
        return (
            <div className="form-fields">
                <div className="form-group">
                    <label htmlFor="name">Naziv *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        placeholder="Unesite naziv artikla..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Opis</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        placeholder="Unesite opis artikla..."
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category_id">Kategorija *</label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id || ''}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Izaberite kategoriju</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="media">Slika</label>

                    {actionType === 'update' && initialData?.media && initialData.media.length > 0 && !formData.removeCurrentImage && (
                        <div className="current-image-section">
                            <div className="current-image-preview">
                                <img
                                    src={initialData.media[0].original_url}
                                    alt={initialData.name}
                                    className="current-image"
                                />
                                <div className="current-image-info">
                                    <span>{initialData.media[0].file_name}</span>
                                    <button
                                        type="button"
                                        className="btn-remove-image"
                                        onClick={handleRemoveCurrentImage}
                                    >
                                        Ukloni postojeću sliku
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <input
                        type="file"
                        id="media"
                        name="media"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="file-input"
                    />

                    {formData.removeCurrentImage && !formData.media && (
                        <div className="file-preview warning">
                            <span>Postojeća slika će biti uklonjena</span>
                            <button
                                type="button"
                                className="btn-restore-image"
                                onClick={handleRestoreImage}
                            >
                                Otkaži uklanjanje
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderRegularForm = () => {
        return (
            <div className="form-fields">
                <div className="form-group">
                    <label htmlFor="name">Naziv *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        placeholder="Unesite naziv..."
                        required
                    />
                </div>

                {entityType === 'category' && (
                    <div className="form-group">
                        <label htmlFor="main_category_id">Glavna kategorija *</label>
                        <select
                            id="main_category_id"
                            name="main_category_id"
                            value={formData.main_category_id || ''}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Izaberite glavnu kategoriju</option>
                            {mainCategories.map(mainCategory => (
                                <option key={mainCategory.id} value={mainCategory.id}>
                                    {mainCategory.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {entityType !== 'order_place' && (
                    <div className="form-group">
                        <label htmlFor="media">Slika</label>

                        {actionType === 'update' && initialData?.media && initialData.media.length > 0 && !formData.remove_current_image && (
                            <div className="current-image-section">
                                <div className="current-image-preview">
                                    <img
                                        src={initialData.media[0].original_url}
                                        alt={initialData.name}
                                        className="current-image"
                                    />
                                    <div className="current-image-info">
                                        <span>{initialData.media[0].file_name}</span>
                                        <button
                                            type="button"
                                            className="btn-remove-image"
                                            onClick={handleRemoveCurrentImage}
                                        >
                                            Ukloni postojeću sliku
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <input
                            type="file"
                            id="media"
                            name="media"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="file-input"
                        />

                        {formData.remove_current_image && !formData.media && (
                            <div className="file-preview warning">
                                <span>Postojeća slika će biti uklonjena</span>
                                <button
                                    type="button"
                                    className="btn-restore-image"
                                    onClick={handleRestoreImage}
                                >
                                    Otkaži uklanjanje
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const getSubmitButtonText = () => {
        if (loading) return 'Čuva se...';

        const texts = {
            create: 'Dodaj',
            update: 'Sačuvaj',
            delete: 'Obriši'
        };

        return texts[actionType] || 'Sačuvaj';
    };

    const getSubmitButtonClass = () => {
        const baseClass = 'btn btn-submit';
        if (actionType === 'delete') return `${baseClass} btn-danger`;
        return baseClass;
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    {entityType === 'order_place' && actionType === 'update' && (
                        <button
                            type="button"
                            className="btn-delete-action"
                            onClick={handleDelete}
                            disabled={loading}
                            title="Obriši mjesto"
                        >
                            <FaTrash />
                        </button>
                    )}
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="universal-modal-content">
                        <h2 className="modal-title">{getModalTitle()}</h2>
                        {error && <div className="error-message">{error}</div>}
                        {renderFormFields()}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Otkaži
                        </button>
                        <button
                            type="submit"
                            className={getSubmitButtonClass()}
                            disabled={loading}
                        >
                            {getSubmitButtonText()}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UniversalModal;