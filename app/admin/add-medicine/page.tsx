"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddMedicine() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Tablet");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "medicines"), {
        name,
        price: Number(price),
        category,
        createdAt: serverTimestamp(),
      });
      alert("Medicine Added Successfully!");
      setName(""); setPrice("");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-800 mb-8 uppercase text-center">Add <span className="text-emerald-500">Medicine</span></h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-black uppercase text-slate-400 ml-2">Medicine Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-2 bg-slate-100 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-slate-400 ml-2">Price (BDT)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full mt-2 bg-slate-100 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-emerald-500" required />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-400 ml-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-2 bg-slate-100 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-emerald-500 font-bold">
                <option>Tablet</option>
                <option>Syrup</option>
                <option>Injection</option>
                <option>Capsule</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest shadow-lg shadow-emerald-200">
            {loading ? "Adding..." : "Confirm & Save"}
          </button>
        </form>
      </div>
    </div>
  );
}