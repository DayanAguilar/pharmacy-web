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
  products: Product[]
}

const Table = ({ products }: TableProps) => {
  return (
    <table className="table-auto border-collapse border border-gray-400 w-full">
      <thead>
        <tr>
          <th className="border border-gray-300 px-2 py-1">Producto</th>
          <th className="border border-gray-300 px-2 py-1">Precio</th>
          <th className="border border-gray-300 px-2 py-1">Stock</th>
          <th className="border border-gray-300 px-2 py-1">Categoría</th>
          <th className="border border-gray-300 px-2 py-1">Laboratorio</th>
          <th className="border border-gray-300 px-2 py-1">Vencimiento</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.product_id}>
            <td className="border border-gray-300 px-2 py-1">{product.product}</td>
            <td className="border border-gray-300 px-2 py-1">{product.sell_price}</td>
            <td className="border border-gray-300 px-2 py-1">{product.stock}</td>
            <td className="border border-gray-300 px-2 py-1">{product.category}</td>
            <td className="border border-gray-300 px-2 py-1">{product.laboratory}</td>
            <td className="border border-gray-300 px-2 py-1">{product.expire_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
