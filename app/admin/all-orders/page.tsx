"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { Eye, X, Phone, MapPin, User, Package, CreditCard } from "lucide-react";

interface Order {
  id: string;
  userEmail: string;
  userName?: string; // CartPage থেকে আসা
  phone?: string;    // CartPage থেকে আসা
  address?: string;  // CartPage থেকে আসা
  paymentMethod?: string;
  totalAmount: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: any;
  items: any[];
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // ডিটেইলস দেখার জন্য

  const fetchOrders = async () => {
    try {
      setLoading(true);
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

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-6 lg:p-12 bg-slate-50 min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            Admin <span className="text-emerald-600">Dashboard</span>
          </h1>
          <p className="text-slate-500 font-medium">Manage all customer orders and shipments.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full border-separate border-spacing-y-2 px-4">
                <thead className="text-slate-400 uppercase text-[10px] tracking-[0.2em] font-black">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Info</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50 transition-all border-b border-slate-100">
                      <td className="font-mono text-[10px] text-slate-400">#{order.id.slice(0, 8)}</td>
                      <td>
                        <div className="font-bold text-slate-800">{order.userName || "Guest"}</div>
                        <div className="text-[10px] text-slate-400">{order.userEmail}</div>
                      </td>
                      <td className="font-black text-slate-800">৳{order.totalAmount}</td>
                      <td>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          order.status === "Pending" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="flex items-center justify-center gap-2 py-4">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 bg-slate-100 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <select 
                          className="bg-white border border-slate-200 rounded-lg text-[10px] font-bold p-1 focus:outline-none"
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          value={order.status}
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
            </div>
          </div>
        )}
      </div>

      {/* --- ORDER DETAILS MODAL (পপ-আপ উইন্ডো) --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-[#0f172a] p-8 text-white flex justify-between items-center">
              <div>
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Order Details</p>
                <h2 className="text-xl font-black italic">#{selectedOrder.id}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-emerald-500" /> Customer Information
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <p className="text-sm font-bold text-slate-700">Name: {selectedOrder.userName || "N/A"}</p>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2"><Phone size={12}/> {selectedOrder.phone || "No Phone"}</p>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2"><MapPin size={12}/> {selectedOrder.address || "No Address"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard size={14} className="text-emerald-500" /> Payment Info
                  </h3>
                  <div className="bg-slate-900 p-4 rounded-2xl text-white space-y-1">
                    <p className="text-xs uppercase font-bold text-slate-400">Method</p>
                    <p className="text-lg font-black text-emerald-400 italic uppercase">{selectedOrder.paymentMethod || "COD"}</p>
                    <p className="text-xl font-black mt-2">Total: ৳{selectedOrder.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Package size={14} className="text-emerald-500" /> Ordered Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-50 rounded flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-100">{i+1}</div>
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">Qty: {item.quantity} x ৳{item.price}</p>
                        </div>
                      </div>
                      <p className="font-black text-slate-800 text-sm">৳{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}