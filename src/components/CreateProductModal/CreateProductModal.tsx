import { useState } from 'react';
import { createProduct } from '../../services/utils';
import type { Product } from '../../types/product';
import './CreateProductModal.css';
interface CreateProductModalProps {
  onClose: () => void;
  onCreated: (newProduct: Product) => void;
}

const CreateProductModal = ({ onClose, onCreated }: CreateProductModalProps) => {
  const [productData, setProductData] = useState({
    category: '',
    product: '',
    laboratory: '',
    buy_price: 0,
    sell_price: 0,
    stock: 0,
    expire_date: '',
    alert_date: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const newProduct = await createProduct(productData);
      onCreated(newProduct);
      onClose();
    } catch (error) {
      alert("Error creando el producto");
      console.error(error);
    }
  };

  return (
    <div className="create-product-overlay">
      <div className="create-product-box">
        <h3>Crear Producto</h3>
        <input name="category" placeholder="Categoría" onChange={handleChange} />
        <input name="product" placeholder="Nombre" onChange={handleChange} />
        <input name="laboratory" placeholder="Laboratorio" onChange={handleChange} />
        <input type="number" name="buy_price" placeholder="Precio compra" onChange={handleChange} />
        <input type="number" name="sell_price" placeholder="Precio venta" onChange={handleChange} />
        <input type="number" name="stock" placeholder="Stock" onChange={handleChange} />
        <input type="date" name="expire_date" placeholder="Fecha vencimiento" onChange={handleChange} />
        <input type="date" name="alert_date" placeholder="Fecha alerta" onChange={handleChange} />
        <button className="btn btn-blue" onClick={handleSubmit}>Crear</button>
        <button className="btn btn-gray" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default CreateProductModal;
