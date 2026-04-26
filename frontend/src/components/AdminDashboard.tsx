import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import KitchenDashboard from './KitchenDashboard';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [sales, setSales] = useState<{ daily: number, monthly: number }>({ daily: 0, monthly: 0 });
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get(`${apiUrl}/orders/sales`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSales(res.data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };
    fetchSales();
  }, [apiUrl, token]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow grid grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-blue-800">Daily Sales</h3>
          <p className="text-3xl font-bold text-blue-600">${sales.daily.toFixed(2)}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-green-800">Monthly Sales</h3>
          <p className="text-3xl font-bold text-green-600">${sales.monthly.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Kitchen Operations</h2>
        <KitchenDashboard />
      </div>
    </div>
  );
};

export default AdminDashboard;
