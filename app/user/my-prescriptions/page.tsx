"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Clock, CheckCircle2, XCircle, FileText, Calendar, X, Eye, AlertCircle } from "lucide-react";

interface Prescription {
  id: string;
  prescriptionData: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: any;
}

export default function MyPrescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const fetchMyPrescriptions = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "prescriptions"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Prescription[];
      setPrescriptions(data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPrescriptions();
  }, [user]);

  // ইউজার নিজে থেকে অর্ডার ক্যান্সেল করার ফাংশন
  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this prescription order?")) return;
    try {
      const docRef = doc(db, "prescriptions", id);
      await updateDoc(docRef, { status: "cancelled" });
      alert("Order cancelled successfully.");
      setSelectedPrescription(null);
      fetchMyPrescriptions(); // ডাটা রিফ্রেশ
    } catch (error) {
      alert("Failed to cancel order.");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-500 animate-pulse">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-[#f8fafc]">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <FileText className="text-emerald-600" size={32} /> MY PRESCRIPTIONS
        </h1>
        <p className="text-slate-500 font-medium mt-1">Check status of your medical document uploads.</p>
      </div>

      <div className="grid gap-6">
        {prescriptions.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between hover:border-emerald-200 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden border">
                <img src={p.prescriptionData} alt="Prescription" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                   {p.createdAt?.toDate().toLocaleDateString()}
                </p>
                <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                  p.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                  p.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {p.status === 'pending' && <Clock size={12} />}
                  {p.status === 'completed' && <CheckCircle2 size={12} />}
                  {p.status === 'cancelled' && <XCircle size={12} />}
                  {p.status}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedPrescription(p)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-2xl font-black text-xs uppercase transition-all"
            >
              Details
            </button>
          </div>
        ))}
      </div>

      {/* --- View Details & Actions Modal --- */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden p-8 relative animate-in zoom-in-95">
            <button onClick={() => setSelectedPrescription(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-all">
              <X size={24} />
            </button>

            <div className="text-center mb-8">
               <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                 selectedPrescription.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                 selectedPrescription.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
               }`}>
                 {selectedPrescription.status === 'pending' ? <Clock size={40}/> : selectedPrescription.status === 'completed' ? <CheckCircle2 size={40}/> : <XCircle size={40}/>}
               </div>
               <h2 className="text-2xl font-black text-slate-900 uppercase">Order {selectedPrescription.status}</h2>
               <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">ID: #{selectedPrescription.id.slice(0,10)}</p>
            </div>

            <div className="rounded-[2rem] overflow-hidden border-4 border-slate-50 mb-8 max-h-60">
              <img src={selectedPrescription.prescriptionData} alt="Prescription" className="w-full object-contain bg-slate-100" />
            </div>

            <div className="space-y-4">
              {/* শুধুমাত্র Pending থাকলে Cancel বাটন দেখাবে */}
              {selectedPrescription.status === "pending" && (
                <button 
                  onClick={() => handleCancel(selectedPrescription.id)}
                  className="w-full py-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={18} /> Cancel Order Request
                </button>
              )}
              
              <button 
                onClick={() => setSelectedPrescription(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}