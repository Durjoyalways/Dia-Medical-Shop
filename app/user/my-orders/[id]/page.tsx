"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, Clock, CreditCard, Package, Truck, CheckCircle2, XCircle, MapPin, Phone, User } from "lucide-react"; 
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

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Pending":
        return { icon: <Clock className="text-amber-500" size={20} />, label: "Order Pending", color: "text-amber-500", bg: "bg-amber-50" };
      case "Shipped":
        return { icon: <Truck className="text-blue-500" size={20} />, label: "On the Way", color: "text-blue-500", bg: "bg-blue-50" };
      case "Delivered":
        return { icon: <CheckCircle2 className="text-emerald-500" size={20} />, label: "Delivered", color: "text-emerald-500", bg: "bg-emerald-50" };
      case "Cancelled":
        return { icon: <XCircle className="text-red-500" size={20} />, label: "Cancelled", color: "text-red-500", bg: "bg-red-50" };
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
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                Order Status
              </p>
              <h1 className="text-3xl font-black uppercase tracking-tight italic">ID: #{order.id.slice(0, 10)}</h1>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/5 text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Payable</p>
              <p className="text-2xl font-black text-emerald-400">৳ {order.totalAmount}</p>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`m-8 mb-0 p-6 rounded-3xl border flex items-center gap-4 ${statusInfo.bg} ${statusInfo.color.replace('text', 'border')}/20`}>
          <div className="p-3 bg-white rounded-2xl shadow-sm">{statusInfo.icon}</div>
          <div>
            <h3 className={`font-black uppercase text-sm tracking-tight ${statusInfo.color}`}>{statusInfo.label}</h3>
            <p className="text-xs font-medium text-slate-500">Updated on {order.createdAt?.toDate().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-12">
          
          {/* --- NEW: Shipping & Payment Details Section --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Delivery Address */}
            <div className="space-y-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-emerald-500" /> Delivery Details
              </h2>
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-3">
                <div className="flex items-start gap-3">
                  <User size={16} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Customer</p>
                    <p className="text-sm font-bold text-slate-700">{order.userName || "Guest User"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Phone Number</p>
                    <p className="text-sm font-bold text-slate-700">{order.phone || "Not Provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Shipping Address</p>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                      {order.address || "Address details not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CreditCard size={14} className="text-emerald-500" /> Payment Summary
              </h2>
              <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl shadow-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Method</span>
                  <span className="text-sm font-black text-emerald-400 uppercase">{order.paymentMethod || "Cash on Delivery"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Payment Status</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${order.paymentStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {order.paymentStatus || "Unpaid / COD"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-black uppercase italic">Order Total</span>
                  <span className="text-xl font-black text-white">৳ {order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Package size={14} /> Ordered Items ({order.items?.length || 0})
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-4 bg-white border border-slate-100 hover:border-emerald-200 transition-all rounded-2xl group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 uppercase text-sm tracking-tight">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        Qty: {item.quantity} × ৳{item.price}
                      </p>
                    </div>
                  </div>
                  <p className="font-black text-slate-900">৳ {item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}