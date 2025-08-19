import { useEffect, useState } from "react";
import "./Cart.css";

type CartProps = {
    isOpen: boolean;
    onClose: () => void;
    onSell: (items: { product_id: number | string; quantity: number }[]) => void;

};

type CartItem = {
    product_id: number | string;
    product: string;
    sell_price: number;
    quantity: number;
};

const Cart = ({ isOpen, onClose, onSell }: CartProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        if (isOpen) {
            const stored = JSON.parse(localStorage.getItem("cart") || "[]");
            setCartItems(stored);
        }
    }, [isOpen]);

    const handleDelete = (id: string | number) => {
        const updated = cartItems.filter((item) => item.product_id !== id);
        setCartItems(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
    };


    const handleEdit = (id: string | number) => {
        const item = cartItems.find((i) => i.product_id === id);
        if (!item) return;

        const qty = prompt("Cantidad:", item.quantity.toString());
        if (!qty) return;

        const quantity = Math.max(1, Number(qty));
        const updated = cartItems.map((i) =>
            i.product_id === id ? { ...i, quantity } : i
        );
        setCartItems(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
    };

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.sell_price * item.quantity,
        0
    );
    const handleSellClick = () => {
        onSell(cartItems);
        localStorage.removeItem("cart");
        setCartItems([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="cart-modal">
            <div className="cart-content">
                <button className="btn btn-red" onClick={onClose}>
                    Cerrar
                </button>
                <h2>Carrito</h2>
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.product_id}>
                                <td>{item.product}</td>
                                <td>{item.sell_price}</td>
                                <td>{item.quantity}</td>
                                <td>{item.sell_price * item.quantity}</td>
                                <td>
                                    <button
                                        className="btn btn-blue"
                                        onClick={() => handleEdit(item.product_id)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-red"
                                        onClick={() => handleDelete(item.product_id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="cart-footer">
                    <button className="btn-sell" onClick={handleSellClick}>
                        Vender
                    </button>
                </div>
                <h3>Precio Total: {totalPrice}</h3>
            </div>
        </div>
    );
};

export default Cart;
