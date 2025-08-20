import { useEffect, useState } from "react";
import { getSellsByDate } from "../../services/utils";

type SellItem = {
  id: number;
  product_id: number;
  product: string;
  quantity: number;
  total_price: string; // cambiar a string porque tu JSON lo devuelve así
  date: string;
};

const SellsTable = () => {
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [sells, setSells] = useState<SellItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSells = async (selectedDate: string) => {
    setLoading(true);
    try {

      const data: SellItem[] = await getSellsByDate(selectedDate);
      setSells(data || []);

      const total = data.reduce(
        (acc, item) => acc + Number(item.total_price),
        0
      );
      setTotalAmount(total);

      console.log("Sells fetched successfully:", data);
    } catch (error) {
      console.error("Error fetching sells:", error);
      setSells([]);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSells(date);
  }, [date]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const downloadCSV = () => {
    if (sells.length === 0) return;

    const headers = ["Producto", "Cantidad", "Total"];
    const rows = sells.map((item) => [
      item.product,
      item.quantity.toString(),
      item.total_price.toString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ventas_${date.replaceAll("-", "")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>Ventas por fecha</h2>

      <div className="filter-bar" style={{ justifyContent: "center" }}>
        <label htmlFor="sell-date" style={{ marginRight: "10px" }}>
          Seleccionar fecha:
        </label>
        <input
          id="sell-date"
          type="date"
          value={date}
          onChange={handleDateChange}
          className="date-input"
        />
        <button className="btn btn-blue" onClick={downloadCSV}>
          Descargar CSV
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sells.length === 0 ? (
                <tr>
                  <td colSpan={3}>No hay ventas para esta fecha</td>
                </tr>
              ) : (
                sells.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product}</td>
                    <td>{item.quantity}</td>
                    <td>{item.total_price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <h3>Total del día: {totalAmount}</h3>
        </>
      )}
    </div>
  );
};

export default SellsTable;
