
import { useEffect, useState } from 'react'
import './App.css'
import { getProducts } from './services/utils';
import Table from './components/Table/Table';

function App() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  })
  return (
    <div>
      <Table products={products}></Table>
    </div>
  )
}

export default App
