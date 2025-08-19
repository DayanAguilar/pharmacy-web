import { useEffect, useState } from 'react';
import './App.css';
import { deleteProduct, getProducts, createSell, updateProduct } from './services/utils';
import Table from './components/Table/Table';
import type { Product } from './types/product';
import SearchBar from './components/Search/Search';
import Cart from './components/Cart/Cart';
import SellsTable from './components/SellsTable/SellsTable';
import EditProduct from './components/EditProduct/EditProduct';
import DailyAlertModal from './components/AlertModal/AlertModal';
import CreateProductModal from './components/CreateProductModal/CreateProductModal';
import Login from './components/Login/Login';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'expiring'>('all');
  const [view, setView] = useState<'products' | 'sells'>('products');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return localStorage.getItem('isLoggedIn') === 'true';
});


const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  setIsLoggedIn(false);
};


  useEffect(() => {
    if (isLoggedIn) fetchProducts();
  }, [isLoggedIn]);

  const fetchProducts = async () => {
    try {
      const response: Product[] = await getProducts();
      setProducts(response);
      setFiltered(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await deleteProduct(id.toString());
      setProducts(prev => prev.filter(p => p.product_id !== id));
      setFiltered(prev => prev.filter(p => p.product_id !== id));
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };

  const handleSearch = (query: string) => {
    applyFilters(query, filterType);
  };

  const applyFilters = (searchQuery: string = '', filter: 'all' | 'expiring' = 'all') => {
    let result = products;

    if (searchQuery) {
      result = result.filter(p =>
        p.product.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filter === 'expiring') {
      const today = new Date();
      result = result.filter(p => new Date(p.alert_date) <= today);
    }

    setFiltered(result);
  };

  const handleFilterChange = (type: 'all' | 'expiring') => {
    setFilterType(type);
    applyFilters('', type);
  };

  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const handleEditSave = async (id: string | number, updatedProduct: Partial<Product>) => {
    try {
      await updateProduct(id.toString(), updatedProduct);
      setProducts(prev =>
        prev.map(p => (p.product_id === id ? { ...p, ...updatedProduct } : p))
      );
      setFiltered(prev =>
        prev.map(p => (p.product_id === id ? { ...p, ...updatedProduct } : p))
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSell = async (cartItems: { product_id: number | string; quantity: number }[]) => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    try {
      for (const item of cartItems) {
        await createSell({ product_id: item.product_id, quantity: item.quantity });
      }
      alert("Venta realizada exitosamente");
      await fetchProducts();
    } catch (error) {
      console.error("Error realizando la venta:", error);
      alert("Error al procesar la venta");
    }
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div>
      <h2>{view === 'products' ? 'Productos' : 'Ventas'}</h2>
      <DailyAlertModal products={products} onClose={() => { }} />

      <div className="top-bar">
        <button
          className={`btn ${view === 'products' ? 'btn-active' : ''}`}
          onClick={() => setView('products')}
        >
          Productos
        </button>
        <button className="btn btn-green" onClick={() => setIsCreateModalOpen(true)}>
          Crear Producto
        </button>
        <button
          className={`btn ${view === 'sells' ? 'btn-active' : ''}`}
          onClick={() => setView('sells')}
        >
          Ventas
        </button>
      </div>

      {view === 'products' && (
        <>
          <div className="top-bar">
            <SearchBar onSearch={handleSearch} />
            <button className="btn btn-blue" onClick={() => setIsCartOpen(true)}>
              Vender
            </button>
          </div>

          <div className="filter-bar">
            <button
              className={`btn ${filterType === 'all' ? 'btn-active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              Todos los productos
            </button>
            <button
              className={`btn ${filterType === 'expiring' ? 'btn-active' : ''}`}
              onClick={() => handleFilterChange('expiring')}
            >
              Productos por vencer
            </button>
            {isLoggedIn && (
  <button className="logout" onClick={handleLogout}>
    Cerrar sesión
  </button>
)}
          </div>

          <Table
            products={filtered}
            onDelete={handleDelete}
            onEdit={(product) => setEditingProduct(product)}
          />
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onSell={handleSell}
          />
        </>
      )}

      {view === 'sells' && <SellsTable />}
      {editingProduct && (
        <EditProduct
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleEditSave}
        />
      )}
      {isCreateModalOpen && (
        <CreateProductModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={(newProduct) => {
            setProducts(prev => [...prev, newProduct]);
            setFiltered(prev => [...prev, newProduct]);
          }}
        />
      )}
      

    </div>
  );
}

export default App;
