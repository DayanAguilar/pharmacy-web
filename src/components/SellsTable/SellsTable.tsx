import { useEffect, useState } from "react";
import { getSellsByDate } from "../../services/utils";

type SellItem = {
  id: number;
  product_id: number;
  product: string;
  quantity: number;
  total_price: string;
  date: string;
  seller: string;
};

const SellsTable = () => {
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [sells, setSells] = useState<SellItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedSeller, setSelectedSeller] = useState<string>("ALL");

  const fetchSells = async (selectedDate: string) => {
    setLoading(true);
    try {
      const data: SellItem[] = await getSellsByDate(selectedDate);
      setSells(data || []);
      setSelectedSeller("ALL");
    } catch (error) {
      console.error("Error fetching sells:", error);
      setSells([]);
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

  const sellers = Array.from(new Set(sells.map((item) => item.seller)));

  const filteredSells =
    selectedSeller === "ALL"
      ? sells
      : sells.filter((item) => item.seller === selectedSeller);

  const totalAmount = filteredSells.reduce(
    (acc, item) => acc + Number(item.total_price),
    0
  );

  const downloadCSV = () => {
    if (filteredSells.length === 0) return;

    const headers = ["Producto", "Cantidad", "Total", "Vendedor"];
    const rows = filteredSells.map((item) => [
      item.product,
      item.quantity.toString(),
      item.total_price.toString(),
      item.seller,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ventas_${date}_${selectedSeller}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>Ventas por fecha</h2>

      <div
        className="filter-bar"
        style={{ justifyContent: "center", gap: "10px" }}
      >
        <label htmlFor="sell-date">Fecha:</label>
        <input
          id="sell-date"
          type="date"
          value={date}
          onChange={handleDateChange}
          className="date-input"
        />

        {/* 🔹 Selector de seller */}
        <select
          value={selectedSeller}
          onChange={(e) => setSelectedSeller(e.target.value)}
          className="date-input"
        >
          <option value="ALL">Todos los vendedores</option>
          {sellers.map((seller) => (
            <option key={seller} value={seller}>
              {seller}
            </option>
          ))}
        </select>

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
                <th>Vendedor</th>
              </tr>
            </thead>
            <tbody>
              {filteredSells.length === 0 ? (
                <tr>
                  <td colSpan={4}>No hay ventas para este filtro</td>
                </tr>
              ) : (
                filteredSells.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product}</td>
                    <td>{item.quantity}</td>
                    <td>{item.total_price}</td>
                    <td>{item.seller}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3>
            Total del día{" "}
            {selectedSeller !== "ALL" && `(${selectedSeller})`}:
            {" "} {totalAmount}
          </h3>
        </>
      )}
    </div>
  );
};

export default SellsTable;
