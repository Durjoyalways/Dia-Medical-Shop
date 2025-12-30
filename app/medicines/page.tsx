"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// প্রতিটি ঔষধের জন্য ইন্টারফেস
interface Medicine {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string; // যদি আপনি পরে ইমেজ যোগ করেন
}

export default function MedicinesPage() {
  const { user } = useAuth(); // ইউজার লগইন আছে কি না, তা চেক করার জন্য
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Tablet", "Syrup", "Injection", "Capsule"];

  // ঔষধ লোড করার ফাংশন
  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      const q = query(collection(db, "medicines"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const meds = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Medicine[];
      setMedicines(meds);
      setLoading(false);
    };
    fetchMedicines();
  }, []);

  // কার্টে ঔষধ যোগ করার ফাংশন
  const handleAddToCart = (medicine: Medicine) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex((item: Medicine) => item.id === medicine.id);

    if (existingItemIndex > -1) {
      // যদি আগে থেকেই কার্টে থাকে, তবে Quantity বাড়াবে
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
      // নতুন আইটেম যোগ করবে
      cart.push({ ...medicine, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${medicine.name} added to cart!`);
  };

  // ফিল্টার করা ঔষধ
  const filteredMedicines = medicines.filter(med => {
    const categoryMatch = selectedCategory === "All" || med.category === selectedCategory;
    const searchMatch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black text-slate-800 mb-10 uppercase tracking-tighter">
        Our <span className="text-emerald-500">Medicines</span>
      </h1>

      {/* --- Filter & Search Section --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex-1">
          <label className="text-xs font-black uppercase text-slate-400 ml-2">Search by Name</label>
          <input
            type="text"
            placeholder="e.g. Paracetamol"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mt-2 bg-slate-100 border-none rounded-2xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          />
        </div>
        <div>
          <label className="text-xs font-black uppercase text-slate-400 ml-2">Filter by Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full mt-2 bg-slate-100 border-none rounded-2xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Medicine Grid --- */}
      {loading ? (
        <div className="text-center py-20">
          <span className="loading loading-spinner loading-lg text-emerald-500"></span>
          <p className="text-slate-500 mt-4">Loading medicines...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMedicines.map(medicine => (
            <div key={medicine.id} className="bg-white rounded-[2.5rem] shadow-lg border border-slate-100 overflow-hidden flex flex-col group">
              <div className="relative h-48 w-full bg-slate-100 flex items-center justify-center p-4">
                {/* Image Placeholder */}
                <img
                  src={medicine.imageUrl || "/default-medicine.png"} // একটি ডিফল্ট ইমেজ দিন
                  alt={medicine.name}
                  className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                />
                <span className="absolute bottom-4 left-4 bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-xl uppercase">
                  {medicine.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">{medicine.name}</h3>
                <p className="text-emerald-600 font-black text-2xl mt-auto">৳ {medicine.price}</p>
                
                <div className="flex gap-3 mt-6">
                  {user ? (
                    <button 
                      onClick={() => handleAddToCart(medicine)}
                      className="flex-1 bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-slate-900/20"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <Link href="/login" className="flex-1 text-center bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-slate-900/20">
                      Login to Buy
                    </Link>
                  )}
                  <Link href={`/medicines/${medicine.id}`} className="btn btn-ghost text-slate-500 hover:text-emerald-500 btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02A9.723 9.723 0 0013.5 12c2.21 0 4-2.19 4-4.992a.75.75 0 00-.008-.009l4.992-.012A6.75 6.75 0 0117.25 4.5h-1.5a.75.75 0 00-.75.75v1.5c0 .092-.01.18-.025.265M11.25 11.25l-.318-.318a11.011 11.011 0 013.885-1.95M11.25 11.25c1.018-.306 2.016-.5 3-.5m-9.42 2.766a39.05 39.05 0 00-.42 2.373M12 12a2.25 2.25 0 002.25-2.25V6.75M12 12V4.5a2.25 2.25 0 012.25-2.25V.75m-9.42 2.766a39.05 39.05 0 00-.42 2.373M2.775 7.02c1.737.766 3.518 1.253 5.31 1.45" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filteredMedicines.length === 0 && !loading && (
            <p className="col-span-full text-center text-slate-500 py-10">No medicines found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
}