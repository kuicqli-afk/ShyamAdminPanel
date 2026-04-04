import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

import {
  Bell, Package, Users, DollarSign, ShoppingCart, AlertTriangle
} from "lucide-react";

function Dashboard() {

  const [data, setData] = useState({
    stats: { orders: 0, revenue: 0, customers: 0, products: 0 },
    notifications: [],
    recentOrders: [],
    lowStock: []
  });

  const COLORS = ["#4f46e5", "#22c55e", "#ef4444"];

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
        withCredentials: true
      });

      if (res.data && res.data.success) {
        setData(res.data.data);
      }

    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        <div className="notification-bell">
          <Bell size={24} />
          <span className="notif-badge">
            {data?.notifications?.length || 0}
          </span>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="card-container">
        <div className="card">
          <h3><ShoppingCart size={16} /> Orders</h3>
          <p>{data?.stats?.orders || 40}</p>
        </div>

        <div className="card">
          <h3><DollarSign size={16} /> Revenue</h3>
          <p>₹{data?.stats?.revenue || 1890}</p>
        </div>

        <div className="card">
          <h3><Users size={16} /> Customers</h3>
          <p>{data?.stats?.customers || 21}</p>
        </div>

        <div className="card">
          <h3><Package size={16} /> Products</h3>
          <p>{data?.stats?.products || 677}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid-layout">

        {/* SALES GRAPH */}
        <div className="section-box">
          <h3 className="section-title">Revenue Growth</h3>

          <div className="chart-box">
            <ResponsiveContainer>
              <LineChart data={dummySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ORDER STATUS */}
        <div className="section-box">
          <h3 className="section-title">Order Status</h3>

          <div className="chart-box">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" innerRadius={60} outerRadius={80}>
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* TABLE + STOCK */}
      <div className="grid-layout">

        {/* RECENT ORDERS */}
        <div className="section-box">
          <h3 className="section-title">Recent Orders</h3>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {(data?.recentOrders?.length ? data.recentOrders : dummyOrders).map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.name}</td>
                    <td>₹{order.amount}</td>
                    <td>
                      <span className={`badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        {/* LOW STOCK */}
        <div className="section-box">
          <h3 className="section-title danger">
            <AlertTriangle size={18} /> Low Stock
          </h3>

          {(data?.lowStock?.length ? data.lowStock : dummyLowStock).map(item => (
            <div key={item.id} className="stock-item">
              <span>{item.name}</span>
              <span className="badge low-stock">{item.qty} left</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

/* Dummy Data */
const dummySalesData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 6390 },
  { name: 'Sun', revenue: 8000 },

];

const statusData = [
  { name: 'Delivered', value: 400 },
  { name: 'Pending', value: 300 },
  { name: 'Cancelled', value: 100 }
];

const dummyOrders = [
  { id: '1024', name: 'Rahul', amount: 1200, status: 'Delivered' },
  { id: '1025', name: 'Anita', amount: 850, status: 'Pending' }
];

const dummyLowStock = [
  { id: 1, name: 'Mouse', qty: 2 },
  { id: 2, name: 'Cable', qty: 5 }
];

export default Dashboard;