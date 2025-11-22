import { useState } from 'react';


import { createUser } from '../../services/utils';

interface CreateUserModalProps {
    onClose: () => void;
    onCreated: (newUser: any) => void; // Puedes tiparlo si tienes un User type
}

const CreateUserModal = ({ onClose, onCreated }: CreateUserModalProps) => {
    const [userData, setUserData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            if (!userData.username || !userData.password) {
                alert("Todos los campos son obligatorios");
                return;
            }

            const newUser = await createUser(userData.username, userData.password);
            onCreated(newUser);
            onClose();
        } catch (error) {
            alert("Error creando el usuario");
            console.error(error);
        }
    };

    return (
        <div className="create-product-overlay">
            <div className="create-product-box">
                <h3>Crear Usuario</h3>

                <input
                    name="username"
                    placeholder="Nombre de usuario"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    onChange={handleChange}
                />

                <button className="btn btn-blue" onClick={handleSubmit}>Crear</button>
                <button className="btn btn-gray" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default CreateUserModal;
