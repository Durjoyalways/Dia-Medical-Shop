"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMyOrders = async () => {
      const q = query(
        collection(db, "orders"), 
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchMyOrders();
  }, [user]);

  return (
    <div className="p-6 lg:p-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-10 text-slate-800">MY <span className="text-emerald-500">ORDERS</span></h1>
      
      {loading ? <p>Loading orders...</p> : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID: {order.id.slice(0,8)}</p>
                <h3 className="text-xl font-black text-slate-800">৳ {order.totalAmount}</h3>
                <p className="text-xs text-slate-500">{order.createdAt?.toDate().toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-slate-400 text-center">You haven't ordered anything yet.</p>}
        </div>
      )}
    </div>
  );
}