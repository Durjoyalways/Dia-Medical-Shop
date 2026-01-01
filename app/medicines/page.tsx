"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ১. useRouter ইম্পোর্ট করুন
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, Eye, Search, Filter } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  description?: string;
}

export default function MedicinesPage() {
  const { user } = useAuth();
  const router = useRouter(); // ২. রাউটার ডিক্লেয়ার করুন
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Medicine", "Diaper", "HealthCare", "Surgical"];

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "medicines"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meds = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Medicine[];
      setMedicines(meds);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ৩. আপডেট করা হ্যান্ডলার ফাংশন
  const handleAddToCart = (medicine: Medicine) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex((item: any) => item.id === medicine.id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ 
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        imageUrl: medicine.imageUrl,
        category: medicine.category,
        quantity: 1 
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // সরাসরি কার্ট পেজে রিডাইরেক্ট (আপনার পাথ অনুযায়ী /user/cart)
    router.push("/user/cart"); 
  };

  const filteredMedicines = medicines.filter(med => {
    const categoryMatch = selectedCategory === "All" || med.category === selectedCategory;
    const searchMatch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
            THE <span className="text-emerald-500 italic">VAULT.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
            <span className="w-8 h-[2px] bg-emerald-500 inline-block"></span> 
            Premium Pharmacy Selection
          </p>
        </div>
        
        {/* Search & Filter UI */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border-none rounded-2xl outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 w-full sm:w-64 font-bold shadow-sm transition-all"
            />
          </div>
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-12 pr-10 py-4 bg-white border-none rounded-2xl outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 font-bold shadow-sm appearance-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
           <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
          {filteredMedicines.map(medicine => (
            <div key={medicine.id} className="group flex flex-col h-full">
              {/* Image Container */}
              <div className="relative aspect-[4/5] w-full bg-white rounded-[2rem] overflow-hidden shadow-sm transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 border border-slate-50">
                <img
                  src={medicine.imageUrl || "https://via.placeholder.com/600x750?text=Premium+Medicine"}
                  alt={medicine.name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                />
                
                <div className="absolute top-6 left-6">
                  <span className="backdrop-blur-xl bg-white/70 text-slate-800 text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm border border-white/50">
                    {medicine.category}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="absolute bottom-6 right-6 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <Link href={`/medicines/${medicine.id}`} className="flex items-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-emerald-500 hover:text-white transition-colors">
                    <Eye size={14} /> View Details
                  </Link>
                </div>
              </div>

              {/* Content Section */}
              <div className="pt-6 px-2 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-emerald-500 transition-colors duration-300">
                    {medicine.name}
                  </h3>
                  <span className="text-xl font-black text-slate-900 tracking-tighter">৳{medicine.price}</span>
                </div>
                
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 leading-relaxed">
                  {medicine.description || "Limited Edition Clinical Grade"}
                </p>
                
                <button 
                  onClick={() => handleAddToCart(medicine)}
                  className="w-full mt-auto flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-slate-900/20 hover:bg-emerald-500 transition-all active:scale-95"
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredMedicines.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-slate-200">
          <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-sm">Stock Unavailable</p>
        </div>
      )}
    </div>
  );
}