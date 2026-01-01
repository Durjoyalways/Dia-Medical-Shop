"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Package, Clock, CheckCircle, Truck, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // ইনডেক্সটি এখন Enabled, তাই এই কুয়েরিটি পারফেক্টলি কাজ করবে
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Shipped": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"; // শিপড এর জন্য নীল/বেগুনি
      case "Delivered": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Cancelled": return "bg-red-500/10 text-red-500 border-red-500/20"; // ক্যান্সেল এর জন্য লাল
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <span className="loading loading-ring loading-lg text-emerald-500"></span>
      <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing with server...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">
            Order <span className="text-emerald-500">History</span>
          </h1>
          <p className="text-slate-400 font-medium mt-1">Track and manage your medical supplies</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase">Total Orders</p>
            <p className="font-black text-xl text-slate-800">{orders.length}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <ShoppingBag size={20} />
          </div>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="group bg-white border border-slate-100 p-6 md:p-8 rounded-[2.5rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                
                {/* Order Meta */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-slate-400 font-bold tracking-tight">
                      {order.createdAt?.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    Order ID: <span className="text-slate-400 font-mono text-sm ml-1 uppercase">#{order.id.slice(0, 10)}</span>
                  </h3>
                  
                  {/* Item Preview */}
                  <div className="flex -space-x-3 overflow-hidden pt-2">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="inline-block h-10 w-10 rounded-xl ring-4 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                        {item.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Action */}
                <div className="flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-end gap-4 lg:border-l border-slate-50 lg:pl-12">
                  <div className="text-left lg:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Payable</p>
                    <p className="text-3xl font-black text-slate-800 tracking-tighter">৳ {order.totalAmount}</p>
                  </div>
                  <Link 
                    href={`/user/my-orders/${order.id}`}
                    className="bg-slate-800 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-slate-800/20"
                  >
                    Details
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
            <Clock size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tighter">No Orders Yet</h2>
          <p className="text-slate-400 mb-8 font-medium">Your prescriptions are waiting for you!</p>
          <Link href="/medicines" className="inline-block bg-emerald-500 text-[#0f172a] px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#0f172a] hover:text-white transition-all shadow-xl shadow-emerald-500/20">
            Explore Pharmacy
          </Link>
        </div>
      )}
    </div>
  );
}