"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { 
  Eye, X, User, Clock, CheckCircle2, AlertCircle, 
  Image as ImageIcon, Download, Trash2, Calendar, DollarSign, Truck
} from "lucide-react";

interface Prescription {
  id: string;
  userEmail: string;
  userName?: string;
  prescriptionData: string; 
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  totalPrice?: number; // নতুন ফিল্ড
  createdAt: any;
}

export default function AdminPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "prescriptions"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Prescription[];
      setPrescriptions(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // স্ট্যাটাস এবং প্রাইস আপডেট করার ফাংশন
  const updateOrderData = async (id: string, field: string, value: any) => {
    try {
      const docRef = doc(db, "prescriptions", id);
      await updateDoc(docRef, { [field]: value });
      setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    } catch (error) {
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Stats Section (আগের মতোই থাকবে) */}
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
            Prescription <span className="text-emerald-600 italic">Orders</span>
          </h1>
        </div>

        {loading ? (
           <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-xl border border-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="py-6 px-8 text-left">User Details</th>
                    <th className="py-6 px-4 text-left">Prescription</th>
                    <th className="py-6 px-4 text-left">Bill Amount</th>
                    <th className="py-6 px-4 text-left">Order Status</th>
                    <th className="py-6 px-8 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {prescriptions.map((p) => (
                    <tr key={p.id} className="group hover:bg-slate-50/80 transition-all">
                      <td className="py-6 px-8">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-sm">{p.userName || "Customer"}</span>
                          <span className="text-[10px] text-slate-400 font-bold tracking-tighter">{p.userEmail}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <button onClick={() => setSelectedImg(p.prescriptionData)} className="p-2 bg-slate-100 rounded-lg hover:bg-emerald-100 transition-colors">
                          <ImageIcon size={18} className="text-slate-500" />
                        </button>
                      </td>
                      <td className="py-6 px-4">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                          <input 
                            type="number" 
                            placeholder="Set Price"
                            className="w-24 pl-5 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                            defaultValue={p.totalPrice}
                            onBlur={(e) => updateOrderData(p.id, "totalPrice", Number(e.target.value))}
                          />
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          p.status === "delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          p.status === "cancelled" ? "bg-red-50 text-red-600 border-red-100" :
                          p.status === "shipped" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <select 
                          className="bg-slate-900 text-white border-none rounded-xl text-[10px] font-black p-2.5 outline-none cursor-pointer"
                          value={p.status}
                          onChange={(e) => updateOrderData(p.id, "status", e.target.value)}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="processing">⚙️ Processing</option>
                          <option value="shipped">🚚 Shipped</option>
                          <option value="delivered">✅ Delivered</option>
                          <option value="cancelled">❌ Cancelled</option>
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

      {/* Lightbox Modal (আগের মতোই থাকবে) */}
      {selectedImg && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
           {/* ... আগের লাইটবক্স কোড ... */}
        </div>
      )}
    </div>
  );
}