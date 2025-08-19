import { useState, useEffect } from "react";
import type { Product } from "../../types/product";
import "./EditProduct.css";
type EditProductProps = {
    product: Partial<Product>;
    onClose: () => void;
    onSave: (id: string | number, updatedProduct: Partial<Product>) => void;
};

const EditProduct = ({ product, onClose, onSave }: EditProductProps) => {
    const [form, setForm] = useState<Partial<Product>>({});

    useEffect(() => {
        if (product) {
            const formatDate = (dateStr?: string) => {
                if (!dateStr) return "";
                // Intentamos parsear YYYY-MM-DD o ISO, si falla devolvemos vacío
                const d = new Date(dateStr);
                return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
            };

            setForm({
                ...product,
                expire_date: formatDate(product.expire_date),
                alert_date: formatDate(product.alert_date),
            });
        }
    }, [product]);


    if (!product) return null;

    const handleChange = (key: keyof Product, value: string | number) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };
    const handleSubmit = () => {
        if (!form.product_id) return;

        const formatDate = (dateStr?: string) => {
            if (!dateStr) return undefined;
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? undefined : d.toISOString().split("T")[0];
        };

        const updatedProduct = {
            ...form,
            expire_date: formatDate(form.expire_date),
            alert_date: formatDate(form.alert_date),
        };

        onSave(form.product_id, updatedProduct);
        onClose();
    };

    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal">
                <h2>Editar Producto</h2>
                <label>
                    Nombre:
                    <input type="text" value={form.product || ""} onChange={(e) => handleChange("product", e.target.value)} />
                </label>
                <label>
                    Precio:
                    <input type="number" value={form.sell_price || 0} onChange={(e) => handleChange("sell_price", Number(e.target.value))} />
                </label>
                <label>
                    Stock:
                    <input type="number" value={form.stock || 0} onChange={(e) => handleChange("stock", Number(e.target.value))} />
                </label>
                <label>
                    Categoría:
                    <input type="text" value={form.category || ""} onChange={(e) => handleChange("category", e.target.value)} />
                </label>
                <label>
                    Laboratorio:
                    <input type="text" value={form.laboratory || ""} onChange={(e) => handleChange("laboratory", e.target.value)} />
                </label>
                <label>
                    Vencimiento:
                    <input type="date" value={form.expire_date || ""} onChange={(e) => handleChange("expire_date", e.target.value)} />
                </label>
                <label>
                    Alerta:
                    <input type="date" value={form.alert_date || ""} onChange={(e) => handleChange("alert_date", e.target.value)} />
                </label>
                <div className="edit-modal-buttons">
                    <button className="edit-btn-blue" onClick={handleSubmit}>Guardar</button>
                    <button className="edit-btn-red" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>

    );
};

export default EditProduct;
