"use client";
import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { 
  Eye, X, Phone, MapPin, User, Package, CreditCard, 
  CheckCircle2, AlertCircle, ShoppingBag, Truck, Clock, Search 
} from "lucide-react";

interface Order {
  id: string;
  userEmail: string;
  userName?: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  totalAmount: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: any;
  items: any[];
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // --- গুরুত্বপূর্ণ: Total Sales ক্যালকুলেশন ---
  // শুধুমাত্র 'Paid' স্ট্যাটাস থাকা অর্ডারগুলোর টাকা যোগ হবে
  const totalSales = useMemo(() => {
    return orders
      .filter(order => order.paymentStatus === "Paid")
      .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  }, [orders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderToUpdate = orders.find(o => o.id === orderId);
      const updates: any = { status: newStatus };
      
      // লজিক: যদি Delivered হয়, তবে পেমেন্ট Paid হবে
      if (newStatus === "Delivered" && orderToUpdate?.paymentStatus !== "Paid") {
        updates.paymentStatus = "Paid";
      }

      await updateDoc(orderRef, updates);
      
      // স্টেট আপডেট যাতে সাথে সাথে Total Sales বেড়ে যায়
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, ...updates } : o
      ));
      
      if (newStatus === "Delivered") alert("Order Delivered & Payment Confirmed!");
    } catch (error) {
      alert("Error updating status");
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
              Admin <span className="text-emerald-600 italic">Panel</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">Manage Sales & Inventory Control.</p>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search Orders..." 
              className="pl-12 pr-6 py-3.5 bg-white border-none rounded-2xl shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-80 transition-all text-sm font-medium"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Summary Area */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200 flex items-center justify-between overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
             <div className="relative z-10">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Paid Sales</p>
              <h3 className="text-3xl font-black mt-2 tracking-tighter">৳{totalSales.toLocaleString()}</h3>
            </div>
            <div className="bg-emerald-500 p-4 rounded-3xl shadow-lg shadow-emerald-500/20 relative z-10">
              <ShoppingBag size={24}/>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Pending Orders</p>
              <h3 className="text-3xl font-black mt-2 text-slate-800 tracking-tighter">{orders.filter(o => o.status === "Pending").length}</h3>
            </div>
            <div className="bg-amber-50 p-4 rounded-3xl text-amber-500 border border-amber-100"><Clock size={24}/></div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Success Delivery</p>
              <h3 className="text-3xl font-black mt-2 text-slate-800 tracking-tighter">{orders.filter(o => o.status === "Delivered").length}</h3>
            </div>
            <div className="bg-emerald-50 p-4 rounded-3xl text-emerald-500 border border-emerald-100"><Truck size={24}/></div>
          </div>
        </div>

        {/* Orders Table Container */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Fetching Cloud Records...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="py-6 px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID</th>
                    <th className="py-6 px-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer Info</th>
                    <th className="py-6 px-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                    <th className="py-6 px-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payment Info</th>
                    <th className="py-6 px-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Status</th>
                    <th className="py-6 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                      <td className="py-6 px-8">
                        <span className="font-mono text-[10px] font-bold text-slate-400">#{order.id.slice(0, 8)}</span>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-sm tracking-tight">{order.userName || "N/A"}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{order.userEmail}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <span className="font-black text-slate-900 text-lg tracking-tighter">৳{order.totalAmount}</span>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{order.paymentMethod === "Online" ? "Online" : "COD"}</span>
                          <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${order.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-500"}`}>
                            {order.paymentStatus === "Paid" ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
                            {order.paymentStatus || "Unpaid"}
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                          order.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-100" : 
                          order.status === "Delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                          "bg-blue-50 text-blue-600 border-blue-100"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => setSelectedOrder(order)} className="p-2.5 bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all shadow-sm">
                            <Eye size={18} />
                          </button>
                          <select 
                            className="bg-slate-50 border-none rounded-2xl text-[10px] font-black p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer shadow-sm"
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            value={order.status}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL SECTION --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Billing Receipt</p>
                <h2 className="text-2xl font-black italic mt-1 uppercase tracking-tighter">#{selectedOrder.id.slice(0, 12)}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all relative z-10">
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-5">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-emerald-500" /> Customer Information
                  </h3>
                  <div className="space-y-3">
                    <p className="text-lg font-black text-slate-800">{selectedOrder.userName || "N/A"}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-500 flex items-center gap-2"><Phone size={14} className="text-slate-300"/> {selectedOrder.phone}</p>
                      <p className="text-sm font-bold text-slate-500 flex items-start gap-2"><MapPin size={14} className="text-slate-300 mt-1"/> {selectedOrder.address}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <CreditCard size={14} className="text-emerald-500" /> Total Bill
                    </h3>
                    <p className="text-4xl font-black text-slate-900">৳{selectedOrder.totalAmount}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${selectedOrder.paymentStatus === "Paid" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                      {selectedOrder.paymentStatus || "UNPAID"}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Package size={14} className="text-emerald-500" /> Itemized List
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-300 italic">0{i + 1}</span>
                        <div>
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{item.quantity} Qty × ৳{item.price}</p>
                        </div>
                      </div>
                      <p className="font-black text-slate-800 tracking-tight">৳{item.price * item.quantity}</p>
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