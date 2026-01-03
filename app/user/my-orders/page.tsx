"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Clock, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

// ১. মূল কন্টেন্ট ফাংশন যেখানে সব লজিক থাকবে
function MyOrdersContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasUpdated = useRef(false);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const tranId = searchParams.get("tranId");

    const updatePaymentStatus = async () => {
      if (paymentStatus === "success" && tranId && !hasUpdated.current) {
        hasUpdated.current = true;
        
        try {
          const orderRef = doc(db, "orders", tranId);
          const orderSnap = await getDoc(orderRef);

          if (orderSnap.exists()) {
            if (orderSnap.data().paymentStatus !== "Paid") {
              await updateDoc(orderRef, {
                paymentStatus: "Paid",
                status: "Processing"
              });
            }

            Swal.fire({
              title: "Payment Successful!",
              text: "Your order has been confirmed and is being processed.",
              icon: "success",
              confirmButtonColor: "#10b981",
              background: "#ffffff",
              customClass: {
                popup: 'rounded-[2.5rem]',
                title: 'font-black uppercase tracking-tight',
                confirmButton: 'rounded-xl px-10 py-3 font-black uppercase text-xs tracking-widest'
              }
            });
          }
          
          window.history.replaceState(null, "", "/user/my-orders");
        } catch (error) {
          console.error("Firestore Update Error:", error);
        }
      } else if (paymentStatus === "failed") {
        Swal.fire({
          title: "Payment Failed",
          text: "Something went wrong with the transaction. Please try again.",
          icon: "error",
          confirmButtonColor: "#ef4444",
          customClass: {
            popup: 'rounded-[2.5rem]'
          }
        });
        window.history.replaceState(null, "", "/user/my-orders");
      }
    };

    updatePaymentStatus();
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;

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
      case "Shipped": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "Delivered": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
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
    <div className="max-w-5xl mx-auto p-6 lg:p-12 min-h-screen bg-slate-50/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter italic">
            Order <span className="text-emerald-500">History</span>
          </h1>
          <p className="text-slate-400 font-medium mt-1">Track and manage your medical supplies</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase">Total Orders</p>
            <p className="font-black text-xl text-slate-800">{orders.length}</p>
          </div>
          <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center text-emerald-400 shadow-lg shadow-slate-200">
            <ShoppingBag size={20} />
          </div>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="group bg-white border border-slate-100 p-6 md:p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${order.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-200'}`}>
                      {order.paymentStatus || "Unpaid"}
                    </span>
                    <span className="text-xs text-slate-400 font-bold tracking-tight">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Recently"}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    Order ID: <span className="text-slate-400 font-mono text-sm ml-1 uppercase">#{order.id.slice(0, 10)}</span>
                  </h3>
                  
                  <div className="flex -space-x-3 overflow-hidden pt-2">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} title={item.name} className="inline-block h-10 w-10 rounded-xl ring-4 ring-white bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-100 uppercase">
                        {item.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-end gap-4 lg:border-l border-slate-50 lg:pl-12">
                  <div className="text-left lg:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Payable</p>
                    <p className="text-3xl font-black text-slate-800 tracking-tighter">৳ {order.totalAmount}</p>
                  </div>
                  <Link 
                    href={`/user/my-orders/${order.id}`}
                    className="bg-[#0f172a] text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95 shadow-xl shadow-slate-200"
                  >
                    View Details
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
          <p className="text-slate-400 mb-8 font-medium">Your medical supplies are just a click away!</p>
          <Link href="/medicines" className="inline-block bg-emerald-500 text-[#0f172a] px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#0f172a] hover:text-white transition-all shadow-xl shadow-emerald-500/20">
            Explore Pharmacy
          </Link>
        </div>
      )}
    </div>
  );
}

// ২. মূল এক্সপোর্ট যা Suspense দিয়ে মোড়ানো (এটি বিল্ড এরর ফিক্স করবে)
export default function MyOrders() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-ring loading-lg text-emerald-500"></span>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Loading History...</p>
      </div>
    }>
      <MyOrdersContent />
    </Suspense>
  );
}