// src/components/LoginModal.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/services/auth/AuthServices.js';
import '../../styles/LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await loginUser({ username, password });
            login(data);
            onClose();
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Greška prilikom prijave');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="login-form-container">
                    <h2>Prijava</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Korisničko ime"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Lozinka"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <div className="form-buttons">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={onClose}
                            >
                                Otkaži
                            </button>
                            <button
                                type="submit"
                                className="confirm-btn"
                                disabled={loading}
                            >
                                {loading ? 'Prijavljivanje...' : 'Prijavi se'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;