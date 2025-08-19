
import { useState } from "react";
import type { Product } from "../../types/product";
import "./AlertModal.css";

type DailyAlertModalProps = {
  products: Product[];
  onClose: () => void;
};

const DailyAlertModal = ({ products  }: DailyAlertModalProps) => {
  const [visible, setVisible] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const alertsToday = products.filter(
    (p) => p.alert_date && p.alert_date.split("T")[0] === today
  );

  if (!visible || alertsToday.length === 0) return null;

  return (
    <div className="daily-alert-overlay">
      <div className="daily-alert-box">
        <h2>Productos con alerta hoy</h2>
        <ul>
          {alertsToday.map((p) => (
            <li key={p.product_id}>
              {p.product} - Stock: {p.stock} - Vence: {p.expire_date?.split("T")[0]}
            </li>
          ))}
        </ul>
        <button className="daily-alert-btn" onClick={() => setVisible(false)}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default DailyAlertModal;
