import { useState } from "react"
import "./Table.css"

type Product = {
  product_id: number | string
  product: string
  sell_price: number | string
  stock: number
  category: string
  laboratory: string
  expire_date: string
}

type TableProps = {
  products: Product[],
  onDelete: (id: string | number) => void
}

const Table = ({ products,onDelete }: TableProps) => {
  const [quantities, setQuantities] = useState<Record<string | number, number>>({})

  const handleQuantityChange = (id: string | number, value: number, stock: number) => {
    if (value > stock) {
      alert("La cantidad no puede ser mayor al stock disponible")
      value = stock
    }
    if (value < 1) value = 1
    setQuantities((prev) => ({ ...prev, [id]: value }))
  }

  const handleAdd = (product: Product) => {
    const existing = JSON.parse(localStorage.getItem("cart") || "[]") as (Product & { quantity: number })[]
    const quantity = quantities[product.product_id] || 1
    const productWithQuantity = { ...product, quantity }
    localStorage.setItem("cart", JSON.stringify([...existing, productWithQuantity]))
    alert(`Producto "${product.product}" añadido con cantidad ${quantity}`)
  }


  const handleEdit = (id: string | number) => {
    alert(`Editar producto con ID: ${id}`)
  }

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Laboratorio</th>
            <th>Vencimiento</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.product_id}>
              <td>{product.product}</td>
              <td>{product.sell_price}</td>
              <td>{product.stock}</td>
              <td>{product.category}</td>
              <td>{product.laboratory}</td>
              <td>{product.expire_date}</td>
              <td>
                <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantities[product.product_id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(product.product_id, Number(e.target.value), product.stock)
                  }
                  className="qty-input"
                />
              </td>
              <td>
                <button className="btn btn-green" onClick={() => handleAdd(product)}>
                  Añadir
                </button>
                <button className="btn btn-blue" onClick={() => handleEdit(product.product_id)}>
                  Editar
                </button>
                <button className="btn btn-red" onClick={() => onDelete(product.product_id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
