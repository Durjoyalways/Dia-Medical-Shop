"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, Clock, CreditCard, Package, Truck, CheckCircle2, XCircle } from "lucide-react"; 
import Link from "next/link";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      const docRef = doc(db, "orders", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  // স্ট্যাটাস অনুযায়ী আইকন এবং কালার সেট করার ফাংশন
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Pending":
        return { icon: <Clock className="text-amber-500" size={20} />, label: "Order Pending", color: "text-amber-500", bg: "bg-amber-50" };
      case "Shipped":
        return { icon: <Truck className="text-blue-500" size={20} />, label: "On the Way (Shipped)", color: "text-blue-500", bg: "bg-blue-50" };
      case "Delivered":
        return { icon: <CheckCircle2 className="text-emerald-500" size={20} />, label: "Order Delivered", color: "text-emerald-500", bg: "bg-emerald-50" };
      case "Cancelled":
        return { icon: <XCircle className="text-red-500" size={20} />, label: "Order Cancelled", color: "text-red-500", bg: "bg-red-50" };
      default:
        return { icon: <Package className="text-slate-500" size={20} />, label: "Processing", color: "text-slate-500", bg: "bg-slate-50" };
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (!order) return <div className="p-10 text-center text-red-500 font-black">Order not found!</div>;

  const statusInfo = getStatusDisplay(order.status);

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-12 min-h-screen bg-slate-50/50">
      <Link href="/user/my-orders" className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 font-bold mb-10 transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to History
      </Link>

      <div className="bg-white border border-slate-100 rounded-[3rem] shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#0f172a] p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 uppercase">
                Status: {order.status}
              </p>
              <h1 className="text-3xl font-black uppercase tracking-tight italic">Order #{order.id.slice(0, 8)}</h1>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/5">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Amount</p>
              <p className="text-2xl font-black text-emerald-400">৳ {order.totalAmount}</p>
            </div>
          </div>
        </div>

        {/* Status Alert Banner */}
        <div className={`m-8 mb-0 p-6 rounded-3xl border flex items-center gap-4 ${statusInfo.bg} ${statusInfo.color.replace('text', 'border')}/20`}>
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            {statusInfo.icon}
          </div>
          <div>
            <h3 className={`font-black uppercase text-sm tracking-tight ${statusInfo.color}`}>{statusInfo.label}</h3>
            <p className="text-xs font-medium text-slate-500">Your order status was updated recently.</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8 md:p-12 space-y-10">
          {/* Items List */}
          <div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Package size={14} /> Items Purchased
            </h2>
            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors rounded-xl px-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 border border-slate-100">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 uppercase text-sm">{item.name}</p>
                      <p className="text-xs text-slate-400 font-bold italic">Quantity: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <p className="font-black text-slate-800">৳ {item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
             <div className="space-y-2 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> Order Date</p>
                <p className="text-sm font-bold text-slate-700">
                  {order.createdAt?.toDate().toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
             </div>
             <div className="space-y-2 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><CreditCard size={12}/> Payment Method</p>
                <p className="text-sm font-bold text-slate-700 uppercase">Cash on Delivery</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}