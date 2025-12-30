"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";

interface Order {
  id: string;
  userEmail: string;
  totalAmount: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: any;
  items: any[];
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // সব অর্ডার ফেচ করার ফাংশন
  const fetchOrders = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // অর্ডারের স্ট্যাটাস আপডেট করার ফাংশন
  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      alert(`Order status updated to ${newStatus}`);
      fetchOrders(); // ডাটা রিফ্রেশ করা
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-6 lg:p-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            Customer <span className="text-emerald-600">Orders</span>
          </h1>
          <p className="text-slate-500 font-medium">Manage and track all medicine deliveries here.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-emerald-500"></span>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full border-separate border-spacing-y-2 px-4">
                {/* Table Head */}
                <thead className="text-slate-400 uppercase text-[10px] tracking-[0.2em] font-black">
                  <tr>
                    <th className="bg-transparent">Order ID</th>
                    <th className="bg-transparent">Customer</th>
                    <th className="bg-transparent">Amount</th>
                    <th className="bg-transparent">Status</th>
                    <th className="bg-transparent text-center">Action</th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50 transition-all">
                      <td className="font-mono text-xs text-slate-500 py-6">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td>
                        <div className="font-bold text-slate-800">{order.userEmail}</div>
                        <div className="text-[10px] text-slate-400">
                          {order.createdAt?.toDate().toLocaleDateString()}
                        </div>
                      </td>
                      <td className="font-black text-slate-800">৳ {order.totalAmount}</td>
                      <td>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                          ${order.status === "Pending" ? "bg-amber-100 text-amber-600" : 
                            order.status === "Delivered" ? "bg-emerald-100 text-emerald-600" : 
                            "bg-blue-100 text-blue-600"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <select 
                          className="select select-sm select-bordered rounded-xl text-xs font-bold"
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          defaultValue={order.status}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="text-center py-20 text-