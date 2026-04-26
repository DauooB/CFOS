import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const KitchenDashboard = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '' });
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${apiUrl}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/menu`);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const updateOrderStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`${apiUrl}/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const toggleAvailability = async (id: number, is_available: boolean) => {
    try {
      await axios.patch(`${apiUrl}/menu/${id}/availability`, { is_available: !is_available }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const updatePrice = async (id: number, price: number) => {
    const newPrice = prompt('Enter new price:', price.toString());
    if (newPrice && !isNaN(Number(newPrice))) {
      try {
        await axios.patch(`${apiUrl}/menu/${id}/price`, { price: Number(newPrice) }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (error) {
        console.error('Error updating price:', error);
      }
    }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/menu`, { ...newProduct, price: Number(newProduct.price) }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      setNewProduct({ name: '', price: '', category: '' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <p><strong>Order #{order.id}</strong> - ${order.total_amount}</p>
                <p>Status: {order.status}</p>
              </div>
              <div className="space-x-2">
                {order.status === 'Queued' && (
                  <button onClick={() => updateOrderStatus(order.id, 'Preparing')} className="bg-blue-500 text-white px-3 py-1 rounded">Start Preparing</button>
                )}
                {order.status === 'Preparing' && (
                  <button onClick={() => updateOrderStatus(order.id, 'Ready')} className="bg-green-500 text-white px-3 py-1 rounded">Mark Ready</button>
                )}
                {order.status === 'Ready' && (
                  <button onClick={() => updateOrderStatus(order.id, 'Completed')} className="bg-gray-500 text-white px-3 py-1 rounded">Complete</button>
                )}
              </div>
            </div>
          ))}
          {orders.length === 0 && <p>No active orders.</p>}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <form onSubmit={addProduct} className="mb-6 flex gap-4">
          <input type="text" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="border p-2 rounded" required />
          <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="border p-2 rounded" required />
          <input type="text" placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add Product</button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="border p-4 rounded flex flex-col justify-between">
              <div>
                <h3 className="font-bold">{product.name}</h3>
                <p>${product.price}</p>
                <p>Status: {product.is_available ? 'Available' : 'Out of Stock'}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => toggleAvailability(product.id, product.is_available)} className={`${product.is_available ? 'bg-red-500' : 'bg-green-500'} text-white px-3 py-1 rounded w-full`}>
                  {product.is_available ? 'Mark Out of Stock' : 'Mark Available'}
                </button>
                <button onClick={() => updatePrice(product.id, product.price)} className="bg-blue-500 text-white px-3 py-1 rounded w-full">Edit Price</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;
